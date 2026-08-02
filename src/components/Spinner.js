import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Easing,
} from 'react-native';
import { COLORS } from '../styles/colors';

const Spinner = ({ size = 40, color = COLORS.primary }) => {
  const rotateValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(rotateValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    animation.start();

    return () => animation.stop();
  }, []);

  const rotate = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const spinnerSize = size;
  const circleSize = size - 8;

  return (
    <View style={[styles.container, { width: spinnerSize, height: spinnerSize }]}>
      <Animated.View
        style={[
          styles.spinner,
          {
            width: spinnerSize,
            height: spinnerSize,
            transform: [{ rotate }],
          },
        ]}
      >
        {[0, 1, 2, 3].map((index) => {
          const angle = index * 90;
          return (
            <View
              key={index}
              style={[
                styles.circle,
                {
                  width: circleSize / 4,
                  height: circleSize / 4,
                  backgroundColor: color,
                  opacity: 0.2 + (index * 0.2),
                  transform: [
                    { rotate: `${angle}deg` },
                    { translateX: spinnerSize / 2 - circleSize / 8 },
                  ],
                },
              ]}
            />
          );
        })}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinner: {
    position: 'relative',
  },
  circle: {
    position: 'absolute',
    borderRadius: 4,
    top: 0,
    left: 0,
  },
});

export default Spinner;
