import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import {Heading3} from '../design-system/FontSystem';
import {ChevronLeftIcon} from '../design-system/IconSystem';

const ScreenHeader = ({navigation, title}) => {
  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View
      style={{
        paddingVertical: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
      <TouchableOpacity onPress={handleGoBack}>
        <ChevronLeftIcon />
      </TouchableOpacity>
      <Heading3>{title}</Heading3>
      <View style={{width: 24, height: 24}} />
    </View>
  );
};

export default ScreenHeader;
