import Taro, { Component } from '@tarojs/taro'
import { View, Text, OpenData } from '@tarojs/components'

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
	}

	render() {
		return (
			<View className='user-wrapper'>
				<View className='user-info'>
					<View className='user-avatar'>
						<OpenData type='userAvatarUrl' />
					</View>
					<View className='user-name'>
						<OpenData type='userNickName' />
					</View>
					<View className='setting'>
						<Text>设置</Text>
						<IconFont type='cog' />
					</View>
				</View>
				<View className='action-list'>
					<Navigator className='action-item my-pub flex'>
						<View className='title flex flex-item'>
							<View className='icon-wrapper'>
								<IconFont type='plus' />
							</View>
							<Text className='txt'>我的发布</Text>
						</View>
						<IconFont type='angle-right' />
					</Navigator>
					<Navigator className='action-item my-notice flex'>
						<View className='title flex flex-item'>
							<View className='icon-wrapper'>
								<IconFont type='bell' />
							</View>
							<Text className='txt'>我的通知</Text>
						</View>
						<IconFont type='angle-right' />
					</Navigator>
					<Navigator className='action-item contact flex'>
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