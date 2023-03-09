import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { colors } from '../../constants';
import Icon from 'react-native-vector-icons/Ionicons';

const CustomInput = ({
  value,
  setValue,
  placeholder,
  secureTextEntry,
  placeholderTextColor,
  onFocus,
  radius,
  width = '100%',
  keyboardType,
  maxLength,
  ioniconName,
}) => {
  return (
    <View style={[styles.rootContainer, { width: width }]}>
      {ioniconName &&
        <Icon name={ioniconName} size={24} color={colors.primary} />
      }

      <TextInput
        placeholder={placeholder}
        onChangeText={setValue}
        value={value}
        secureTextEntry={secureTextEntry}
        style={styles.CustomInput}
        placeholderTextColor={placeholderTextColor}
        onFocus={onFocus}
        borderRadius={radius}
        maxLength={maxLength}
        keyboardType={keyboardType}
      />
    </View>
  );
};

export default CustomInput;

const styles = StyleSheet.create({
  rootContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: colors.white,
    height: 45,
    marginBottom: 10,
    marginTop: 10,
    elevation: 5,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  CustomInput: {
    width: '100%',
    padding: 5,
    paddingLeft: 10,
    backgroundColor: colors.white,
  },
});
