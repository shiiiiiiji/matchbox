import Taro, { Component } from '@tarojs/taro'
import { View, Button } from '@tarojs/components'

export default class Demo extends Component {

	config = {
		navigationBarTitleText: '我的信息'
	}

	constructor() {
		super(...arguments)
	}

	componentWillMount() { }

	componentDidMount() { }

	componentWillUpdate(nextProps, nextState) { }

	componentDidUpdate(nextProps, nextState) { }

	shouldComponentUpdate(nextProps, nextState) {
		return true
	}

	render() {
		return (
			<View className='user-info-wrapper'>

			</View>
		)
	}
}