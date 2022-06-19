import React from 'react';
import {TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Heading5} from '../design-system/FontSystem';

export default function Button({title, onPress, style, disabled = false}) {
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress} disabled={disabled}>
      <LinearGradient
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        colors={['#9CFF83', '#14F1FF']}
        style={{
          height: 48,
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 24,
          ...style,
        }}>
        <Heading5 style={{color: '#000000'}}>{title}</Heading5>
      </LinearGradient>
    </TouchableOpacity>
  );
}
