import * as Localization from 'expo-localization';
import {I18n as I18nJs, TranslateOptions} from 'i18n-js';
import locales from './locales';
import {injectable} from 'inversify-sugar';
import {GenericLocale} from './locales/locales';
import {makeAutoObservable} from 'mobx';

@injectable()
class I18n {
  private i18nJs;

  constructor() {
    this.i18nJs = new I18nJs(locales, {defaultLocale: Object.keys(locales)[0]});

    this.i18nJs.enableFallback = true;
    this.i18nJs.locale = Localization.locale.substring(0, 2);
    this.i18nJs.onChange(i18n => {});
    makeAutoObservable(this);
  }

  public t(scope: keyof GenericLocale, options?: TranslateOptions) {
    return this.i18nJs.t(scope, options);
  }

  public changeLanguage(languageCode: string) {
    this.i18nJs = new I18nJs(locales, {defaultLocale: Object.keys(locales)[0]});
    this.i18nJs.enableFallback = true;
    this.i18nJs.locale = languageCode;
  }
}

export default I18n;
