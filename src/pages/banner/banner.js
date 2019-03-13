import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import cls from 'classnames'

import './index.scss'

export default class Banner extends Component {

	config = {
		backgroundColor: '#fff'
	}

	constructor(props) {
		super(props)
		this.state = {
			isHideImage: true
		}
	}

	handleLoad = () => {
		this.setState({
			isHideImage: false
		})
	}

	render() {
		const { url } = this.props
		if (!url) return null
		return (
			<ScrollView
				className='banner-wrapper'
				scrollY
				scrollTop='0'
				scrollWithAnimation
			>
				<View className={this.state.isHideImage ? 'image-wrapper hidden' : 'image-wrapper'}>
					<Image src={url} lazyLoad={true} mode='widthFix' onLoad={this.handleLoad} />
				</View>
				<View className='loading'>
					<Text>数据加载中，请稍后...</Text>
				</View>
			</ScrollView >
		)
	}
}