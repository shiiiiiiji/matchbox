import Taro, { Component } from '@tarojs/taro'
import { View, Label, Text, Image, Button, Form } from '@tarojs/components'
import WeValidator from 'we-validator'

import ajaxUrl from '../../assets/js/ajaxUrl'
import utils from '../../assets/js/utils'

import { set as setGlobalData, get as getGlobalData } from '../../assets/js/global_data'

import './index.scss'

export default class Guide extends Component {

	static defaultProps = {}

	config = {
		navigationBarTitleText: '',
		backgroundColor: '#FFD004',
		navigationBarBackgroundColor: '#FFD004'
	}

	constructor() {
		super(...arguments)
		this.state = {
			schollList: [],
			schoolIdx: -1
		}
	}

	componentWillMount() {
		// 获取 query 参数
		const queryData = this.$router.params
		this.setState({
			queryData
		})
	}

	componentDidMount() {
		this.initValidator()
		this.requestSchollList()
	}

	/**
  * @msg: 表单验证
  * @param {type} 
  * @return: 
  */
	initValidator = () => {
		WeValidator.addRule('weChatRule', (value, params) => {
			return /^\w[\w\d_-]{5,19}$/.test(value)	// 微信号设置规则：http://kf.qq.com/touch/faq/120813euEJVf141212Vfi6fA.html
		})
		WeValidator.addRule('nickNameRule', (value, params) => {
			return /[\u4e00-\u9fa5\w\d_-]/.test(value)
		})
		this.oValidator = new WeValidator({
			rules: {
				guideWechat: {
					required: true,
					weChatRule: true
				},
				guideNickname: {
					required: true,
					nickNameRule: true
				},
				guideSchool: {
					required: true
				}
			},
			messages: {
				guideWechat: {
					required: '请输入微信号',
					weChatRule: '微信号格式不对'
				},
				guideNickname: {
					required: '请输入昵称',
					nickNameRule: '昵称格式不对'
				},
				guideSchool: {
					required: '请选择学校'
				}
			}
		})
	}

	requestSchollList = () => {
		const that = this
		utils.httpRequest({
			url: ajaxUrl.getSchoolList,
			method: 'GET',
			data: {
				start: 0,
				length: 99
			}
		}).then(res => {
			const schoolList = res.dataList || []
			that.setState({
				schollList: schoolList
			})
		})
	}

	handleSchoolChange = e => {
		this.setState({
			schoolIdx: e.detail.value
		})
	}

	handleFormSubmit = e => {
		if (!this.oValidator.checkData(e.detail.value)) return
		const { guideWechat: wchatCode, guideNickname: userNickname, guideSchool } = e.detail.value
		const { schollList, schoolIdx, queryData } = this.state
		const collegeId = schollList[schoolIdx].collegeId
		const collegeName = schollList[schoolIdx].collegeName
		const userInfo = getGlobalData('userInfo')
		const userId = userInfo && userInfo.userId
		// console.log(userId)
		utils.httpRequest({
			url: ajaxUrl.modifyUserinfo,
			method: 'POST',
			data: {
				userId,
				collegeId,
				collegeName,
				wchatCode,
				userNickname
			}
		}).then(res => {
			if (res.code === '0000') {
				setGlobalData('userInfo', Object.assign({}, userInfo, {
					collegeId,
					collegeName,
					wchatCode,
					userNickname
				}))
				Taro.reLaunch({
					url: '/pages/home/home?' + utils.queryStringfy(queryData)
				})
			}
		})
	}

	render() {
		const { wechat, nickname, schoolIdx, schollList } = this.state;
		return (
			<Form
				className='form-container flex'
				onSubmit={this.handleFormSubmit}
			>
				<View className='guide-wrapper flex'>

					<View className='slogon'>
						<Text>有趣的人</Text>
						<Text>一起做有趣的事儿～</Text>
					</View>

					<View className='form-wrapper'>
						<View className='form-item flex guide-nickname-wrapper'>
							<Label>昵称：</Label>
							<Input
								className='guide-nickname flex-item'
								name='guideNickname'
								maxLength='18'
								placeholder='请输入你的昵称'
								placeholderClass='input-placeholder'
							/>
						</View>
						<View className='form-item flex guide-school-wrapper'>
							<Label>学校：</Label>
							<Picker
								mode='selector'
								name='guideSchool'
								className='guide-school flex-item'
								range={schollList || []}
								rangeKey='collegeName'
								onChange={this.handleSchoolChange}
							>
								{schoolIdx == -1
									? <Text className='input-placeholder'>请选择你的学校</Text>
									: <Text>{schollList[schoolIdx].collegeName}</Text>}
							</Picker>
						</View>
						<View className='form-item flex guide-wechat-wrapper'>
							<Label>微信号：</Label>
							<Input
								className='guide-wechat flex-item'
								name='guideWechat'
								maxLength='20'
								placeholder='请输入你的微信号码'
								placeholderClass='input-placeholder'
							/>
						</View>
					</View>
					<View className='button'>
						<Button
							type='primary'
							formType='submit'
						></Button>
					</View>
				</View>
			</Form>
		)
	}
}