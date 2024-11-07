import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Loan from '../views/loan/Index'
import store from '../store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/loan',
    name: 'Loan',
    meta: { index: 100 },
    component: Loan
  },
  {
    path: '/home',
    name: 'Home',
    meta: { index: 1, noAuth: true },
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    meta: { index: 1 },
    component: () => import('../views/Login.vue')
  },
  {
    path: '/forget/:type',
    name: 'forget',
    meta: { index: 2 },
    component: () => import('../views/Forget.vue')
  },
  {
    path: '/register',
    name: 'register',
    meta: { index: 2 },
    component: () => import('../views/Register.vue')
  },
  {
    path: '/timecontract',
    name: 'timecontract',
    meta: { index: 2,noAuth: true },
    component: () => import('../views/timecontract/index.vue')
  },
  {
    path: '/contract',
    name: 'Contract',
    meta: { index: 1, noAuth: true },
    component: () => import('../views/contract/Index.vue')
  },
  {
    path: '/DeFi',
    name: 'DeFi',
    meta: { index: 1, noAuth: true },
    component: () => import('../views/DeFi/Index.vue')
  },
  {
    path: '/DeFi/detail/:type',
    name: 'DeFi-detail',
    meta: { index: 3 },
    component: () => import('../views/DeFi/Detail.vue')
  },
  {
    path: '/DeFi/place/:id',
    name: 'DeFi-place',
    meta: { index: 3 },
    component: () => import('../views/DeFi/Place.vue')
  },
  {
    path: '/switch',
    name: 'Switch',
    meta: { index: 1 },
    component: () => import('../views/switch/Index.vue')
  },
  {
    path: '/otc',
    name: 'OTC',
    meta: { index: 1 },
    component: () => import('../views/otc/Index.vue')
  },
  {
    path: '/otc/order',
    meta: { index: 5 },
    component: () => import('../views/otc/Order.vue')
  },
  {
    path: '/otc/order/:id',
    meta: { index: 7 },
    component: () => import('../views/otc/OrderDetails.vue')
  },
  {
    path: '/account',
    name: 'Account',
    meta: { index: 1 },
    component: () => import('../views/Account.vue')
  },
  {
    path: '/contract/order',
    meta: { index: 9 },
    component: () => import('../views/contract/Order.vue')
  },
  {
    path: '/contract/:code',
    name: 'ContractExchange',
    meta: { index: 5 },
    component: () => import('../views/contract/Exchange.vue')
  },
  {
    path: '/view',
    name: 'WebView',
    meta: { index: 99, noAuth: true },
    component: () => import('../views/WebView.vue')
  },
  {
    path: '/url',
    name: 'url',
    meta: { index: 99, noAuth: true },
    component: () => import('../views/iframe/url.vue')
  },
  {
    path: '/notices',
    name: 'Notices',
    meta: { index: 11 },
    component: () => import('../views/Notices.vue')
  },
  {
    path: '/setting',
    meta: { index: 7 },
    component: () => import('../views/setting/Index.vue')
  },
  {
    path: '/setting/account',
    meta: { index: 5 },
    component: () => import('../views/setting/Account.vue')
  },
  {
    path: '/vip',
    meta: { index: 5 },
    component: () => import('../views/Vip.vue')
  },
  {
    path: '/invite',
    meta: { index: 5 },
    component: () => import('../views/Invite.vue')
  },
  {
    path: '/welfareCenter',
    name: 'welfareCenter',
    meta: { index: 6 },
    component: () => import('../views/welfareCenter/Index.vue')
  },
  {
    path: '/msgCenter',
    name: 'MsgCenter',
    meta: { index: 6 },
    component: () => import('../views/MsgCenter.vue')
  },
  {
    path: '/SysNotices',
    name: 'sysNotices',
    meta: { index: 7 },
    component: () => import('../views/SysNotices.vue')
  },
  {
    path: '/Activity',
    name: 'Activity',
    meta: { index: 7 },
    component: () => import('../views/Activity.vue')
  },
  {
    path: '/Announcement',
    name: 'Announcement',
    meta: { index: 7 },
    component: () => import('../views/Announcement.vue')
  },
  {
    path: '/setting/nickname',
    meta: { index: 11 },
    component: () => import('../views/setting/Nickname.vue')
  },
  {
    path: '/setting/phone',
    meta: { index: 11 },
    component: () => import('../views/setting/Phone.vue')
  },
  {
    path: '/setting/email',
    meta: { index: 11 },
    component: () => import('../views/setting/Email.vue')
  },
  {
    path: '/setting/lang',
    meta: { index: 9 },
    component: () => import('../views/setting/Lang.vue')
  },
  {
    path: '/setting/avatar',
    meta: { index: 9 },
    component: () => import('../views/setting/Avatar.vue')
  },
  {
    path: '/wallet/details/:coin',
    name: 'WalletDetails',
    meta: { index: 9 },
    component: () => import('../views/wallet/Details.vue')
  },
  {
    path: '/wallet/:goto',
    meta: { index: 5 },
    component: () => import('../views/wallet/CoinSelect.vue')
  },
  {
    path: '/wallet/deposit/:coin',
    meta: { index: 7 },
    component: () => import('../views/wallet/Deposit.vue')
  },
  {
    path: '/wallet/quicklyBuy/:coin',
    meta: { index: 8 },
    component: () => import('../views/wallet/QuicklyBuy.vue')
  },
  {
    path: '/wallet/manualRecharge/:coin',
    meta: { index: 7 },
    component: () => import('../views/wallet/ManualRecharge.vue')
  },
  {
    path: '/mywallet',
    name: 'MyWallet',
    meta: { index: 1 },
    component: () => import('../views/setting/walletDetail.vue')
  },
  {
    path: '/wallet/withdraw/:coin',
    meta: { index: 7 },
    component: () => import('../views/wallet/Withdraw old.vue')
  },
  {
    path: '/wallet/withdrawAddress/:coin',
    meta: { index: 8 },
    component: () => import('../views/wallet/WithdrawAddress.vue')
  },
  {
    path: '/wallet/addAddress/:coin',
    meta: { index: 9 },
    component: () => import('../views/wallet/addAddress.vue')
  },
  {
    path: '/wallet/bindWithdrawAddr/:coin',
    meta: { index: 7 },
    component: () => import('../views/wallet/BindWithdrawAddr.vue')
  },
  {
    path: '/invite2',
    name: 'Invite',
    meta: { index: 5 },
    component: () => import('../views/invite/Index.vue')
  },
  {
    path: '/switchp',
    name: 'Switchp',
    meta: { index: 6 },
    component: () => import('../views/switch/SwitchPanel.vue')
  },
  {
    path: '/security',
    name: 'Security',
    meta: { index: 10 },
    component: () => import('../views/security/Index.vue')
  },
  {
    path: '/security/password',
    name: 'SecurityPassword',
    meta: { index: 11 },
    component: () => import('../views/security/Password.vue')
  },
  {
    path: '/security/payPassword',
    name: 'SecurityPayPassword',
    meta: { index: 12 },
    component: () => import('../views/security/payPassword.vue')
  },
  {
    path: '/about',
    name: '/About',
    meta: { index: 5 },
    component: () => import('../views/About.vue')
  },
  {
    path: '/help',
    name: '/Help',
    meta: { index: 22 },
    component: () => import('../views/Help.vue')
  },
  {
    path: '/service',
    name: '/Service',
    meta: { index: 5 },
    component: () => import('../views/Service')
  },
  {
    path: '/authentication',
    name: '/Authentication',
    meta: { index: 5 },
    component: () => import('../views/Authentication')
  },
  {
    path: '/myInviter',
    name: '/MyInviter',
    meta: { index: 5 },
    component: () => import('../views/invite/myInviter')
  },

  {
    path: '/payment',
    name: '/Payment',
    meta: { index: 5 },
    component: () => import('../views/payment/Index')
  },
  {
    path: '/repayment',
    name: 'repayment',
    meta: { index: 5 },
    component: () => import('../views/loan/RepaymentPage.vue')
  },
  {
    path: '/payment/:pId',
    meta: { index: 7 },
    component: () => import('../views/payment/Bank')
  },
  {
    path: '/community',
    name: 'Community',
    meta: { index: 1, noAuth: true },
    component: () => import('../views/community/Index')
  },
  {
    path: '/timecontract/order',
    name: 'timecontractOrder',
    meta: { index: 30 },
    component: () => import('../views/timecontract/Order.vue')
  },
  // 期权
  {
    path: '/options',
    name: 'Options',
    meta: { index: 1, noAuth: true },
    component: () => import('../views/options/Index.vue')
  },
  // 现货订单
  {
    path: '/options/spotOrder',
    name: 'Options',
    meta: { index: 1, noAuth: true },
    component: () => import('../views/options/SpotOrder.vue')
  },
  {
    path: '/options/order',
    name: 'OptionsOrder',
    meta: { index: 9 },
    component: () => import('../views/options/Order.vue')
  },
  {
    path: '/record/:symbol/:unit',
    name: 'record',
    meta: { index: 10 },
    component: () => import('../views/options/Records.vue')
  },
  {
    path: '/options/:code',
    name: 'OptionsExchange',
    meta: { index: 5 },
    component: () => import('../views/options/Exchange.vue')
  },
  {
    path: '/optionsV1/:code',
    name: 'OptionsExchange',
    meta: { index: 5 },
    component: () => import('../views/options/ExchangeV1.vue')
  },
  {
    path: '/rule',
    name: 'Rule',
    meta: { index: 10 },
    component: () => import('../views/options/Rule.vue')
  },
  {
    path: '/activity',
    name: 'Activity',
    meta: { index: 1, noAuth: true },
    component: () => import('../views/activity/Index.vue')
  },
  {
    path: '/giveLotteryCode',
    name: 'giveLotteryCode',
    meta: { index: 1, noAuth: true },
    component: () => import('../views/givecode/Give.vue')
  },
  {
    path: '/subscriptionList',
    name: 'SubscriptionList',
    meta: { index: 1, noAuth: true },
    component: () => import('../views/subscription/List.vue')
  },
  {
    path: '/subscriptionSwitch',
    name: 'SubscriptionSwitch',
    meta: { index: 1, noAuth: true },
    component: () => import('../views/subscription/Switch.vue')
  },
  {
    path: '/iframe/:type',
    name: 'Iframe',
    meta: { index: 99, noAuth: true },
    component: () => import('../views/iframe/index.vue')
  },
  {
    path: '/property',
    name: 'Property',
    meta: { index: 1, noAuth: true },
    component: () => import('../views/subscription/Property.vue')
  },
  {
    path: '/licai',
    Name: 'LiCai',
    meta: { index: 5 },
    component: () => import('../views/licai/Index.vue')
  },
  {
    path: '/licaiList',
    Name: 'LiCaiList',
    meta: { index: 5 },
    component: () => import('../views/licai/List.vue')
  },
  {
    path: '/walletPage/main',
    meta: { index: 31 },
    component: () => import('../views/wallet/Main.vue')
  },
  {
    path: '*',
    redirect: '/home'
  }
]

const router = new VueRouter({
  routes
})

// 登录权限判断
router.beforeEach((to, from, next) => {
  var token = store.get('user/token')
  if (to.meta.noAuth) {
    next()
  } else if (!token && to.name !== 'Login' && !to.path.includes('/forget') && !to.path.includes('/register')) {
    next('/login')
  } else {
    next()
  }
})

export default router
