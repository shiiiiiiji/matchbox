/*
 * @User: uhr(ze.zh@hotmail.com)
 * @Date: 2018-11-06 09:09:36
 * @Desc: 首页
 */

import Taro, { Component } from '@tarojs/taro'
import { View, Swiper, Icon, Button, Text } from '@tarojs/components'
import cls from 'classnames'

import './index.scss'

import IconFont from '../../components/IconFont'
import IdeaItem from '../../components/IdeaItem'
import ProjItem from '../../components/ProjItem'
import EmptyHolder from '../../components/EmptyHolder'

import ajaxUrl from '../../assets/js/ajaxUrl'
import utils from '../../assets/js/utils'

import { set as setGlobalData, get as getGlobalData } from '../../assets/js/global_data'

export default class Home extends Component {

	config = {
		backgroundColor: '#eeeeee',
		enablePullDownRefresh: true,
		usingComponents: {
			'weapp-tap': '../../components/tab/tab'
		}
	}

	constructor(props) {
		super(props)
		this.state = {
			tabList: ['匿名区', '项目'],
			activeIndex: 0,
			activeCategoryIdx: 0,
			isAfterRequest: false,
			reqParams: {
				start: 0,
				length: 10
			},
			reqResult: [],
			userInfo: {},
			bannerList: [],
			projNum: 0
		}
	}

	componentWillMount() {
		// 获取 query 参数
		const queryData = this.$router.params
		this.setState({
			queryData
		})
	}

	componentDidMount() {
		const that = this
		const { reqParams, queryData } = this.state

		this.requestBanner()
		utils.login(queryData).then(res => {
			const userInfo = getGlobalData('userInfo') || {}
			reqParams.userId = 0
			reqParams.operateUserId = userInfo.userId
			that.setState({
				userInfo,
				reqParams
			}, () => {
				that.requestData()
				setTimeout(() => {
					if (queryData.share == 1) {
						const prefixUrl = queryData.type == 'idea' ? '/pages/idea_detail/idea_detail' : '/pages/proj_detail/proj_detail'
						Taro.navigateTo({
							url: `${prefixUrl}?${utils.queryStringfy(queryData)}`
						})
					}
				}, 1000)
			})
		})
		this.getProjNum()
	}

	onPullDownRefresh = () => {
		const switchTabVal = getGlobalData('SWITCH_TAB_VAL')
		const that = this
		const { activeIndex, activeCategoryIdx, reqParams, reqResult } = this.state
		reqParams.start = 0
		this.setState({
			activeIndex: (switchTabVal && [0, 1].indexOf(switchTabVal.tab) > -1) ? switchTabVal.tab : activeIndex,
			activeCategoryIdx: (switchTabVal && [0, 1].indexOf(switchTabVal.category) > -1) ? switchTabVal.category : activeCategoryIdx,
			isAfterRequest: false,
			isEmpty: false,
			noMoreData: false,
			reqParams,
			reqResult: []
		}, () => {
			setGlobalData('SWITCH_TAB_VAL', {})	// 重置全局变量
			Taro.stopPullDownRefresh()
			setTimeout(() => {
				that.requestData()
			}, 1000)
		})
	}

	onReachBottom = () => {
		this.handleScrollToEnd()
	}


	componentDidShow() {
		// console.log('onshow')
		const { reqParams, queryData } = this.state

		if (getGlobalData('FEFRESH_FLAG')) {
			Taro.startPullDownRefresh() // 会自动触发 onPullDownRefresh
			setGlobalData('FEFRESH_FLAG', false)
		}

	}

	/**
  * @msg: 切换一级 Tab
  * @param {type} 
  * @return: 
  */
	handleTabChange = (e) => {
		const that = this
		const { reqParams } = this.state
		reqParams.start = 0
		this.setState({
			activeIndex: e.currentTarget.activeIndex,
			activeCategoryIdx: 0,
			isAfterRequest: false,
			isEmpty: false,
			noMoreData: false,
			reqParams,
			bannerList: [],
			reqResult: []
		}, () => {
			that.requestBanner()
			that.requestData()
		})
	}

	/**
  * @msg: 切换二级 Tab
  * @param {type} 
  * @return: 
  */
	switchCatory = (idx) => {
		const that = this
		const { reqParams } = this.state
		reqParams.start = 0
		this.state.activeCategoryIdx != idx && this.setState({
			activeCategoryIdx: idx,
			isAfterRequest: false,
			isEmpty: false,
			noMoreData: false,
			reqParams,
			reqResult: []
		}, () => {
			that.requestData()
		})
	}

	/**
  * @msg: 滚到底部
  * @param {type} 
  * @return: 
  */
	handleScrollToEnd = () => {
		!this.state.noMoreData && this.requestData()
	}

	handleBannerClick = (item) => {
		const { bannerClassify } = item
		switch (bannerClassify) {
			case 'idea':
				Taro.navigateTo({
					url: '/pages/idea_detail/idea_detail?id=' + item.bannerUrl
				})
				break
			case 'project-team':
			case 'project-person':
				Taro.navigateTo({
					url: '/pages/proj_detail/proj_detail?id=' + item.bannerUrl + '&isProj=' + item.bannerClassify == 'project-team'
				})
				break
			case 'html':
				Taro.navigateTo({
					url: '/pages/h5/h5?url=' + item.bannerUrl
				})
				break
			case 'image':
				Taro.navigateTo({
					url: `/pages/banner/banner?url=${decodeURIComponent(item.bannerUrl)}`
				})
				break
			case 'idea-publish':
				Taro.navigateTo({
					url: '/pages/issue_idea/issue_idea'
				})
				break
			case 'project-pubish':
				Taro.navigateTo({
					url: '/pages/issue_proj/issue_proj'
				})
				break
			case 'personal-publish':
				Taro.navigateTo({
					url: '/pages/issue_self/issue_self'
				})
				break
			default:
				console.error('暂不支持其他类型Banner跳转', item)
		}

	}

