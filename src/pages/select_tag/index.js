/*
 * @User: 拾迹(ze.zh@hotmail.com)
 * @Desc: 选择标签
 * @Date: 2019-03-13 10:52:14
 */

import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import IconFont from '../../components/IconFont'

import ajaxUrl from '../../assets/js/ajaxUrl' 
import utils from '../../assets/js/utils'

import './index.scss'
import { set as setGlobalData, get as getGlobalData } from '../../assets/js/global_data'

export default class App extends Component {
	config = {
	backgroundColor: '#eeeeee',
	enablePullDownRefresh: true,
	navigationBarTitleText: '选择标签'
	}

	constructor(props){
		super(props)
		this.state = {
		isAfterRequest: false,
		reqParams: {
			start: 0,
			length: 20
		},
		reqResult: []
		}
	}

	componentDidMount(){
		this.requestTagsList();
	}

	onPullDownRefresh = () => {
		const that = this;
	const {  reqParams, reqResult } = this.state
	reqParams.start = 0
	this.setState({
		isAfterRequest: false,
		isEmpty: false,
		noMoreData: false,
		reqParams,
		reqResult: []
	}, () => {
		Taro.stopPullDownRefresh()
		setTimeout(() => {
			that.requestTagsList()
		}, 1000)
	})
	}

	onReachBottom = () => {
		!this.state.noMoreData && this.requestTagsList()
	}

	requestTagsList = () => {
		if (this.isLoading) return false
		this.isLoading = true
		let { reqParams, reqResult } = this.state
		utils.httpRequest({
		url: ajaxUrl.getTagsList,
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

	handleTagItemClick = (e) => {
		const { item } = e.currentTarget.dataset || {};
		Taro.eventCenter.trigger('tag.select', item);
		setTimeout(()=>{
			Taro.navigateBack();
		}, 0);
	}

	render(){
		const { isAfterRequest, isEmpty, noMoreData, reqResult } = this.state;
		return (
			<View className="tags-wrapper">
				{isAfterRequest && isEmpty
					? null
					: <View className="tag-item-wrapper no-select" onClick={this.handleTagItemClick.bind(this)}>
							<View className="tag-item flex flex-center ">
								<View className="icon-wrapper"><IconFont type='frown-o' /></View>
								<View className="tag-txt flex-item">不选择标签</View>
							</View>
					</View>
				}
				{isAfterRequest && isEmpty
					? <EmptyHolder txt='暂无标签' />
					: reqResult.map(item => {
						return(
							<View className="tag-item-wrapper" key="{item.labelId}" data-item={item} onClick={this.handleTagItemClick.bind(this)}>
								<View className="tag-item flex flex-center ">
									<View className="icon-wrapper"><IconFont type='hashtag' /></View>
									<View className="tag-txt flex-item">{item.labelContent}</View>
									{/* <View className="icon-wrapper arrow-icon"><IconFont type='angle-right' /></View> */}
								</View>
							</View>
						)
					})}
				<View className='bottom-item loading' hidden={noMoreData}>正在加载中...</View>
				<View className='bottom-item no-more-data' hidden={!(noMoreData && !isEmpty)}>亲，就这么多了</View>
			</View>
		)
	}
}