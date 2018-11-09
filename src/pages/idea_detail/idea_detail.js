import Taro, { Component } from '@tarojs/taro'
import { View, Input, Form, Button } from '@tarojs/components'

import './index.scss'
import IdeaItem from '../../components/IdeaItem';
import CommentItem from '../../components/CommentItem';

export default class IdeaDetail extends Component {
	constructor(props) {
		super(props)
	}

	handleInput = (e) => {
		this.setState({
			value: e.detail.value
		})
	}

	handleComment = (e, type) => {
		const { value } = this.state
		Taro.showModal({
			title: value
		})
		// ...更新评论列表，刷新input框
	}

	render() {
		const { value } = this.state
		let itemData = {}
		itemData.isDetail = true
		return (
			<View className='idea-detail-wrapper'>
				<View className='top-holder'></View>
				<IdeaItem itemData={itemData} />
				<View className='comment-list'>
					<View className='comment__hd'>
						<Text>评论</Text>
					</View>
					<View className='comment__bd'>
						<CommentItem />
						<CommentItem />
						<CommentItem />
						<CommentItem />
						<Text className='last-tip'>放学别走，在评论区见☟☟☟</Text>
					</View>
				</View>
				<View className='comment-area flex'>
					<Input
						className='input flex-item'
						ref='comment'
						value={value}
						onInput={this.handleInput}
						placeholder='相互帮助是这个世界的一大善意'
						placeholderClass='input-placeholder'
						confirmType='发送'
						cursorSpacing='10'
						onConfirm={this.handleComment.bind(this, 'keyboard')}
					/>
					<View className='btn' onClick={this.handleComment.bind(this, 'button')}>发送</View>
				</View>
			</View>
		)
	}

}