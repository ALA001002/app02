import Vue from 'vue'
import VueI18n from 'vue-i18n'
import store from '../store'
import { Locale } from 'vant'
import en from './lang/en'
import ven from 'vant/lib/locale/lang/en-US'
import zh_hk from './lang/zh_hk'
import vzh_hk from 'vant/lib/locale/lang/zh-HK'
import es from './lang/es'
import ves from 'vant/lib/locale/lang/es-ES'
import pt from './lang/pt'
import vpt from './lang/vpt'
import iny from './lang/iny'
import viny from './lang/viny'
import ar from './lang/ar'
import vary from './lang/var'
// import zh from './lang/zh'
// import vzh from 'vant/lib/locale/lang/zh-CN'
// import tr from './lang/tr'
// import vtr from './lang/vtr'
// import per from './lang/per'
// import vper from './lang/vper'
// import ru from './lang/ru'
// import vru from './lang/vru'
// import de from './lang/de'
// import vde from 'vant/lib/locale/lang/de-DE'
// import ja from './lang/ja'
// import vja from 'vant/lib/locale/lang/ja-JP'
// import ko from './lang/ko'
// import vko from './lang/vko'
// import th from './lang/th'
// import vth from './lang/vth'

// import ar from './lang/ar'
// import vars from './lang/var'
// import fr from './lang/fr'
// import vfr from './lang/vfr'


const messages = {
  iny: { ...iny, ...viny },
  ar: { ...ar, ...vary },
  es: { ...es, ...ves },
  en: { ...en, ...ven },
  pt: { ...pt, ...vpt },
  zh_hk: { ...zh_hk, ...vzh_hk },
  // tr: {...tr, ...vtr},
  // per: {...per, ...vper},
  // zh: { ...zh, ...vzh }, // 开发使用
 /* fr: { ...fr, ...vfr },
  th: { ...th, ...vth },
  de: { ...de, ...vde },
  ru: { ...ru, ...vru },
  ja: { ...ja, ...vja },
  ko: { ...ko, ...vko },*/
  // ar: { ...ar, ...vars },
}

Vue.use(VueI18n)
//从localStorage中拿到用户的语言选择。
const locale = localStorage.lang || 'en'
const i18n = new VueI18n({ messages })
store.set('lang', locale)

i18n.changeLang = function (lang) {
  Locale.use(lang, messages[lang])
  localStorage.lang = i18n.locale = lang
  store.set('lang', lang)
}

i18n.changeLang(locale)

export const langs = [

  { id: 'en', name: 'English' },
  { id: 'iny', name: 'हिंदी' },
  { id: 'ar', name: 'عربي' },
  { id: 'es', name: 'Español' },
  { id: 'pt', name: 'Português' },
  { id: 'zh_hk', name: '中文繁體' },
  // { id: 'per', name: 'فارسی' },
  // { id: 'zh', name: '简体中文' },
  // { id: 'tr', name: 'Türkçe' },

  /*{ id: 'fr', name: 'Français' },
  { id: 'de', name: 'Deutsch' },
  { id: 'ru', name: 'Русский язык' },
  { id: 'ja', name: 'にほんご' },
  { id: 'ko', name: '한국어' },
  { id: 'th', name: 'ภาษาไทย' },*/
  // { id: 'ar', name: 'عربي' },
]

export default i18n
window.i18n = i18n
