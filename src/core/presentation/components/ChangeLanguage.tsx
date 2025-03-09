import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {useI18n} from '../hooks/useI18n';
import locales from '../i18n/locales';
import CheckSelect from 'src/core/components/checkSelect/CheckSelect';
import {scale} from 'react-native-size-matters';
import Toast from 'react-native-toast-message';

interface LanguageOptionProps {
  language: string;
  isSelected: boolean;
  onPress: () => void;
}

const LanguageOption: React.FC<LanguageOptionProps> = ({
  language,
  isSelected,
  onPress,
}) => <CheckSelect onPress={onPress} name={language} isSelected={isSelected} />;

const ChangeLanguage: React.FC = () => {
  const i18n = useI18n();
  const [currentLocale, setCurrentLocale] = useState(Object.keys(locales)[0]);

  const handleLanguageChange = (language: string) => {
    setCurrentLocale(language);
    i18n.changeLanguage(language);
    Toast.show({
      type: 'success',
      text1: 'Altered language was updated!',
    });
  };

  return (
    <View style={styles.container}>
      {Object.keys(locales).map(language => (
        <LanguageOption
          key={language}
          language={language}
          isSelected={currentLocale === language}
          onPress={() => handleLanguageChange(language)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: scale(10),
  },
});

export default ChangeLanguage;
