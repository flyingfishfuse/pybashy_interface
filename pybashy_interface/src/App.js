import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import logo from './logo.svg';
import './App.css';
import { ThemeProvider, createTheme } from 'arwes';
import { lighten, darken } from 'polished';
import { SoundsProvider, createSounds } from 'arwes';
import { withStyles } from '../tools/withStyles';
import { Secuence } from '../components/Secuence';
import { Brand } from '../components/OpeningAnimation';
import { Menu } from '../components/Menu';

const styles = theme => {
    return {
      root: {
        margin: 'auto',
        width: '100%'
      },
      content: {
        display: 'flex',
        flexDirection: 'column',
        margin: [0, 'auto'],
        padding: 20
      },
      brand: {
        margin: [0, 'auto', 30],
        padding: [10, 0],
        width: '100%',
        maxWidth: 700
      },
      menu: {
        margin: [0, 'auto', 20],
        width: '100%',
        maxWidth: 600
      },
      social: {
        margin: [0, 'auto'],
        width: '100%',
        maxWidth: 400
      },
      legal: {
        position: 'absolute',
        left: '50%',
        bottom: 0,
        transform: 'translateX(-50%)'
      }
    };
  };

const Player = withSounds()(props => (
    <button
        style={{ margin: 10 }}
        onClick={() => props.sounds[props.id].play()}
    >
        Play {props.id}
    </button>
));

const sounds = {
    shared: { volume: 1 },
    players: {
        information: { sound: { src: ['/static/sound/information.mp3'] } },
        ask: { sound: { src: ['/static/sound/ask.mp3'] } },
        warning: { sound: { src: ['/static/sound/warning.mp3'] } },
        error: { sound: { src: ['/static/sound/error.mp3'] } },
    },
};

const MyColor = withStyles(theme => ({
  root: {
      width: 300,
      height: 120,
      transition: `background-color ${theme.animTime}ms ease-out`,
      backgroundColor: theme.color.primary.base,
  },}))(props => (
    <div className={props.classes.root} />
    )
  );

class TestApp extends React.Component {
  onLinkStart = (event, { isInternal }) => {
    if (isInternal) {
      this.secuenceElement.exit();
    }
  }
  
  render () {
    const { classes } = this.props;

    return (
      <Secuence ref={ref => (this.secuenceElement = ref)}>
        <div className={classes.root}>
            <div className={classes.content}>
              <OpeningAnimation
                className={classes.OpeningAnimation}
                onLinkStart={this.onLinkStart}
              />
              <Menu
                className={classes.menu}
                animation={{ duration: { enter: 400 } }}
                scheme='expand'
                onLinkStart={this.onLinkStart}
              />
            </div>
          </div>
        </Secuence>
      );
    }
  }
  
  Component.propTypes = {
    classes: PropTypes.any.isRequired
  };
  
  export default withStyles(styles)(TestApp);