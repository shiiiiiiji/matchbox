import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

import './index.scss'
import IconFont from '../IconFont';

export default class CommmentItem extends Component {
	static defaultProps = {
		data: '',
	}
	constructor(props) {
		super(...props)
	}

	render() {
		const { data } = this.props
		return (
			<View className='comment-item-wrapper' hoverClass='hover'>
				<View className='comment-item__hd flex'>
					<View className='user-info'>
						<Text className='user-name'>用户名用户名</Text>
						<Text className='comment-time'>12:34</Text>
					</View>
					<View className='like-wrapper'>
						<Text className='num'>52</Text>
						<IconFont type={true ? 'heart' : 'heart-o'} />
					</View>
				</View>
				<View className='comment-item__bd'>
					<Text>同学，加你了哦</Text>
				</View>
			</View>
		)
	}
}