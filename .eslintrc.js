module.exports = {
  root: true,
  env: {
    node: true
  },
  globals: {
    'plus': true
  },
  extends: ['plugin:vue/essential', 'eslint:recommended'],
  rules: {
    'no-console': 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    //强制使用单引号
    quotes: ['error', 'single'],
    //强制不使用分号结尾
    semi: ['error', 'never'],
    'vue/no-unused-components': 'warn'
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
