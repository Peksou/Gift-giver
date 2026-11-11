import { Dimensions } from 'react-native';

export const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const AVATAR_LIST = [
  require('../../assets/avatars/avatar14.png'), /*bonhomme de neige*/
  require('../../assets/avatars/avatar22.png'), /*renne noël*/
  require('../../assets/avatars/avatar23.png'), /*petit renne noël*/
  require('../../assets/avatars/avatar01.png'), /*homme blanc chauve*/
  require('../../assets/avatars/avatar15.png'), /*homme noir*/
  require('../../assets/avatars/avatar16.png'), /*femme noire*/
  require('../../assets/avatars/avatar21.png'), /*femme blanche*/
  require('../../assets/avatars/avatar02.png'), /*fille blanche*/
  require('../../assets/avatars/avatar03.png'), /*garçon blanc*/
  require('../../assets/avatars/avatar08.png'), /*femme indienne*/
  require('../../assets/avatars/avatar17.png'), /*enfant indien*/
  require('../../assets/avatars/avatar19.png'), /*fille noire*/
  require('../../assets/avatars/avatar20.png'), /*garçon noir*/
  require('../../assets/avatars/avatar09.png'), /*homme blanc énervé*/
  require('../../assets/avatars/avatar10.png'), /*femme blanche blonde*/
  require('../../assets/avatars/avatar06.png'), /*mère noël*/
  require('../../assets/avatars/avatar13.png'), /*père noël*/
  // require('../../assets/avatars/avatar04.png'), /*fille blanche*/
  // require('../../assets/avatars/avatar05.png'), /*garçon blanc*/
  // require('../../assets/avatars/avatar07.png'), /*homme blanc barbue*/
  // require('../../assets/avatars/avatar18.png'), /*fille noire*/
];

export const SOUNDS = {
  DRUMROLL: require('../../assets/sounds/drumroll.mp3'),
  TADA: require('../../assets/sounds/tada.mp3'),
  JINGLE_BELLS: require('../../assets/sounds/Jingle_Bells.mp3'),
};

export const COLORS = {
  GRADIENT: ['#B30000', '#ffd900ff'] as const,
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