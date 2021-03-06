import { withStyles } from '../../tools/withStyles';
import { withAnimation } from '../../tools/withAnimation';
import { withSounds } from '../../tools/withSounds';
import { Component } from './OpeningAnimation';
import { styles } from './OpeningAnimationStyles.styles';

const Brand = withAnimation()(withStyles(styles)(withSounds()(Component)));

export { Brand };