	/**
  * @msg: 请求Banner数据
  * @param {type} 
  * @return: 
  */
	requestBanner = () => {
		const that = this
		const { activeIndex } = this.state
		const params = {
			bannerType: ['idea', 'project'][activeIndex],
			start: 0,
			length: 10
		}
		utils.httpRequest({
			url: ajaxUrl.getBannerList,
			method: 'GET',
			data: params
		}).then(res => {
			const { dataList } = res
			that.setState({
				bannerList: dataList || []
			})
		})
	}

	/**
	* @msg: 请求列表数据
	* @param {type} 
	* @return: 
	*/
	requestData = () => {
		const that = this
		let { activeIndex, activeCategoryIdx, reqParams, reqResult } = this.state
		let url = ''
		if (this.isLoading) return false
		this.isLoading = true
		if (activeIndex) {
			// 项目
			if (activeCategoryIdx) {
				url = ajaxUrl.getSelfProj	// 找队员
			} else {
				url = ajaxUrl.getTeamProj	// 找团队
			}
		} else {
			// 想法
			url = ajaxUrl.getIdeaList
			reqParams.isSelected = activeCategoryIdx
		}
		utils.httpRequest({
			url,
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

	getProjNum = () => {
		utils.httpRequest({
			url: ajaxUrl.getDictValue,
			method: 'GET',
			data: {
				dictCode: 'project-read-num'
			}
		}).then(res => {
			const { data } = res
			let projNum = data && data.content - 0 || 5
			projNum = projNum >= 5 ? projNum : 5
			this.setState({
				projNum
			})
		})
	}

	goPub = () => {
		const { activeIndex, activeCategoryIdx }= this.state;
		const _urlMap = [
			['/pages/issue_idea/issue_idea', '/pages/issue_idea/issue_idea'],
			['/pages/issue_proj/issue_proj', '/pages/issue_self/issue_self']
		]
		Taro.navigateTo({
			url: _urlMap[activeIndex][activeCategoryIdx]
		})
	}

	render() {
		const { tabList, activeIndex, activeCategoryIdx, isAfterRequest, isEmpty, noMoreData, reqResult, userInfo, bannerList, projNum } = this.state
		// console.log(this.state)
		return (
			<View className='home-wrapper'>
				<View className='weui-tab__header'>
					<weapp-tap list={tabList} activeIndex={activeIndex} onchange={this.handleTabChange}></weapp-tap>
				</View>

				<View className="weui-tab__panel">

					<Swiper
						className='banner-wrapper'
						previous-margin='45rpx'
						next-margin='45rpx'
						autoplay={bannerList.length > 1 ? true : false}
						circular
					>
						{
							bannerList.map((item, index) => {
								return (
									<SwiperItem
										className='banner-item'
										key={item.bannerId}
										onClick={this.handleBannerClick.bind(this, item)}
									>
										<View>
											<Image src={item.bannerPath} mode='aspectFill' />
										</View>
									</SwiperItem>
								)
							})
						}
					</Swiper>

					<View className='proj-sum' hidden={!activeIndex}>
						<Text>已有 {projNum} 人在这里找过项目，如你有需要，快来发布吧</Text>
					</View>

					<View className='title-bar flex'>
						<View className={cls('category',
							activeCategoryIdx == 0 && 'active'
						)} onClick={this.switchCatory.bind(this, 0)}>{['全部', '团队招募'][activeIndex]}</View>
						<View className={cls('category',
							activeCategoryIdx == 1 && 'active'
						)} onClick={this.switchCatory.bind(this, 1)}>{['精选', '毛遂自荐'][activeIndex]}</View>
						<View className='school'>
							<Text className='scholl-name'>{userInfo.collegeName || '-'}</Text>
							<IconFont type='location-arrow' />
						</View>
					</View>

					<View className='list'>
						{isAfterRequest && isEmpty
							? <EmptyHolder txt='不知道是好是坏,让你看到这个空白页,我们将联系在第一个发布信息的人,奖励一张电影票,嘻嘻' />
							: reqResult.map(item => {
								return activeIndex
									? <ProjItem
										key={activeCategoryIdx ? item.projectPersonId : item.projectTeamId}
										isList={true}
										isTeam={!activeCategoryIdx}
										itemData={item} />
									: <IdeaItem
										key={item.ideaId}
										isList={true}
										itemData={item} />
							})}
						<View className='bottom-item loading' hidden={noMoreData}>正在加载中...</View>
						<View className='bottom-item no-more-data' hidden={!(noMoreData && !isEmpty)}>亲，就这么多了</View>
					</View>
				</View>
				
				<Button className="pub-btn" hoverClass="pub-btn-hover" size="mini" onClick={this.goPub.bind(this)}>
					<View className="bar bar-horizontal"></View>
					<View className="bar bar-vertical"></View>
				</Button>
			</View>
		)
	}
}