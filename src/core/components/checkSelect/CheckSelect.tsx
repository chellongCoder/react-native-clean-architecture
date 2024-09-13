import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';

const CheckSelect = ({
  isSelected,
  name,
  onPress,
}: {
  isSelected?: boolean;
  name?: string;
  onPress?: () => void;
}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.check}>
        {isSelected && <View style={styles.bg} />}
      </View>
      {name && <Text style={styles.text}>{name}</Text>}
    </TouchableOpacity>
  );
};

export default CheckSelect;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  check: {
    width: 18,
    height: 18,
    borderRadius: 10,
    borderWidth: 1,
    padding: 2,
    borderColor: '#258F78',
  },
  text: {
    color: '#258F78',
    fontSize: 12,
    marginLeft: 4,
    marginTop: 1,
  },
  bg: {
    backgroundColor: '#66C270',
    borderRadius: 10,
    width: '100%',
    height: '100%',
  },
});
