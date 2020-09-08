import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import logo from './logo.svg';
import './App.css';
import { ThemeProvider, createTheme } from 'arwes';
import { lighten, darken } from 'polished';
import { SoundsProvider, createSounds } from 'arwes';
import { withStyles } from '../tools/withStyles';
import { Sequence } from '../components/Sequence';
import { Brand } from '../components/OpeningAnimation';
import { Menu } from '../components/Menu';

import { Header } from '../Header';
import { Footer } from '../Footer';
import { AppContent } from '../AppContent';

const electron = require('electron')

// this is the main theme?

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

const styles = theme => ({
  root: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    display: 'flex',
    flexDirection: 'column'
  },
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflowX: 'hidden',
    overflowY: 'auto',
    width: '100%'
  },

  '@media (min-width: 768px)': {
    content: {
      overflow: 'hidden'
    }
  }
});

export { styles };


const { app, BrowserWindow } = require('electron')


// stuff for electron 
function createWindow () {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // and load the index.html of the app.
  win.loadFile('index.html')
}

// this is the sound player
// move this to small_components file/folder
const Player = withSounds()(props => (
    <button
        style={{ margin: 10 }}
        onClick={() => props.sounds[props.id].play()}
    >
        Play {props.id}
    </button>
));

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow)


// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
// these are the sounds the sound player uses
// move this to config file
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
  class Component extends React.Component {
    static displayName = 'Header';
  
    static propTypes = {
      theme: PropTypes.object.isRequired,
      classes: PropTypes.object.isRequired,
      className: PropTypes.any,
      children: PropTypes.any
    };
  
    componentDidMount () {
      window.addEventListener('route-change-start', this.onRouteChangeStart);
      window.addEventListener('route-change', this.onRouteChange);
    }
  
    componentWillUnmount () {
      window.removeEventListener('route-change-start', this.onRouteChangeStart);
      window.removeEventListener('route-change', this.onRouteChange);
    }
  
    onRouteChangeStart = ({ detail: { isInternal, href } }) => {
      if (isInternal && href === '/') {
        this.header.exit();
        this.footer.exit();
      }
    }
  
    onRouteChange = () => {
      this.contentElement.scrollTo(0, 0);
    }
  
    render () {
      const {
        theme,
        classes,
        className,
        children,
        ...etc
      } = this.props;
  
      return (
        <div className={cx(classes.root, className)} {...etc}>
          <Header
            className={classes.header}
            ref={ref => (this.header = ref)}
          />
          <div
            className={classes.content}
            ref={ref => (this.contentElement = ref)}
          >
            <AppContent>
              {children}
            </AppContent>
            <Footer
              className={classes.footer}
              ref={ref => (this.footer = ref)}
            />
          </div>
        </div>
      );
    }
  }

  export { Component };

  // this is the menu system inside the main page
class TestApp extends React.Component {
  onLinkStart = (event, { isInternal }) => {
    if (isInternal) {
      this.sequenceElement.exit();
    }
  }
  
  render () {
    const { classes } = this.props;

    return (
      <Sequence ref={ref => (this.sequenceElement = ref)}>
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
        </Sequence>
      );
    }
  }
  
  Component.propTypes = {
    classes: PropTypes.any.isRequired
  };


  export default withStyles(styles)(TestApp);