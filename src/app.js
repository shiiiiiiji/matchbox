import Taro, { Component } from "@tarojs/taro";
import Home from "./pages/home";
import {
  set as setGlobalData,
  get as getGlobalData
} from "./assets/js/global_data";

import "./app.scss";

class App extends Component {
  constructor(props) {
    super(props);
  }

  config = {
    pages: [
      // 首页
      "pages/home/home",
      "pages/idea_detail/idea_detail",
      "pages/proj_detail/proj_detail",

      // 发布
      "pages/issue_index/issue_index",
      "pages/issue_idea/issue_idea",
      "pages/issue_proj/issue_proj",
      "pages/issue_self/issue_self",

      // 用户相关
      "pages/user/user",
      "pages/user_info/user_info",

      "pages/contact_us/contact_us",
      "pages/my_notice/my_notice",
      "pages/my_issue/my_issue",

      "pages/guide/guide",
      "pages/banner/banner",

      "pages/select_tag/index",
    ],

    tabBar: {
      list: [
        {
          iconPath: "assets/images/home.png",
          selectedIconPath: "assets/images/home_on.png",
          pagePath: "pages/home/home",
          text: "首页"
        },
        // {
        //   iconPath: "assets/images/pub.png",
        //   selectedIconPath: "assets/images/pub_on.png",
        //   pagePath: "pages/issue_index/issue_index",
        //   text: "发布"
        // },
        {
          iconPath: "assets/images/user.png",
          selectedIconPath: "assets/images/user_on.png",
          pagePath: "pages/user/user",
          text: "我的"
        }
      ],
      color: "#000",
      selectedColor: "#000",
      backgroundColor: "#fff",
      borderStyle: "black"
    },
    window: {
      backgroundTextStyle: "light",
      navigationBarBackgroundColor: "#fff",
      navigationBarTitleText: "ideahub",
      navigationBarTextStyle: "black"
    }
  };

  componentDidMount() {
    setGlobalData("appName", "ideahub");
    setGlobalData("contactWeChat", "wyz2649933604");
  }

  componentDidShow() {}

  componentDidHide() {}

  componentCatchError() {}

  render() {
    return <Home />;
  }
}

Taro.render(<App />, document.getElementById("app"));
