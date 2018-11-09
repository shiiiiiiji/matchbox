import Taro, { Component } from '@tarojs/taro'
import { View, Button, Icon } from '@tarojs/components'
import cls from 'classnames'

import common from '../../assets/js/common'
import IconFont from '../IconFont'

import './index.scss'

export default class IdeaItem extends Component {
	static defaultProps = {
		itemData: {}
	}

	constructor() {
	}

	handleClickChat = (e) => {
		e.stopPropagation()
		common.copyWeChat('data')
	}

	jump2Detail = () => {
		const { itemData } = this.props
		if (itemData.isDetail) return false
		Taro.navigateTo({
			url: '/pages/idea_detail/idea_detail'
		})
	}

	render() {
		const { itemData } = this.props
		// console.log(itemData)
		return (
			<View className='idea-item-wrapper' onClick={this.jump2Detail}>
				<View className='idea-item__header flex'>
					<View className='idea-meta-info'>
						<Text className='user-name'>用户名</Text>
						<Text className='pub-time'>{common.formatTime(1541570260901)}</Text>
					</View>
					<Text className='top'>置顶</Text>
				</View>
				<View className='idea-item__content'>
					<Text className={cls(
						'idea-content',
						!itemData.isDetail && 'ellipsis'
					)}>我想要开着飞机上天，我想要开着飞机上天，我想要开着飞机上天，我想要开着飞机上天，我想要开着飞机上天，我想要开着飞机上我想要开着飞我想要开着飞机上天，我想要开着飞机上天，我想要开着飞机上天，我想要开着飞机上天，我想要开着飞机上天，我想要开着飞机上我想要开着飞我想要开着飞机上天，我想要开着飞机上天，我想要开着飞机上天，我想要开着飞机上天，我想要开着飞机上天，我想要开着飞机上我想要开着飞</Text>
				</View>
				<View className='idea-item__footer flex'>
					<View className='chat' onClick={this.handleClickChat}>找TA聊聊</View>
					<View className='idea-action-list flex-item'>
						<View className='action-item like flex'>
							<IconFont type={true ? 'heart' : 'heart-o'} />
							<Text className='num'>52</Text>
						</View>
						<View className='action-item comment flex'>
							<IconFont type='comments-o' />
							<Text className='num'>52</Text	>
						</View>
						<View className='action-item share flex'>
							<IconFont type='share-alt' />
						</View>
					</View>
				</View>
			</View>
		)
	}
}