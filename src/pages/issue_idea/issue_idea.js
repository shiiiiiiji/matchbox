import Taro, { Component } from '@tarojs/taro'
import { View, Form, Textarea, Label, Input } from '@tarojs/components';
import WeValidator from 'we-validator'

import IconFont from '../../components/IconFont'
import ajaxUrl from '../../assets/js/ajaxUrl'
import utils from '../../assets/js/utils'

import { set as setGlobalData, get as getGlobalData } from '../../assets/js/global_data'

import './index.scss';

export default class IssueIdea extends Component {

	config = {
		navigationBarTitleText: '发布想法'
	}

	constructor() {
		super(...arguments)
		this.state = {
			ideaContent: ''
		}
	}

	componentDidMount() {
		this.initValidator();
		Taro.eventCenter.on('tag.select', (tagItem) => {
			const { labelId, labelContent } = tagItem || {}; 
			this.setState({
				labelId,
				labelContent
			});
		});
	}

	/**
  * @msg: 表单验证
  * @param {type} 
  * @return: 
  */
	initValidator = () => {
		WeValidator.addRule('nickNameRule', (value, params) => {
			return /[\u4e00-\u9fa5\w\d_-]/.test(value)
		})
		WeValidator.addRule('stringMoreLength', (value, params) => {
			return value.length >= params[0]
		})
		this.oValidator = new WeValidator({
			rules: {
				ideaContent: {
					required: true,
					stringMoreLength: 15
				}
			},
			messages: {
				ideaContent: {
					required: '请输入想法内容',
					stringMoreLength: '内容至少15个字'
				}
			}
		})
	}

	handleFormSubmit = e => {
		if (!this.oValidator.checkData(e.detail.value)) return
		const { ideaContent, nickname } = e.detail.value
		// POST 请求非必填参数必须填默认值
		const defaultParams = {
			"ideaId": 0,
			"userId": 0,
			"ideaContent": "",
			"ideaNickname": "",
			"isTop": 0,
			"isSelected": 0,
			"dataOrder": 0,
			"formId": ""
		}
		utils.login().then(res => {
			console.log(res)
			utils.httpRequest({
				url: ajaxUrl.issueIdea,
				loading: true,
				data: Object.assign({}, defaultParams, {
					userId: res.userId,
					ideaContent,
					ideaNickname: nickname,
					formId: e.detail.formId || '',
					labelId: this.state.labelId
				})
			}).then(data => {
				setGlobalData('FEFRESH_FLAG', true)
				setGlobalData('SWITCH_TAB_VAL', {
					tab: 0,
					category: 0
				})
				Taro.switchTab({
					url: '/pages/home/home'
				})
				// Taro.showModal({
				// 	content: '发布成功',
				// 	icon: 'success',
				// 	showCancel: false,
				// 	// cancelText: '返回首页',
				// 	confirmText: '确定'
				// }).then(res => {
				// 	res.confirm && (() => {
				// 		setGlobalData('SWITCH_TAB_VAL', {
				// 			tab: 0,
				// 			category: 0
				// 		})
				// 		Taro.switchTab({
				// 			url: '/pages/home/home'
				// 		})
				// 	})()
				// })

			})
		})
	}

	go2SelectTag = () => {
		Taro.navigateTo({
			url: '/pages/select_tag/index'
		});
	}

	render() {
		const {labelId, labelContent} = this.state;
		return (
			<View className='issue-idea-wrapper'>
				<Form
					className='form-wrapper'
					reportSubmit={true}
					onSubmit={this.handleFormSubmit}
				>
					<View className='form-item idea-content-wrapper flex'>
						<Textarea
							className='idea-content'
							name='ideaContent'
							placeholder='没有人知道你是谁，想说什么就说吧~'
							placeholderClass='input-placeholder'
							autoFocus
							autoHeight
							maxlength='-1'
						/>
					</View>
					<View className='form-item idea-tag-wrapper flex flex-center' onClick={this.go2SelectTag.bind(this)}>
						<View className="icon-wrapper"><IconFont type='hashtag' /></View>
						<View className="tag-wrapper flex-item">{ labelContent ? labelContent : '选择标签' }</View>
						<View className="icon-wrapper arrow-icon"><IconFont type='angle-right' /></View>
					</View>
					<View className='form-item idea-nickname-wrapper flex'>
						<Label for='idea-nickname'>
							<View className="icon-wrapper"><IconFont type='circle-o' /></View>
							匿名昵称：
						</Label>
						<Input
							className='idea-nickname flex-item'
							id='idea-nickname'
							name='nickname'
							placeholder='请填入昵称（非必填）'
							placeholderClass='input-placeholder'
						/>
					</View>
					<View className='form-item tips-wrapper'>
						<Text className='tips'>（每次发布想法可以换一个新昵称哦～）</Text>
					</View>
					<View className='form-item button-wrapper'>
						<Button
							type='primary'
							formType='submit'
						>发布</Button>
					</View>
				</Form>
			</View >
		)
	}
}