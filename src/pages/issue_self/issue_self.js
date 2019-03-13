import Taro, { Component } from '@tarojs/taro'
import { Button, Picker } from '@tarojs/components'
import WeValidator from 'we-validator'
import moment from 'moment'

import ajaxUrl from '../../assets/js/ajaxUrl'
import utils from '../../assets/js/utils'

import './index.scss'

import { set as setGlobalData, get as getGlobalData } from '../../assets/js/global_data'

export default class IssueSelf extends Component {

	config = {
		navigationBarTitleText: '发布个人信息',
		backgroundColor: '#fff'
	}

	constructor() {
		super(...arguments)
	}

	componentDidMount() {
		this.initValidator()
	}

	/**
  * @msg: 表单验证
  * @param {type} 
  * @return: 
  */
	initValidator = () => {
		WeValidator.addRule('selfSkillRule', (value, params) => {
			return Array.isArray(value) && value.length
		})
		this.oValidator = new WeValidator({
			rules: {
				selfProj: {
					required: true
				},
				selfGrade: {
					required: true
				},
				selfMajor: {
					required: true
				},
				selfSkill: {
					selfSkillRule: true
				},
				selfTime: {
					required: true
				}
			},
			messages: {
				selfProj: {
					required: '请输入比赛名称'
				},
				selfSkill: {
					selfSkillRule: '请至少输入一项技能'
				},
				selfGrade: {
					required: '请输入年级'
				},
				selfMajor: {
					required: '请输入专业'
				},
				selfTime: {
					required: '请选择截止时间'
				}
			}
		})
	}

	onDateChange = e => {
		this.setState({
			dateSel: e.detail.value
		})
	}

	handleFormSubmit = e => {
		const { selfGrade: personGrade, selfMajor: personMajor, selfProj: projectName, selfSkill0, selfSkill1, selfSkill2, selfSkill3, selfTime: endTime } = e.detail.value
		let selfSkill = []
		if (selfSkill0) selfSkill.push(selfSkill0)
		if (selfSkill1) selfSkill.push(selfSkill1)
		if (selfSkill2) selfSkill.push(selfSkill2)
		if (selfSkill3) selfSkill.push(selfSkill3)
		if (!this.oValidator.checkData(Object.assign({}, e.detail.value, {
			selfSkill
		}))) return
		const defaultParams = {
			"projectPersonId": 0,
			"userId": 0,
			"userNickname": "",
			"projectName": "",
			"personGrade": "",
			"personMajor": "",
			"personSkill": "",
			"endTime": ""
		}
		utils.login().then(res => {
			utils.httpRequest({
				url: ajaxUrl.issueSelfProj,
				loading: true,
				data: Object.assign({}, defaultParams, {
					userId: res.userId,
					userNickname: res.userNickname,
					projectName,
					personGrade,
					personMajor,
					personSkill: selfSkill.join(','),
					endTime
				})
			}).then(data => {
				Taro.showModal({
					title: '发布成功!',
					content: '据说转发到人多的群里可以秒匹配哦~',
					icon: 'success',
					cancelText: '返回列表',
					confirmText: '这就转发'
				}).then(res => {
					setGlobalData('FEFRESH_FLAG', true)
					setGlobalData('SWITCH_TAB_VAL', {
						tab: 1,
						category: 1
					})
					res.cancel && (() => {
						Taro.switchTab({
							url: '/pages/home/home'
						})
					})()
					res.confirm && (()=>{
						Taro.redirectTo({
							url: `/pages/proj_detail/proj_detail?id=${data.data}&isTeam=0`
						})
					})()
				})

			})
		})
	}

	render() {
		const { dateSel } = this.state
		return (
			<View className='issue-self-wrapper'>
				<Form
					className='form-wrapper'
					onSubmit={this.handleFormSubmit}
				>
					<View className='form-item self-tips-wrapper'>
						<Text className='self-tips'>找团队需要发布你的个人信息</Text>
						<Text className='self-tips'>以方便更多的参赛团队来找你</Text>
					</View>

					<View className='form-item self-proj-wrapper flex'>
						<Label for='self-proj'>意向比赛：</Label>
						<Input
							className='self-proj flex-item'
							id='self-proj'
							name='selfProj'
							maxLength='20'
							placeholder='你想参与比赛的名称'
							placeholderClass='input-placeholder'
						/>
					</View>

					<View className='form-item self-grade-wrapper flex'>
						<Label for='self-grade'>所在年级：</Label>
						<Input
							className='self-grade flex-item'
							id='self-grade'
							name='selfGrade'
							maxLength='10'
							placeholder='请填写你的年级'
							placeholderClass='input-placeholder'
						/>
					</View>

					<View className='form-item self-major-wrapper flex'>
						<Label for='self-major'>所在专业：</Label>
						<Input
							className='self-major flex-item'
							id='self-major'
							name='selfMajor'
							maxLength='20'
							placeholder='请填写你的专业'
							placeholderClass='input-placeholder'
						/>
					</View>

					<View className='form-item self-skill-wrapper flex'>
						<Label for='self-skill'>你的技能：</Label>
						<View className='skill-list'>
							<Text className='txt'>最少填写一项，每项2-8个字符</Text>
							<View className='input-list flex'>
								<Input className='self-skill self-skill-0' name='selfSkill0' maxLength='8' placeholder='技能一' placeholderClass='input-placeholder' />
								<Input className='self-skill self-skill-1' name='selfSkill1' maxLength='8' placeholder='技能二' placeholderClass='input-placeholder' />
								<Input className='self-skill self-skill-2' name='selfSkill2' maxLength='8' placeholder='技能三' placeholderClass='input-placeholder' />
								<Input className='self-skill self-skill-3' name='selfSkill3' maxLength='8' placeholder='技能四' placeholderClass='input-placeholder' />
							</View>
						</View>
					</View>

					<View className='form-item self-time-wrapper flex'>
						<Label for='self-time'>截止时间：</Label>
						<Picker
							mode='date'
							name='selfTime'
							className='self-time flex-item'
							start={moment().format('YYYY-MM-DD')}
							onChange={this.onDateChange}
						>
							{
								dateSel
									? <Text>{dateSel}</Text>
									: <Text className='input-placeholder'>到期之后自动删除此条动态</Text>
							}
						</Picker>

					</View>

					<View className='form-item button-wrapper'>
						<Button
							type='primary'
							formType='submit'
						>发布</Button>
					</View>
				</Form>
			</View>
		)
	}
}