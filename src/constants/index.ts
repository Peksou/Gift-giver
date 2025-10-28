import { Dimensions } from 'react-native';

export const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const AVATAR_LIST = [
  require('../../assets/avatars/avatar01.png'),
  require('../../assets/avatars/avatar02.png'),
  require('../../assets/avatars/avatar03.png'),
  require('../../assets/avatars/avatar04.png'),
  require('../../assets/avatars/avatar05.png'),
  require('../../assets/avatars/avatar06.png'),
  require('../../assets/avatars/avatar07.png'),
  require('../../assets/avatars/avatar08.png'),
  require('../../assets/avatars/avatar09.png'),
  require('../../assets/avatars/avatar10.png'),
  require('../../assets/avatars/avatar11.png'),
  require('../../assets/avatars/avatar12.png'),
];

export const SOUNDS = {
  DRUMROLL: require('../../assets/sounds/drumroll.mp3'),
  TADA: require('../../assets/sounds/tada.mp3'),
  JINGLE_BELLS: require('../../assets/sounds/Jingle_Bells.mp3'),
};

export const COLORS = {
  GRADIENT: ['#B30000', '#FFD700'] as const,
  PRIMARY: '#4CAF50',
  SECONDARY: '#2196F3',
  DISABLED: '#aaa',
  GRAY: '#6b7280',
};

export const ANIMATION_DURATIONS = {
  DRAW_DELAY: 1800,
  STAGGER_DELAY: 50,
  BOUNCE_DURATION: 120,
  SPIN_DURATION: 900,
};

export const CONFETTI_CONFIG = {
  COUNT: 180,
  EXPLOSION_SPEED: 350,
  FALL_SPEED: 3000,
  FADE_OUT: false,
};

export const SNOWFALL_CONFIG = {
  COUNT: 20,
  HOME_COUNT: 20,
  RESULTS_COUNT: 25,
};