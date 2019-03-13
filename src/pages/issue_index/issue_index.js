import Taro, { Component } from '@tarojs/taro'
import { Button } from '@tarojs/components';

import './index.scss';

export default class IssueIndex extends Component {
	constructor() {
		super(...arguments)
	}

	jump2Idea = () => {
		Taro.navigateTo({
			url: '/pages/issue_idea/issue_idea'
		})
	}

	jump2Self = () => {
		Taro.navigateTo({
			url: '/pages/issue_self/issue_self'
		})
	}

	jump2Proj = () => {
		Taro.navigateTo({
			url: '/pages/issue_proj/issue_proj'
		})
	}

	render() {
		return (
			<View className='pub-wrapper'>
				<View className='btn-list'>
					<Button onClick={this.jump2Idea}>发布想法</Button>
					<Button onClick={this.jump2Self}>我想找团队</Button>
					<Button onClick={this.jump2Proj}>我想找队员</Button>
				</View>
			</View>
		)
	}
}