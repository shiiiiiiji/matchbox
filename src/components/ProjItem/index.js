import Taro, { Component } from '@tarojs/taro'
import { View, Icon } from '@tarojs/components'

import common from '../../assets/js/common'

import IconFont from '../IconFont'

import './index.scss'

export default class ProjItem extends Component {
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
			url: '/pages/proj_detail/proj_detail'
		})
	}

	render() {
		const { itemData } = this.props
		return (
			<View className='proj-item-wrapper' onClick={this.jump2Detail}>
				<View className='proj-item__header flex'>
					<View className='proj-meta-info'>
						<Text className='user-name'>用户名</Text>
						<Text className='pub-time'>{common.formatTime(1541570260901)}</Text>
					</View>
					<Text className='top'>置顶</Text>
				</View>
				<View className='proj-item__content'>
					<View className='proj-content'>
						<View className='proj-content-item flex'>
							<Text className='title'>比赛名称</Text>
							<Text className='value flex-item'>全国大学生数学建模大赛</Text>
						</View>
						<View className='proj-content-item flex'>
							<Text className='title'>招募人数</Text>
							<Text className='value flex-item'>1人</Text>
						</View>
						<View className='proj-content-item flex'>
							<Text className='title'>所需队员年级及专业</Text>
							<Text className='value flex-item'>大二 信电学院</Text>
						</View>
					</View>
				</View>
				<View className='proj-item__footer flex'>
					<View className='chat' onClick={this.handleClickChat}>找TA聊聊</View>
					<View className='proj-action-list flex-item'>
						{/* <View className='action-item like flex'>
							<IconFont type={true ? 'heart' : 'heart-o'} />
							<Text className='num'>52</Text>
						</View>
						<View className='action-item comment flex'>
							<IconFont type='comments-o' />
							<Text className='num'>52</Text	>
						</View> */}
						<View className='action-item share flex'>
							<IconFont type='share-alt' />
						</View>
					</View>
				</View>
			</View>
		)
	}
}