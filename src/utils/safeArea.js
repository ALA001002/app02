import safeAreaInsets from 'safe-area-insets'
import store from '@/store/index'

store.set('config@bottom', 10)
safeAreaInsets.onChange((style) => {
  store.set('config@bottom', style['bottom'] || 0)
})
