import Taro, { Component } from '@tarojs/taro'
import { View, Input, Form, Button } from '@tarojs/components'

import ajaxUrl from '../../assets/js/ajaxUrl'
import utils from '../../assets/js/utils'

import './index.scss'
import IdeaItem from '../../components/IdeaItem';
import CommentItem from '../../components/CommentItem';
import EmptyHolder from '../../components/EmptyHolder'

import { set as setGlobalData, get as getGlobalData } from '../../assets/js/global_data'

export default class IdeaDetail extends Component {
	constructor(props) {
		super(props)
		this.state = {
			reqParams: {
				start: 0,
				length: 10
			},
			commentList: [],
			isEmpty: false,
			noMoreData: false,
			isAfterRequest: false
		}
	}

	config = {
		navigationBarTitleText: '想法详情'
	}

	componentWillMount() {
		// 获取 query 参数
		const queryData = this.$router.params
		this.setState({
			queryData
		})
	}

	componentDidMount() {
		const { queryData } = this.state
		this.requestDetail()
	}

	onShareAppMessage = res => {
		const { ideaInfo } = this.state
		return {
			title: `全球某工商的${ideaInfo.ideaNickname}同学发了一条匿名动态，来瞧瞧~`,
			path: `/pages/home/home?type=idea&share=1&id=${ideaInfo.ideaId}`
		}
	}

	requestDetail = () => {
		const that = this
		const { queryData, reqParams } = this.state
		if (!queryData.id || queryData.id === 'undefined') {
			Taro.showToast({
				icon: 'none',
				title: '参数有误'
			})
			return false;
		}
		utils.login().then(userInfo => {
			utils.httpRequest({
				url: ajaxUrl.getIdeaDetail,
				method: 'GET',
				data: {
					ideaId: queryData.id,
					operateUserId: userInfo.userId
				}
			}).then(res => {
				const ideaInfo = res.data
				reqParams.ideaId = ideaInfo.ideaId
				reqParams.operateUserId = userInfo.userId
				that.setState({
					ideaInfo,
					userInfo,
					reqParams
				}, () => {
					that.requestComment()
				})
			}).catch(err => {
				if (err && err.code == '9986') {
					setTimeout(() => {
						Taro.navigateBack()
					}, 1000)
				}
			})
		})
	}

	requestComment = () => {
		if (this.isLoading) return false
		this.isLoading = true
		let { reqParams, commentList } = this.state
		utils.httpRequest({
			url: ajaxUrl.getCommentList,
			method: 'GET',
			data: reqParams
		}).then(res => {
			this.isLoading = false
			const { dataList, totalRecords } = res
			if (dataList && dataList.length) commentList = commentList.concat(dataList)
			if (commentList.length < totalRecords) {
				reqParams.start += reqParams.length
			}
			this.setState({
				reqParams,
				commentList,
				isAfterRequest: true,
				isEmpty: !commentList.length,
				noMoreData: commentList.length >= totalRecords
			})
		}).catch(err => {
			this.isLoading = false
		})
	}

	handleInput = (e) => {
		this.setState({
			value: e.detail.value
		})
	}

	handleComment = (e, type) => {
		const that = this
		const { value } = this.state
		console.log(value)
		if (!value) Taro.showToast({ title: '请输入内容' })
		const { userInfo, ideaInfo, reqParams, commentList } = this.state
		const defaultParmas = {
			"commentContent": "",
			"ideaId": 0,
			"userId": 0,
			"userNickname": ""
		}
		utils.httpRequest({
			url: ajaxUrl.doComment,
			data: {
				commentContent: value,
				ideaId: ideaInfo.ideaId,
				userId: userInfo.userId,
				userNickname: userInfo.userNickname
			}
		}).then(res => {
			reqParams.start = 0
			that.setState({
				isAfterRequest: false,
				isEmpty: false,
				noMoreData: false,
				reqParams,
				value: '',
				commentList: []
			}, () => {
				that.requestComment()
			})
		})
	}

	delItem = () => {
		const { ideaInfo } = this.state
		Taro.showModal({
			content: '确定删除吗？'
		}).then(res => {
			res.confirm && utils.httpRequest({
				url: ajaxUrl.delIdea,
				method: 'GET',
				data: {
					ideaId: ideaInfo.ideaId
				}
			}).then(() => {
				setGlobalData('FEFRESH_FLAG', true)
				Taro.navigateBack()
			})
		})
	}

	handleScrollToEnd = () => {
		!this.state.noMoreData && this.requestComment()
	}

	render() {
		const { value, ideaInfo, userInfo, commentList, isAfterRequest, isEmpty, noMoreData } = this.state
		if (!ideaInfo) return null
		return (
			<ScrollView
				className='idea-detail-wrapper'
				scrollY
				scrollTop='0'
				scrollWithAnimation
				onScrollToLower={this.handleScrollToEnd}
			>
				<View className='top-holder'></View>
				<IdeaItem
					isList={false}
					itemData={ideaInfo}
				/>

				<View className='btn-wrapper flex'>
					<Button
						type='primary'
						size='mini'
						openType='share'
					>分享</Button>
					<Button
						type='warn'
						size='mini'
						hidden={userInfo.userId != ideaInfo.userId}
						onClick={this.delItem}
					>删除</Button>
				</View>

				<View className='comment-list'>
					<View className='comment__hd'>
						<Text>评论</Text>
					</View>
					<View className='comment__bd'>
						{isAfterRequest && isEmpty
							? <EmptyHolder txt='目前还没有评论' />
							: commentList.map(item => {
								return <CommentItem key={item.commentId} itemData={item} />
							})}
						<View className='bottom-item loading' hidden={noMoreData}>正在加载中...</View>
						<View className='bottom-item no-more-data' hidden={!(noMoreData && !isEmpty)}>亲，就这么多了</View>
					</View>
				</View>



				<View className='comment-area flex'>
					<Input
						className='input flex-item'
						ref='comment'
						value={value}
						onInput={this.handleInput}
						placeholder='相互帮助是这个世界的一大善意'
						placeholderClass='input-placeholder'
						confirmType='发送'
						cursorSpacing='10'
						onConfirm={this.handleComment.bind(this, 'keyboard')}
					/>
					<View className='btn' onClick={this.handleComment.bind(this, 'button')}>发送</View>
				</View>
			</ScrollView>
		)
	}

}