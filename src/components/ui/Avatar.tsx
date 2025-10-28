import React from 'react';
import { TouchableOpacity, Animated, Image, StyleSheet } from 'react-native';

interface AvatarProps {
  source: any;
  index: number;
  isSelected: boolean;
  bounceAnim: Animated.Value;
  onSelect: (index: number) => void;
  size?: 'small' | 'medium' | 'large';
}

const SIZES = {
  small: { wrapper: 35, image: 30, borderRadius: 15 },
  medium: { wrapper: 65, image: 60, borderRadius: 30 },
  large: { wrapper: 85, image: 80, borderRadius: 40 },
};

export function Avatar({ 
  source, 
  index, 
  isSelected, 
  bounceAnim, 
  onSelect, 
  size = 'medium' 
}: AvatarProps) {
  const sizeConfig = SIZES[size];

  return (
    <TouchableOpacity onPress={() => onSelect(index)}>
      <Animated.View
        style={[
          styles.avatarWrapper,
          {
            width: sizeConfig.wrapper,
            height: sizeConfig.wrapper,
            borderRadius: sizeConfig.borderRadius,
          },
          isSelected && styles.selectedAvatar,
          { transform: [{ scale: isSelected ? bounceAnim : 1 }] },
        ]}
      >
        <Image 
          source={source} 
          style={[
            styles.avatarImage,
            {
              width: sizeConfig.image,
              height: sizeConfig.image,
              borderRadius: sizeConfig.borderRadius,
            }
          ]} 
        />
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  avatarWrapper: {
    marginRight: 10,
    borderWidth: 2,
    borderColor: '#ddd',
    overflow: 'hidden',
  },
  avatarImage: {
    resizeMode: 'cover',
  },
  selectedAvatar: {
    borderColor: '#4CAF50',
    borderWidth: 3,
  },
});