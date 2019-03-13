import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'

import './index.scss'

import { set as setGlobalData, get as getGlobalData } from '../../assets/js/global_data'

export default class ContactUs extends Component {

	config = {
		navigationBarTitleText: '联系我们'
	}

	constructor() {
		super(...arguments)
	}

	copy(v) {
		Taro.setClipboardData({
			data: v
		})
	}

	render() {
		const contactWeChat = getGlobalData('contactWeChat')
		return (
			<View className='contact-wrapper'>
				<View className='img'>
					<Image src='../../assets/images/phone.png' mode='aspectFill' />
				</View>
				<View className='txt'>
					<View>如有疑问和建议，请添加</View>
					<View>微信 <Text className='wechat ripple rubberBand' onClick={this.copy.bind(this, contactWeChat)}>{contactWeChat}</Text> 进行吐槽</View>
					<Text className='tips'>（点击上述微信号复制）</Text>
				</View>
			</View>
		)
	}
}