import { useRef } from 'react';
import { Animated, Easing } from 'react-native';
import { ANIMATION_DURATIONS } from '../constants';

export function useAnimations() {
  const spinAnim = useRef(new Animated.Value(0)).current;
  const spinLoopRef = useRef<Animated.CompositeAnimation | null>(null);
  const bounceAnim = useRef(new Animated.Value(1)).current;
  const rowOpacities = useRef<Animated.Value[]>([]);

  const startSpin = () => {
    spinLoopRef.current?.stop();
    spinAnim.stopAnimation();
    spinAnim.setValue(0);

    spinLoopRef.current = Animated.loop(
      Animated.timing(spinAnim, { 
        toValue: 1, 
        duration: ANIMATION_DURATIONS.SPIN_DURATION, 
        easing: Easing.linear, 
        useNativeDriver: true 
      })
    );
    spinLoopRef.current.start();
  };

  const stopSpin = () => {
    spinLoopRef.current?.stop();
    spinAnim.stopAnimation();
  };

  const animateBounce = () => {
    Animated.sequence([
      Animated.timing(bounceAnim, { 
        toValue: 1.2, 
        duration: ANIMATION_DURATIONS.BOUNCE_DURATION, 
        useNativeDriver: true 
      }),
      Animated.spring(bounceAnim, { 
        toValue: 1, 
        friction: 3, 
        useNativeDriver: true 
      }),
    ]).start();
  };

  const animateResultsReveal = (count: number, onComplete?: () => void) => {
    rowOpacities.current = Array.from({ length: count }, () => new Animated.Value(0));
    
    Animated.stagger(
      ANIMATION_DURATIONS.STAGGER_DELAY,
      rowOpacities.current.map((v) =>
        Animated.timing(v, { 
          toValue: 1, 
          duration: 400, 
          useNativeDriver: true 
        })
      )
    ).start(onComplete);
  };

  const getSpinTransform = () => ({
    transform: [{
      rotate: spinAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
      }),
    }],
  });

  return {
    bounceAnim,
    rowOpacities,
    startSpin,
    stopSpin,
    animateBounce,
    animateResultsReveal,
    getSpinTransform,
  };
}