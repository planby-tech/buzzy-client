import React from 'react';
import {Text} from 'react-native';

export const Display1 = ({style, children}) => {
  return (
    <Text
      style={{
        color: '#fff',
        fontFamily: 'SUIT-Bold',
        fontSize: 68,
        lineHeight: 80,
        ...style,
      }}>
      {children}
    </Text>
  );
};

export const Display2 = ({style, children}) => {
  return (
    <Text
      style={{
        color: '#fff',
        fontFamily: 'SUIT-Bold',
        fontSize: 50,
        lineHeight: 60,
        ...style,
      }}>
      {children}
    </Text>
  );
};

export const Display3 = ({style, children}) => {
  return (
    <Text
      style={{
        color: '#fff',
        fontFamily: 'SUIT-Bold',
        fontSize: 40,
        lineHeight: 48,
        ...style,
      }}>
      {children}
    </Text>
  );
};

export const Heading1 = ({style, children}) => {
  return (
    <Text
      style={{
        color: '#fff',
        fontFamily: 'SUIT-Bold',
        fontSize: 32,
        lineHeight: 40,
        ...style,
      }}>
      {children}
    </Text>
  );
};

export const Heading2 = ({style, children}) => {
  return (
    <Text
      style={{
        color: '#fff',
        fontFamily: 'SUIT-Bold',
        fontSize: 24,
        lineHeight: 32,
        ...style,
      }}>
      {children}
    </Text>
  );
};

export const Heading3 = ({style, children}) => {
  return (
    <Text
      style={{
        color: '#fff',
        fontFamily: 'SUIT-Bold',
        fontSize: 20,
        lineHeight: 28,
        ...style,
      }}>
      {children}
    </Text>
  );
};

export const Heading4 = ({style, children}) => {
  return (
    <Text
      style={{
        color: '#fff',
        fontFamily: 'SUIT-Bold',
        fontSize: 16,
        lineHeight: 24,
        ...style,
      }}>
      {children}
    </Text>
  );
};

export const Heading5 = ({style, children, numberOfLines = 1}) => {
  return (
    <Text
      style={{
        color: '#fff',
        fontFamily: 'SUIT-Bold',
        fontSize: 14,
        lineHeight: 20,
        ...style,
      }}
      numberOfLines={numberOfLines}>
      {children}
    </Text>
  );
};

export const Body1 = ({style, children}) => {
  return (
    <Text
      style={{
        color: '#fff',
        fontFamily: 'SUIT-Regular',
        fontSize: 20,
        lineHeight: 28,
        ...style,
      }}>
      {children}
    </Text>
  );
};

export const Body2 = ({style, children}) => {
  return (
    <Text
      style={{
        color: '#fff',
        fontFamily: 'SUIT-Regular',
        fontSize: 16,
        lineHeight: 24,
        ...style,
      }}>
      {children}
    </Text>
  );
};

export const Body3 = ({style, children}) => {
  return (
    <Text
      style={{
        color: '#fff',
        fontFamily: 'SUIT-Regular',
        fontSize: 14,
        lineHeight: 20,
        ...style,
      }}>
      {children}
    </Text>
  );
};

export const Small = ({style, children}) => {
  return (
    <Text
      style={{
        color: '#fff',
        fontFamily: 'SUIT-Regular',
        fontSize: 12,
        lineHeight: 16,
        ...style,
      }}>
      {children}
    </Text>
  );
};

export const Tiny = ({style, children}) => {
  return (
    <Text
      style={{
        color: '#fff',
        fontFamily: 'SUIT-Regular',
        fontSize: 10,
        lineHeight: 16,
        ...style,
      }}>
      {children}
    </Text>
  );
};
