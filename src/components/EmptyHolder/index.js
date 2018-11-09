import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'

import './index.scss'

export default class EmptyHolder extends Component {
	static defaultProps = {
		txt: '',
	}
	constructor(props) {
		super(...props)
	}

	render() {
		const { txt } = this.props
		return (
			<View className='empty-holder-wrapper'>
				<Image src='../../assets/images/empty.png' mode='aspectFill' />
				<View>{txt}</View>
			</View>
		)
	}
}