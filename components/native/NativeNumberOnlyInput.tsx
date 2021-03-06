import { Ionicons } from '@expo/vector-icons';
import React, { FC, useEffect, useRef, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  TextInputProps,
  View,
  TouchableOpacity,
} from 'react-native';
import colors from '../../constants/colors';
import fonts from '../../constants/fonts';
import NativeInput from './NativeInput';
import NativeText from './NativeText';

interface NativeNumberOnlyInputProps extends TextInputProps {
  max?: number;
  unit?: string;
}

const NativeNumberOnlyInput: FC<NativeNumberOnlyInputProps> = ({
  onChangeText,
  value,
  max,
  unit,
  ...rest
}) => {
  const isPressing = useRef(false);
  const timer = useRef<any>();
  const [currentValue, setCurrentValue] = useState(value);

  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  const add = (offset: number) => () => {
    // console.log('add', offset, currentValue, Number(currentValue) + offset);
    setCurrentValue((cur) => Number(cur) + offset + '');
  };

  const handleChangeText = (text: string) => {
    console.log('handle change text', text);
    setCurrentValue(text);
    onChangeText && onChangeText(text);
  };

  useEffect(() => {
    onChangeText && onChangeText(currentValue!);
  }, [currentValue]);

  const cancelLongPress = () => {
    if (isPressing.current) {
      clearInterval(timer.current);
      isPressing.current = false;
    }
  };

  const onLongPress = (onPress: any) => () => {
    isPressing.current = true;
    timer.current = setInterval(onPress, 50);
  };

  return (
    <View style={styles.numberContainer}>
      <TouchableOpacity
        onPress={add(-1)}
        onLongPress={onLongPress(add(-1))}
        onPressOut={cancelLongPress}
      >
        <Ionicons size={44} name={'ios-remove-circle'} color={colors.primary} />
      </TouchableOpacity>
      <View style={styles.number}>
        <NativeInput
          keyboardType="number-pad"
          {...rest}
          value={currentValue}
          onChangeText={handleChangeText}
          style={styles.input}
        />
        {max !== undefined && <NativeText>/ {max} </NativeText>}
      </View>
      <TouchableOpacity
        onPress={add(1)}
        onLongPress={onLongPress(add(1))}
        onPressOut={cancelLongPress}
      >
        <Ionicons size={44} name={'ios-add-circle'} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  numberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  number: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 'auto',
    marginLeft: 20,
  },
  input: {
    alignItems: 'center',
    fontFamily: fonts.defaultFontFamilyBold,
    fontSize: 26,
    color: colors.primary,
    paddingHorizontal: 5,
  },
});

export default NativeNumberOnlyInput;
