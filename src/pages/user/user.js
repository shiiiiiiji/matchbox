import Taro, { Component } from '@tarojs/taro'
import { View, Text, OpenData } from '@tarojs/components'
import utils from '../../assets/js/utils'
import ajaxUrl from '../../assets/js/ajaxUrl'

import './index.scss'

import IconFont from '../../components/IconFont'

export default class App extends Component {
	config = {
		navigationBarBackgroundColor: '#ffd004',
		backgroundColor: '#eeeeee',
		navigationBarTitleText: ''
	}

	constructor() {
		super(...arguments)
		this.state = {
			userInfo: {},
			unReadMsgNum: 0
		}
	}

	componentDidMount() {
		utils.login().then(res => {
			this.setState({
				userInfo: res
			})
		})
	}

	componentDidShow() {
		utils.login().then(res => {
			utils.httpRequest({
				url: ajaxUrl.getUserDetail,
				method: 'GET',
				data: {
					userId: res.userId,
					wchatOpenid: res.wchatOpenid
				}
			}).then(res => {
				this.setState({
					userInfo: res.data
				})
			})
			this.getUnReadMsgNum(res);
		})
	}

	getUnReadMsgNum(userInfo){
		if(!userInfo.userId) return;
		utils.httpRequest({
			url: ajaxUrl.getMsgUnReadNum,
			method: 'GET',
			data: {
				userId: userInfo.userId
			}
		}).then(res => {
			this.setState({
				unReadMsgNum: res.data
			})
		})
	}

	jump2Info = () => {
		Taro.navigateTo({
			url: '/pages/user_info/user_info'
		})
	}

	render() {
		const { userInfo, unReadMsgNum } = this.state
		return (
			<View className='user-wrapper'>
				<View className='user-info'>
					<View className='user-name'>{userInfo.userNickname || '-'}</View>
					<View className='setting' onClick={this.jump2Info}>
						<Text>设置</Text>
						<IconFont type='cog' />
					</View>
				</View>
				<View className='action-list'>
					<Navigator
						className='action-item my-pub flex'
						url='/pages/my_issue/my_issue'
					>
						<View className='title flex flex-item'>
							<View className='icon-wrapper'>
								<IconFont type='plus' />
							</View>
							<Text className='txt'>我的发布</Text>
						</View>
						<IconFont type='angle-right' />
					</Navigator>
					<Navigator
						className='action-item my-notice flex'
						url='/pages/my_notice/my_notice'
					>
						<View className='title flex flex-item'>
							<View className='icon-wrapper'>
								<IconFont type='bell' />
							</View>
							<Text className='txt'>我的通知</Text>
							{unReadMsgNum ? <View className="unread-msg">{unReadMsgNum}</View> : null}
						</View>
						<IconFont type='angle-right' />
					</Navigator>
					<Navigator
						className='action-item contact flex'
						url='/pages/contact_us/contact_us'
					>
						<View className='title flex flex-item'>
							<View className='icon-wrapper'>
								<IconFont type='commenting-o' />
							</View>
							<Text className='txt'>联系我们</Text>
						</View>
						<IconFont type='angle-right' />
					</Navigator>
				</View>
			</View>
		)
	}
}