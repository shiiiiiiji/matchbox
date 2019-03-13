import Taro, { Component } from '@tarojs/taro'
import { View, Button, Icon } from '@tarojs/components'
import cls from 'classnames'
import moment from 'moment'
import common from '../../assets/js/common'

import { set as setGlobalData, get as getGlobalData } from '../../assets/js/global_data'

import ajaxUrl from '../../assets/js/ajaxUrl'
import utils from '../../assets/js/utils'

import IconFont from '../IconFont'

import './index.scss'

export default class IdeaItem extends Component {
	static defaultProps = {
		isList: true,
		itemData: {}
	}

	constructor(props) {
		super(props)
		const { isList, itemData } = this.props
		this.state = {
			isList,
			itemData,
			...itemData
		}
	}

	handleClickChat = (e) => {
		e.stopPropagation()
		const { itemData } = this.state
		if (typeof itemData.wchatCode === 'string') {
			const userInfo = getGlobalData('userInfo')
			common.copyWeChat(itemData.wchatCode, () => {
				utils.notice({
					userId: userInfo.userId,
					userNickname: userInfo.userNickname,
					messageType: 'idea',
					dataId: itemData.ideaId,
					dataUserId: itemData.userId,
					dataUserNickname: itemData.ideaNickname
				})
			})
		}
	}

	handleDoLike = e => {
		e.stopPropagation()
		let { hasPraise, praiseNum, itemData } = this.state
		hasPraise = hasPraise ? 0 : 1
		praiseNum += hasPraise ? 1 : -1
		this.setState({
			hasPraise,
			praiseNum
		}, () => {
			const userInfo = getGlobalData('userInfo')
			utils.httpRequest({
				url: ajaxUrl.like,
				method: 'GET',
				data: {
					dataFrom: 'idea',
					dataId: itemData.ideaId,
					userId: userInfo.userId
				}
			}).then(res => {
				// console.log(hasPraise ? '已点赞' : '已取消点赞')
			})
		})
	}

	jump2Detail = () => {
		const { isList, itemData } = this.state
		isList && Taro.navigateTo({
			url: '/pages/idea_detail/idea_detail?id=' + itemData.ideaId
		})
	}

	render() {
		const { isList, itemData, hasPraise, praiseNum } = this.state
		return (
			<View className='idea-item-wrapper' onClick={this.jump2Detail}>
				<View className='idea-item__header flex'>
					<View className='idea-meta-info'>
						<Text className='user-name'>{itemData.ideaNickname}</Text>
						{isList ? null : <Text className='pub-time'>{common.formatTime(moment(itemData.createTime))}</Text>}
					</View>
					<Text className='top' hidden={!itemData.isTop}>置顶</Text>
				</View>
				<View className='idea-item__content'>
					<View className={cls(
						'idea-content',
						isList && !itemData.isTop && 'ellipsis'
					)}>
						<View className="ellipsis-container">
							<View className="ellipsis-content">{itemData.ideaContent}</View>
							<View className="ellipsis-ghost">
								<View className="before"></View>
								<View className="ellipsis-placeholder"></View>
								<View className="ellipsis-more">... 全文</View>
							</View>
						</View>
					</View>
				</View>
				<View className='idea-item__footer flex'>
					{isList || !isList ? null : <View className='chat' onClick={this.handleClickChat}>找TA聊聊</View>}
					{itemData.labelContent ? <View className="tag-wrapper"><View className="icon-wrapper"><IconFont type='hashtag' /></View>{itemData.labelContent}</View> : null}
					
					<View className='idea-action-list flex-item flex'>
						<View className='action-item like' onClick={this.handleDoLike}>
							<Image className='icon' src={hasPraise ? '../../assets/images/like.png' : '../../assets/images/like-o.png'} mode='aspectFill' />
							<Text className='num'>{praiseNum}</Text>
						</View>
						<View className='action-item comment'>
							<Image className='icon' src={'../../assets/images/comment.png'} mode='aspectFill' />
							<Text className='num'>{itemData.commentNum}</Text>
						</View>
						{/* <View className={cls(
							'action-item share flex',
							isList && 'hidden'
						)}>
							<IconFont type='share-alt' />
						</View> */}
					</View>
				</View>
			</View>
		)
	}
}