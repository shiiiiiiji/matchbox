import Taro, { Component } from '@tarojs/taro'
import Home from './pages/home'
import { set as setGlobalData, get as getGlobalData } from './assets/js/global_data'

import './app.scss'

class App extends Component {

  constructor(props) {
    super(props)
  }

  config = {
    pages: [
      // 首页
      'pages/home/home',
      'pages/idea_detail/idea_detail',
      'pages/proj_detail/proj_detail',

      // 发布
      'pages/pub/pub',

      // 用户相关
      'pages/user/user',
      'pages/user/user_info/user_info',
    ],

    tabBar: {
      list: [{
        'iconPath': 'assets/images/home.png',
        'selectedIconPath': 'assets/images/home_on.png',
        pagePath: 'pages/home/home',
        text: '首页'
      }, {
        'iconPath': 'assets/images/pub.png',
        'selectedIconPath': 'assets/images/pub_on.png',
        pagePath: 'pages/pub/pub',
        text: '发布'
      }, {
        'iconPath': 'assets/images/user.png',
        'selectedIconPath': 'assets/images/user_on.png',
        pagePath: 'pages/user/user',
        text: '我的'
      }],
      'color': '#000',
      'selectedColor': '#000',
      'backgroundColor': '#fff',
      'borderStyle': 'black'
    },
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: '梦想合伙人',
      navigationBarTextStyle: 'black'
    }
  }

  componentDidMount() {
    setGlobalData('appName', '火柴盒')
  }

  componentDidShow() { }

  componentDidHide() { }

  componentCatchError() { }

  render() {
    return (
      <Home />
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
