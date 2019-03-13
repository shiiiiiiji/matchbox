import Taro, { Component } from '@tarojs/taro'
import { Button } from '@tarojs/components'
import cls from 'classnames'

import EmptyHolder from '../../components/EmptyHolder'
import IdeaItem from '../../components/IdeaItem'
import ProjItem from '../../components/ProjItem'

import ajaxUrl from '../../assets/js/ajaxUrl'
import utils from '../../assets/js/utils'

import { set as setGlobalData, get as getGlobalData } from '../../assets/js/global_data'

import './index.scss';

export default class MyIssue extends Component {
	static defaultProps = {
	}

	config = {
		navigationBarTitleText: '我的发布',
		backgroundColor: '#eeeeee',
		enablePullDownRefresh: true,
		usingComponents: {
			'weapp-tap': '../../components/tab/tab'
		}
	}

	constructor(props) {
		super(props)
		this.state = {
			tabList: ['想法', '项目'],
			activeIndex: 0,
			isAfterRequest: false,
			isEmpty: false,
			noMoreData: false,
			reqParams: {
				start: 0,
				length: 10,
				isSelected: 0,
			},
			reqResult: [],
		}
	}

	componentDidMount() {
		const userInfo = getGlobalData('userInfo')
		const { reqParams } = this.state
		reqParams.userId = userInfo.userId
		reqParams.operateUserId = userInfo.userId
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
		const { reqParams } = this.state
		reqParams.start = 0
		this.setState({
			activeIndex: e.currentTarget.activeIndex,
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
			url: activeIndex ? ajaxUrl.getProjList : ajaxUrl.getIdeaList,
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

	render() {
		const { tabList, activeIndex, isAfterRequest, isEmpty, noMoreData, reqResult } = this.state
		return (
			<View className='my-issue-wrapper flex'>
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
							: reqResult.map(item => {
								return activeIndex
									? <ProjItem
										key={item.dataId}
										isList={true}
										isTeam={item.dataFrom == 'team'}
										itemData={item}
									/>
									: <IdeaItem
										key={item.ideaId}
										isList={true}
										itemData={item}
									/>
							})}
						<View className='bottom-item loading' hidden={noMoreData}>正在加载中...</View>
						<View className='bottom-item no-more-data' hidden={!(noMoreData && !isEmpty)}>亲，就这么多了</View>

					</ScrollView>
				</View>

			</View>
		)
	}
}