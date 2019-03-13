import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import moment from 'moment'
import cls from 'classnames'

import ajaxUrl from '../../assets/js/ajaxUrl'
import utils from '../../assets/js/utils'

import './index.scss'
import IconFont from '../IconFont'

import common from '../../assets/js/common'

import { set as setGlobalData, get as getGlobalData } from '../../assets/js/global_data'


export default class CommmentItem extends Component {
	config = {
	}

	static defaultProps = {
		itemData: {}
	}

	constructor(props) {
		super(props)
		const { itemData } = this.props
		this.state = {
			show: false,
			itemData,
			...itemData
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
					dataFrom: 'comment',
					dataId: itemData.commentId,
					userId: userInfo.userId
				}
			}).then(res => {
				// console.log(hasPraise ? '已点赞' : '已取消点赞')
			})
		})
	}

	showMenu = e => {
		e.stopPropagation()
		const userInfo = getGlobalData('userInfo')
		let { itemData } = this.state
		if (itemData.userId === userInfo.userId) {
			this.setState({
				show: !this.state.show
			})
		}
	}

	hideMenu = e => {
		this.setState({
			show: false
		})
	}

	delItem = e => {
		e.stopPropagation()
		const that = this
		let { itemData } = this.state
		Taro.showModal({
			content: '确定删除吗？'
		}).then(res => {
			res.confirm && utils.httpRequest({
				url: ajaxUrl.delComment,
				method: 'GET',
				data: {
					commentId: itemData.commentId
				}
			}).then(() => {
				that.setState({
					isDel: true
				})
			})
		})
	}

	render() {
		const { itemData, hasPraise, praiseNum, list, dir, elemId, show, isDel } = this.state
		if (!itemData) return null
		return (
			<View
				className='comment-item-wrapper'
				onLongpress={this.showMenu}
				onClick={this.hideMenu}
				hidden={isDel}
			>
				<View className='comment-item__hd flex'>
					<View className='user-info'>
						<Text className='user-name'>{itemData.userNickname}</Text>
						<Text className='comment-time'>{common.formatTime(moment(itemData.createTime))}</Text>
					</View>
					<View className='like-wrapper' onClick={this.handleDoLike}>
						<IconFont type={hasPraise ? 'heart' : 'heart-o'} />
						<Text className='num'>{praiseNum || 0}</Text>
					</View>
				</View>
				<View className='comment-item__bd'>
					<Text>{itemData.commentContent}</Text>
				</View>
				<View className='comment-item__menu' hidden={!show}>
					<View className='menu-item' onClick={this.delItem}>删除</View>
				</View>

			</View>
		)
	}
}