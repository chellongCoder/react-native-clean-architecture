import React, {useState} from 'react';
import Dropdown from 'src/core/components/dropdown/Dropdown';
import {scale} from 'react-native-size-matters';
import {useI18n} from '../hooks/useI18n';
import locales from '../i18n/locales';
import Toast from 'react-native-toast-message';

const DropdownChangeLang = () => {
  const i18n = useI18n();
  const [currentLocale, setCurrentLocale] = useState(i18n.deviceLocale);

  return (
    <Dropdown
      title={currentLocale}
      width={scale(76)}
      onSelectItem={item => {
        setCurrentLocale(item);
        i18n.changeLanguage(item);
        Toast.show({
          type: 'success',
          text1: 'Altered language was updated!',
        });
      }}
      data={Object.keys(locales).map(e => e)}
    />
  );
};

export default DropdownChangeLang;
