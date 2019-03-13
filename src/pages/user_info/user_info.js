import Taro, { Component } from '@tarojs/taro'
import { View, Button } from '@tarojs/components'
import WeValidator from 'we-validator'

import ajaxUrl from '../../assets/js/ajaxUrl'
import utils from '../../assets/js/utils'

import './index.scss'

import IconFont from '../../components/IconFont';

export default class Demo extends Component {

	config = {
		navigationBarTitleText: '我的信息'
	}

	constructor() {
		super(...arguments)
		this.state = {
			userInfo: {},
			schoolIdx: -1
		}
	}

	componentWillMount() { }

	componentDidMount() {
		const that = this
		this.initValidator()
		utils.login().then(res => {
			utils.httpRequest({
				url: ajaxUrl.getUserDetail,
				method: 'GET',
				data: {
					userId: res.userId,
					wchatOpenid: res.wchatOpenid
				}
			}).then(res => {
				that.setState({
					userInfo: res.data
				}, () => {
					that.requestSchollList()
				})
			})
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
			const { userInfo } = this.state
			const schoolList = res.dataList || []
			schoolList.map((item, index) => {
				item.collegeName === userInfo.collegeName && this.setState({
					schoolIdx: index
				})
			})
			that.setState({
				schollList: schoolList
			})
		})
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
				'userNickname': {
					required: true,
					nickNameRule: true
				},
				'wchatCode': {
					required: true,
					weChatRule: true
				}
			},
			messages: {
				'userNickname': {
					required: '请输入昵称',
					nickNameRule: '昵称格式不对'
				},
				'wchatCode': {
					required: '请输入微信号',
					weChatRule: '微信号格式不对'
				}
			}
		})
	}

	handleFormSubmit = e => {
		const { userInfo, schollList } = this.state
		console.log(e.detail.value)
		const { userNickname, collegeName, wchatCode, userPhone } = e.detail.value
		if (!this.oValidator.checkData(e.detail.value)) return
		const defaultParams = {
			"userId": 0,
			"userNickname": "",
			"collegeId": 0,
			"collegeName": "",
			"wchatCode": "",
			"wchatOpenid": "",
			"wchatNickname": "",
			"userPhone": "",
			"userSex": 0
		}
		utils.httpRequest({
			url: ajaxUrl.modifyUserinfo,
			loading: true,
			data: Object.assign({}, defaultParams, {
				userId: userInfo.userId,
				collegeName: schollList[collegeName].collegeName,
				userNickname,
				wchatCode,
				userPhone
			})
		}).then(res => {
			Taro.showModal({
				content: '修改成功',
				icon: 'success',
				showCancel: false,
				confirmText: '返回'
			}).then(res => {
				res.confirm && Taro.switchTab({
					url: '/pages/user/user'
				})
			})
		})
	}

	handleSchoolClick = () => {
		Taro.showToast({
			title: '学校暂无法修改'
		})
	}

	handleSchoolChange = e => {
		this.setState({
			schoolIdx: e.detail.value
		})
	}

	render() {
		const { userInfo, schollList } = this.state
		return (
			<View className='user-info-wrapper'>
				<Form
					className='form-wrapper'
					onSubmit={this.handleFormSubmit}
				>
					<View className='user-info-item flex'>
						<View className='icon-wrapper'>
							<IconFont type='user' />
						</View>
						<Text className='title'>我的昵称：</Text>
						<Input
							className='flex-item'
							type='text'
							disabled
							name='userNickname'
							value={userInfo.userNickname}
						/>
					</View>
					<View className='user-info-item flex'>
						<View className='icon-wrapper'>
							<IconFont type='building' />
						</View>
						<Text className='title'>我的学校：</Text>
						{/* <Input
							className='flex-item'
							type='text'
							name='collegeName'
							disabled
							value={userInfo.collegeName}
							onClick={this.handleSchoolClick}
						/> */}
						<Picker
							mode='selector'
							name='collegeName'
							className='guide-school flex-item'
							range={schollList || []}
							rangeKey='collegeName'
							onChange={this.handleSchoolChange}
							value={schoolIdx}
						>
							{schoolIdx == -1
								? <Text className='input-placeholder'>请选择你的学校</Text>
								: <Text>{schollList[schoolIdx].collegeName}</Text>}
						</Picker>
					</View>
					<View className='user-info-item flex'>
						<View className='icon-wrapper'>
							<IconFont type='weixin' />
						</View>
						<Text className='title'>微信号：</Text>
						<Input
							className='flex-item'
							type='text'
							name='wchatCode'
							value={userInfo.wchatCode}
						/>
					</View>
					<View className='user-info-item flex'>
						<View className='icon-wrapper'>
							<IconFont type='phone' />
						</View>
						<Text className='title'>手机号：</Text>
						<Input
							className='flex-item'
							type='text'
							name='userPhone'
							value={userInfo.userPhone}
							placeholder='请填入你的手机号码'
							placeholderClass='input-placeholder'
						/>
					</View>
					<View className='user-info-item button-wrapper'>
						<Button
							type='primary'
							formType='submit'
						>保存</Button>
					</View>
				</Form>
			</View >
		)
	}
}