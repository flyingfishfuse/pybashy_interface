import React from 'react';
import PropTypes from 'prop-types';

import { isNumber } from '../../tools/general';
import { ENTERING, ENTERED, EXITING, EXITED } from '../../tools/animationStatus';
import { AnimationContext } from '../AnimationContext';

class Component extends React.PureComponent {
  static displayName = 'Sequence';

  static propTypes = {
    theme: PropTypes.object.isRequired,
    stagger: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.number
    ]),
    children: PropTypes.any
  };

  static contextType = AnimationContext;

  constructor () {
    super(...arguments);

    this.prevContext = this.context;
    this.gateContext = {
      subscribe: this.subscribe,
      unsubscribe: this.unsubscribe,
      getEnergy: this.getEnergy
    };

    this.actionStack = [];
    this.timeouts = {};
  }

  componentDidUpdate () {
    const prevStatus = this.prevContext.status;
    const currentStatus = this.context.status;

    if (prevStatus !== currentStatus) {
      if (currentStatus === ENTERING) {
        this.enter();
      } else if (currentStatus === EXITING) {
        this.exit();
      }
    }

    this.prevContext = this.context;
  }

  componentWillUnmount () {
    Object.values(this.timeouts).forEach(timeout => clearTimeout(timeout));
    this.timeouts = {};
  }

  subscribe = (ref, callback) => {
    if (!ref || !callback) {
      throw new Error('Subscriber needs valid Animation component and callback.');
    }

    const createdSubscription = this.actionStack.find(sub => sub && sub.ref === ref);

    if (createdSubscription) {
      return;
    }

    const index = ref.getStackLocation(ref.status);
    const newSubscription = { ref, callback, index };

    this.actionStack = [...this.actionStack, newSubscription];
  }

  unsubscribe = ref => {
    this.actionStack = this.actionStack.map(sub => {
      if (sub && sub.ref === ref) {
        return null;
      }
      return sub;
    });
  }

  getEnergy = ref => {
    const createdSubscription = this.actionStack.find(sub => sub && sub.ref === ref);

    if (createdSubscription) {
      return createdSubscription.index;
    }

    return null;
  }

  enter () {
    const { theme, stagger } = this.props;

    let lastTime = 0;

    this.actionStack.forEach((subscriber, index) => {
      if (!subscriber) {
        return;
      }

      subscriber.index = subscriber.ref.getStackLocation(subscriber.ref.status);

      const duration = subscriber.index.duration.enter;

      let startTime;

      if (stagger) {
        startTime = index * (isNumber(stagger) ? stagger : theme.animation.stagger);
      } else {
        startTime = lastTime;
      }

      const endTime = startTime + duration;
      lastTime = endTime;

      this.schedule(index, startTime, () => {
        this.updateSubscriber(subscriber, ENTERING);

        this.schedule(index, endTime, () => {
          this.updateSubscriber(subscriber, ENTERED);
        });
      });
    });
  }

  exit () {
    const duration = this.props.theme.animation.time;

    this.actionStack.forEach((subscriber, index) => {
      this.updateSubscriber(subscriber, EXITING);

      this.schedule(index, duration, () => {
        this.updateSubscriber(subscriber, EXITED);
      });
    });
  }

  updateSubscriber (subscriber, status) {
    subscriber.index = subscriber.ref.getStackLocation(status);
    subscriber.callback(subscriber.index);
  }

  schedule (key, time, callback) {
    this.unschedule(key);
    this.timeouts[key] = setTimeout(() => callback(), time);
  }

  unschedule (key) {
    clearTimeout(this.timeouts[key]);
  }

  render () {
    const { children } = this.props;

    return (
      <AnimationContext.Provider value={this.gateContext}>
        {children}
      </AnimationContext.Provider>
    );
  }
}

export { Component };
