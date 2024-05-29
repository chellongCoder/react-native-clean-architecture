import {Alert} from 'react-native';

export function alertMessage(
  message: string,
  content = '',
  noButton?: boolean,
  onPress?: () => void,
) {
  setTimeout(() => {
    Alert.alert(
      message,
      content,
      noButton
        ? []
        : [
            {
              text: 'OK',
              onPress: onPress,
            },
          ],
    );
  }, 0);
}
