import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import anime from 'animejs';

import { getViewportRange } from '../../tools/viewport';
import { Link } from '../Link';
import { Text } from '../Text';
import { Sequence } from '../Sequence';
import { SCHEME_NORMAL, SCHEME_EXPAND } from './Menu.constants';

class Component extends React.PureComponent {
  static displayName = 'Menu';

  static propTypes = {
    theme: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    index: PropTypes.object.isRequired,
    audio: PropTypes.object.isRequired,
    sounds: PropTypes.object.isRequired,
    className: PropTypes.any,
    scheme: PropTypes.oneOf([SCHEME_NORMAL, SCHEME_EXPAND]),
    onEnter: PropTypes.func,
    onExit: PropTypes.func,
    onLinkStart: PropTypes.func,
    onLinkEnd: PropTypes.func
  };

  static defaultProps = {
    scheme: SCHEME_NORMAL
  };

  constructor () {
    super(...arguments);

    this.state = {
      showSequence: false
    };
  }

  componentDidMount () {
    window.addEventListener('route-change', this.onURLChange);
  }

  componentDidUpdate (prevProps) {
    const { index } = this.props;

    if (prevProps.index.status !== index.status) {
      if (index.entering) {
        this.setState({ showSequence: true }); // eslint-disable-line react/no-did-update-set-state
      } else if (index.exiting) {
        this.setState({ showSequence: false }); // eslint-disable-line react/no-did-update-set-state
      }
    }
  }

  componentWillUnmount () {
    const elements = this.element.querySelectorAll('a, b');
    anime.remove(elements);

    window.removeEventListener('route-change', this.onURLChange);
  }

  onURLChange = () => {
    this.forceUpdate();
  }

  enter () {
    const { scheme } = this.props;

    if (scheme === SCHEME_NORMAL) {
      this.animateNormalEnter();
    } else {
      this.animateExpandEnter();
    }
  }

  animateNormalEnter () {
    const { index, onEnter } = this.props;
    const { duration } = index;

    const divisors = this.element.querySelectorAll('b');
    const links = this.element.querySelectorAll('a');

    anime.set(links, { opacity: 1 });

    anime({
      targets: divisors,
      easing: 'easeOutCubic',
      scaleY: [0, 1],
      duration: duration.enter,
      delay: (divisor, index) => index * duration.stagger,
      complete: () => onEnter && onEnter()
    });
  }

  animateExpandEnter () {
    const { index, sounds, onEnter } = this.props;
    const { duration } = index;
    const viewportRange = getViewportRange();

    const divisors = this.element.querySelectorAll('b');
    const links = this.element.querySelectorAll('a');

    sounds.expand.play();

    if (!viewportRange.small) {
      anime({
        targets: divisors[1],
        easing: 'easeOutCubic',
        scaleY: [0, 1],
        duration: duration.enter / 2
      });
      anime({
        targets: [divisors[0], divisors[2]],
        easing: 'easeOutCubic',
        scaleY: [0, 1],
        translateX: (divisor, index) => [[100, 0, -100][index], 0],
        delay: duration.enter / 2,
        duration: duration.enter / 2
      });
    }

    anime({
      targets: links,
      easing: 'easeOutCubic',
      opacity: 1,
      translateX: (link, index) => [[150, 75, -75, -150][index], 0],
      delay: viewportRange.small ? 0 : duration.enter / 2,
      duration: viewportRange.small ? duration.enter : duration.enter / 2,
      complete: () => onEnter && onEnter()
    });
  }

  exit () {
    const { index, onExit } = this.props;
    const { duration } = index;

    const divisors = this.element.querySelectorAll('b');
    const links = this.element.querySelectorAll('a');

    anime({
      targets: divisors,
      easing: 'easeOutCubic',
      scaleY: [1, 0],
      duration: duration.exit
    });
    anime({
      targets: links,
      easing: 'easeOutCubic',
      opacity: 0,
      duration: duration.exit,
      complete: () => onExit && onExit()
    });
  }

  render () {
    const {
      theme,
      classes,
      index,
      audio,
      sounds,
      className,
      scheme,
      onEnter,
      onExit,
      onLinkStart,
      onLinkEnd,
      ...etc
    } = this.props;
    const { showSequence } = this.state;

    const animateText = scheme === SCHEME_NORMAL;
    const linkProps = {
      className: cx(classes.item, classes.link),
      onMouseEnter: () => sounds.hover.play(),
      onLinkStart,
      onLinkEnd
    };

    return (
      <Sequence
        animation={{ show: showSequence, independent: true }}
        stagger
      >
        <nav
          className={cx(classes.root, className)}
          ref={ref => (this.element = ref)}
          {...etc}
        >
          <Link href='/news' {...linkProps}>
            <Text
              animation={{ animate: animateText }}
              audio={{ silent: !animateText }}
            >
              News
            </Text>
          </Link>
          <b className={cx(classes.item, classes.divisor)}>|</b>
          <Link href='/music' {...linkProps}>
            <Text
              animation={{ animate: animateText }}
              audio={{ silent: !animateText }}
            >
              Music
            </Text>
          </Link>
          <b className={cx(classes.item, classes.divisor)}>|</b>
          <Link href='/charity' {...linkProps}>
            <Text
              animation={{ animate: animateText }}
              audio={{ silent: !animateText }}
            >
              Charity
            </Text>
          </Link>
          <b className={cx(classes.item, classes.divisor)}>|</b>
          <Link href='/about' {...linkProps}>
            <Text
              animation={{ animate: animateText }}
              audio={{ silent: !animateText }}
            >
              About
            </Text>
          </Link>
        </nav>
      </Sequence>
    );
  }
}

export { Component };
