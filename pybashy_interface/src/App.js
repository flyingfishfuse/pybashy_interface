import React from 'react';
import ReactDOM from 'react-dom';
import logo from './logo.svg';
import './App.css';
import { ThemeProvider, createTheme } from 'arwes';
import { lighten, darken } from 'polished';
import { SoundsProvider, createSounds } from 'arwes';

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
  constructor () {
      super(...arguments);
      const color = '#22179a';
      this.state = { color, theme: this.getTheme(color) };
      this.onChange = this.onChange.bind(this);
  }
  render () {
      const { color, theme } = this.state;
      return (
          <Arwes animate background='/static/img/background.jpg' pattern='/static/img/glow.png'>

            </Arwes>
      );
  }
  onChange (ev) {
      const color = ev.target.value;
      const theme = this.getTheme(color);
      this.setState({ color, theme });
  }
  getTheme (color) {
      return createTheme({
          color: {
              primary: { base: color }
          }
      });
  }
}


export default TestApp;
