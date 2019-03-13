import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import cls from 'classnames'
import moment from 'moment'

import EmptyHolder from '../../components/EmptyHolder'
import common from '../../assets/js/common'

import ajaxUrl from '../../assets/js/ajaxUrl'
import utils from '../../assets/js/utils'

import { set as setGlobalData, get as getGlobalData } from '../../assets/js/global_data'

import './index.scss'

export default class MyNotice extends Component {

	static defaultProps = {
	}

	config = {
		navigationBarTitleText: '我的通知',
		backgroundColor: '#eeeeee',
		usingComponents: {
			'weapp-tap': '../../components/tab/tab'
		}
	}

	constructor(props) {
		super(props)
		this.state = {
			tabList: ['赞和评论', '谁找过我', '我找过谁'],
			activeIndex: 0,
			isAfterRequest: false,
			isEmpty: false,
			noMoreData: false,
			reqParams: {
				start: 0,
				length: 10,
				messageClassify: 'praise-comment'
			},
			reqResult: [],
		}
	}

	componentDidMount() {
		const userInfo = getGlobalData('userInfo')
		const { reqParams } = this.state
		reqParams.receiveUserId = userInfo.userId
		this.setState({
			reqParams
		}, () => {
			this.requestData()
		})
	}

	handleScrollToEnd = () => {
		!this.state.noMoreData && this.requestData()
	}

	handleTabChange = (e) => {
		const _idx = e.currentTarget.activeIndex
		const { reqParams } = this.state
		reqParams.start = 0
		reqParams.messageClassify = ['praise-comment', 'to-chat', 'chat-to'][_idx]
		this.setState({
			activeIndex: _idx,
			isAfterRequest: false,
			isEmpty: false,
			noMoreData: false,
			reqParams,
			reqResult: []
		}, () => {
			this.requestData()
		})
	}

	requestData = () => {
		if (this.isLoading) return false
		this.isLoading = true
		let { activeIndex, isAfterRequest, isEmpty, noMoreData, reqParams, reqResult } = this.state
		utils.httpRequest({
			url: ajaxUrl.getNotice,
			method: 'GET',
			data: reqParams
		}).then(res => {
			this.isLoading = false
			const { dataList, totalRecords } = res
			if (dataList && dataList.length) reqResult = reqResult.concat(dataList)
			if (reqResult.length < totalRecords) {
				reqParams.start += reqParams.length
			}
			this.setState({
				reqParams,
				reqResult,
				isAfterRequest: true,
				isEmpty: !reqResult.length,
				noMoreData: reqResult.length >= totalRecords
			})
		}).catch(err => {
			this.isLoading = false
		})
	}

	handleViewClick = (item) => {
		const { messageType, dataId } = item
		let url = ''
		switch (messageType) {
			case 'praise-idea':
			case 'praise-comment':
			case 'comment-idea':
			case 'idea':
				url = `/pages/idea_detail/idea_detail?id=${dataId}`
				break;
			case 'project-team':
				url = `/pages/proj_detail/proj_detail?id=${dataId}&isTeam=1`
				break;
			case 'project-person':
				url = `/pages/proj_detail/proj_detail?id=${dataId}&isTeam=0`
				break;
			default:
		}
		if (!url) return false
		Taro.navigateTo({
			url
		})
	}

	render() {
		const { tabList, activeIndex, isAfterRequest, isEmpty, noMoreData, reqResult } = this.state
		return (
			<View className='notice-wrapper flex'>
				<View className='weui-tab__header'>
					<weapp-tap list={tabList} onchange={this.handleTabChange}></weapp-tap>
				</View>
				<View className='weui-tab__panel flex-item'>
					<ScrollView
						className='scroll-view-wrapper'
						scrollY
						scrollTop='0'
						scrollWithAnimation
						onScrollToLower={this.handleScrollToEnd}
					>
						{isAfterRequest && isEmpty
							? <EmptyHolder txt='暂无数据' />
							: (
								activeIndex
									? activeIndex == 1
										? (
											reqResult.map(item => {
												return (
													<View key={item.messageId} className='interaction'>
														<View className='hd flex'>
															<View className='user-info'>
																<Text className='user-name'>{item.sendUserNickname || '-'}</Text>
																<Text>找你聊聊</Text>
															</View>
															<View className='time'>
																<Text>{common.formatTime(moment(item.createTime))}</Text>
															</View>
														</View>
														<View className='bd flex'>
															<Text>来源：{['praise-idea', 'praise-comment', 'comment-idea', 'idea'].indexOf(item.messageType) > -1 ? '想法' : '项目'}</Text>
															<View className='action' onClick={this.handleViewClick.bind(this, item)}>查看</View>
														</View>
													</View>
												)
											})

										)
										: (
											reqResult.map(item => {
												return (
													<View key={item.messageId} className='interest'>
														<View className='hd flex'>
															<View className='user-info'>
																<Text>你找</Text>
																<Text className='user-name mid'>{item.sendUserNickname || '-'}</Text>
																<Text>聊聊</Text>
															</View>
															<View className='time'>
																<Text>{common.formatTime(moment(item.createTime))}</Text>
															</View>
														</View>
														<View className='bd flex'>
															<Text>来源：{['praise-idea', 'praise-comment', 'comment-idea', 'idea'].indexOf(item.messageType) > -1 ? '想法' : '项目'}</Text>
															<View className='action' onClick={this.handleViewClick.bind(this, item)}>查看</View>
														</View>
													</View>
												)
											})
										)
									: (
										reqResult.map(item => {
											return (
												<View key={item.messageId} className='interaction'>
													<View className='hd flex'>
														<View className='user-info'>
															<Text className='user-name'>{item.sendUserNickname || '-'}</Text>
															<Text>
																{['praise-idea', 'praise-comment'].indexOf(item.messageType) > -1 ? '赞' : '评论'}了你的{['praise-idea', 'comment-idea'].indexOf(item.messageType) > -1 ? '想法' : '评论'}
															</Text>
														</View>
														<View className='time'>
															<Text>{common.formatTime(moment(item.createTime))}</Text>
														</View>
													</View>
													<View className='bd flex'>
														<Text>来源：想法</Text>
														<View className='action' onClick={this.handleViewClick.bind(this, item)}>查看</View>
													</View>
												</View>
											)
										})
									)
							)
						}
						<View className='bottom-item loading' hidden={noMoreData}>正在加载中...</View>
						<View className='bottom-item no-more-data' hidden={!(noMoreData && !isEmpty)}>亲，就这么多了</View>
					</ScrollView>

				</View>

			</View>
		)
	}
}