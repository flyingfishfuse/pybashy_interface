import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '../tools/withStyles';
import { Main } from '../components/Main';
import { Secuence } from '../components/Secuence';
import { Text } from '../components/Text';
import { Fader } from '../components/Fader';
import { Link } from '../components/Link';

const styles = theme => ({
  root: {},
  albums: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  album: {
    padding: [0, 0, 20],
    width: '100%'
  },
  albumCover: {
    display: 'block',
    margin: [0, 0, 20],
    width: '100%',

    '& img': {
      margin: 0,
      width: '100%',
      maxWidth: '100%'
    }
  },
  albumFrame: {
    display: 'block',
    width: '100%'
  },

  '@media screen and (min-width: 768px)': {
    album: {
      padding: 10,
      width: '50%'
    }
  }
});

class Module_list extends React.Component {
  static propTypes = {
    classes: PropTypes.object
  };

  render () {
    const { classes } = this.props;

    return (
      <Main className={classes.root}>
        <Secuence stagger>
          <h1><Text>Music</Text></h1>
          <div className={classes.module_list_item}>
            
            <div className={classes.Module_in_db}>

            </div>
            
            <div className={classes.Module_in_db}>

            </div>
			      
            <div className={classes.Module_in_db}>

            </div>
          </div>
        </Secuence>
    </Main>
  );
  }
}

export default withStyles(styles)(Module_in_db);
