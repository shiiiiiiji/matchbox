import Taro, { Component } from '@tarojs/taro'
import { View, Button } from '@tarojs/components'

export default class Demo extends Component {

	config = {
		navigationBarTitleText: '联系我们'
	}

	constructor() {
		super(...arguments)
	}

	render() {
		return (
			<View className='demo-wrapper'>
				<View className='title'>{this.state.title}</View>
				<View className='component'>
					{this.state.list.map(item => {
						return (
							<View className='item' key={String(item)}>{item}</View>
						)
					})}
					<Button className='add' onClick={this.add}>添加</Button>
				</View>
			</View>
		)
	}
}