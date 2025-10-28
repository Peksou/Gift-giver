import React, { useRef, useEffect } from 'react';
import { View, Animated, Easing, StyleSheet } from 'react-native';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../../constants';

interface SnowfallProps {
  count?: number;
}

export function Snowfall({ count = 25 }: SnowfallProps) {
  const flakes = Array.from({ length: count }, (_, i) => i);
  
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {flakes.map((i) => {
        const x = Math.random() * SCREEN_WIDTH;
        const start = -Math.random() * SCREEN_HEIGHT;
        const y = useRef(new Animated.Value(start)).current;
        const size = 10 + Math.round(Math.random() * 10);
        const duration = 5000 + Math.random() * 4000;

        useEffect(() => {
          const anim = Animated.loop(
            Animated.sequence([
              Animated.timing(y, { 
                toValue: SCREEN_HEIGHT + 40, 
                duration, 
                easing: Easing.linear, 
                useNativeDriver: true 
              }),
              Animated.timing(y, { 
                toValue: start, 
                duration: 0, 
                useNativeDriver: true 
              }),
            ])
          );
          anim.start();
          return () => anim.stop();
        }, []);

        return (
          <Animated.Text
            key={i}
            style={{
              position: 'absolute',
              left: x,
              transform: [{ translateY: y }],
              opacity: 0.8,
              fontSize: size,
            }}
          >
            ❄️
          </Animated.Text>
        );
      })}
    </View>
  );
}