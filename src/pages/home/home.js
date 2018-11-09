import Taro, { Component } from '@tarojs/taro'
import { View, Swiper, Icon } from '@tarojs/components'
import cls from 'classnames'

import './index.scss';

import IconFont from '../../components/IconFont'
import IdeaItem from '../../components/IdeaItem';
import ProjItem from '../../components/ProjItem';
import EmptyHolder from '../../components/EmptyHolder';

export default class Home extends Component {

	config = {
		backgroundColor: '#eeeeee',
		usingComponents: {
			'weapp-tap': '../../components/tab/tab'
		}
	}

	constructor() {
		super(...arguments)
		this.state = {
			tabList: ['想法', '项目'],
			activeIndex: 0,
			activeCategoryIdx: 0
		}
	}

	componentWillMount() { }

	componentDidMount() { }

	componentWillUpdate(nextProps, nextState) { }

	componentDidUpdate(nextProps, nextState) { }

	shouldComponentUpdate(nextProps, nextState) {
		return true
	}

	handleTabChange = (e) => {
		this.setState({
			activeIndex: e.currentTarget.activeIndex
		})
	}

	handleScrollToEnd = () => {
		// console.log(1)
	}

	switchCatory = (idx) => {
		this.state.activeCategoryIdx != idx && this.setState({
			activeCategoryIdx: idx
		})
	}

	render() {
		const { tabList, activeIndex, activeCategoryIdx } = this.state
		return (
			<ScrollView
				className='home-wrapper'
				scrollY
				scrollTop='0'
				scrollWithAnimation
				onScrollToLower={this.handleScrollToEnd}
			>
				<View className='weui-tab__header'>
					<weapp-tap list={tabList} onchange={this.handleTabChange}></weapp-tap>
				</View>

				<View className="weui-tab__panel">

					<View className='weui-tab__content' hidden={activeIndex != 0}>

						<Swiper
							className='banner-wrapper'
							previous-margin='45rpx'
							next-margin='45rpx'
							circular
						>
							<SwiperItem className='banner-item'>
								<View className='item-1'>
									<Image src='https://tuimeizi.cn/random?w=630&h=280&s=0&&t=1' mode='aspectFill' />
								</View>
							</SwiperItem>
							<SwiperItem className='banner-item'>
								<View className='item-2'>
									<Image src='https://tuimeizi.cn/random?w=630&h=280&s=0&&t=2' mode='aspectFill' />
								</View>
							</SwiperItem>
							<SwiperItem className='banner-item'>
								<View className='item-3'>
									<Image src='https://tuimeizi.cn/random?w=630&h=280&s=0&&t=3' mode='aspectFill' />
								</View>
							</SwiperItem>
						</Swiper>

						<View className='title-bar flex'>
							<View className={cls('category',
								activeCategoryIdx == 0 && 'active'
							)} onClick={this.switchCatory.bind(this, 0)}>找团队</View>
							<View className={cls('category',
								activeCategoryIdx == 1 && 'active'
							)} onClick={this.switchCatory.bind(this, 1)}>找队员</View>
							<View className='school'>
								<Text>浙江工商大学</Text>
								<IconFont type='location-arrow' />
							</View>
						</View>

						<View className='list'>
							<IdeaItem />
							<ProjItem />
							<EmptyHolder txt='不知道是好是坏,让你看到这个空白页,我们将联系在第一个发布信息的人,奖励一张电影票,嘻嘻' />
						</View>
					</View>

					<View className='weui-tab__content' hidden={activeIndex != 1}>
						2
					</View>
				</View>
			</ScrollView>
		)
	}
}