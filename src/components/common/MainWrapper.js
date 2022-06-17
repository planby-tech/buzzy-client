import React from 'react';
import {SafeAreaView, StyleSheet, Platform} from 'react-native';

export const MainWrapper = ({backgroundcolor = '#000000', ...props}) => {
  const styles = StyleSheet.create({
    androidWrapper: {
      ...props.style,
      padding: props.edgeSpacing,
      backgroundColor: backgroundcolor,
      flex: 1,
    },
    iosWrapper: {
      ...props.style,
      paddingHorizontal: props.edgeSpacing,
      backgroundColor: backgroundcolor,
      flex: 1,
    },
  });
  return (
    <SafeAreaView
      style={Platform.OS === 'ios' ? styles.iosWrapper : styles.androidWrapper}>
      {props.children}
    </SafeAreaView>
  );
};
