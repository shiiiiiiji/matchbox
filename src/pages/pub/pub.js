import Taro, { Component } from '@tarojs/taro'
import { Button } from '@tarojs/components';

import './index.scss';

export default class App extends Component {
	constructor() {
		super(...arguments)
	}

	render() {
		return (
			<View className='pub-wrapper'>
				<View className='btn-list'>
					<Button>发布想法</Button>
					<Button>我想找团队</Button>
					<Button>我想找队员</Button>
				</View>
			</View>
		)
	}
}