import React from 'react';
import {TouchableOpacity} from 'react-native';
import {Heading4} from '../design-system/FontSystem';

export default function SecondaryButton({
  title,
  onPress,
  style,
  disabled = false,
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      disabled={disabled}
      style={{
        backgroundColor: '#202225',
        height: 48,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 24,
        ...style,
      }}>
      <Heading4
        style={{fontSize: 18, color: '#59F9C1', textTransform: 'uppercase'}}>
        {title}
      </Heading4>
    </TouchableOpacity>
  );
}
