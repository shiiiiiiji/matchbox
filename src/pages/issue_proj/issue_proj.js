import Taro, { Component } from '@tarojs/taro'
import { Button, Picker } from '@tarojs/components';

import WeValidator from 'we-validator'
import moment from 'moment'

import ajaxUrl from '../../assets/js/ajaxUrl'
import utils from '../../assets/js/utils'

import { set as setGlobalData, get as getGlobalData } from '../../assets/js/global_data'

import './index.scss';

export default class IssueProj extends Component {

	config = {
		navigationBarTitleText: '发布团队信息',
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
		WeValidator.addRule('projPneedRule', (value, params) => {
			return value == 1
		})
		WeValidator.addRule('projSkillRule', (value, params) => {
			return Array.isArray(value) && value.length
		})
		this.oValidator = new WeValidator({
			rules: {
				projName: {
					required: true
				},
				projPhad: {
					required: true
				},
				projPneed: {
					required: true,
					projPneedRule: true
				},
				projGhad: {
					required: true
				},
				projGneed: {
					required: true
				},
				projMneed: {
					required: true
				},
				projSkill: {
					projSkillRule: true
				},
				projDesc: {
					required: true
				},
				projTime: {
					required: true
				}
			},
			messages: {
				projName: {
					required: '请输入比赛名称'
				},
				projPhad: {
					required: '请输入目前团队人数'
				},
				projPneed: {
					required: '请输入所需队员人数',
					projPneedRule: '每次发布仅可招纳 1 人'
				},
				projGhad: {
					required: '请输入负责人的年级'
				},
				projGneed: {
					required: '请输入所需队员年级'
				},
				projMneed: {
					required: '请输入所需队员专业'
				},
				projSkill: {
					projSkillRule: '请至少输入一项技能'
				},
				projDesc: {
					required: '请输入描述'
				},
				projTime: {
					required: '请选择截止时间'
				}
			}
		})
	}

	handleFormSubmit = e => {
		console.log(e.detail.value)
		const { projName: projectName, projPhad: teamNum, projPneed: needPersonNum, projGhad: chargePersonGrade, projGneed: needPersonGrade, projMneed: needPersonMajor, projSkill0, projSkill1, projSkill2, projSkill3, projDesc: projectDescribe, projTime: endTime } = e.detail.value
		let projSkill = []
		if (projSkill0) projSkill.push(projSkill0)
		if (projSkill1) projSkill.push(projSkill1)
		if (projSkill2) projSkill.push(projSkill2)
		if (projSkill3) projSkill.push(projSkill3)
		if (!this.oValidator.checkData(Object.assign({}, e.detail.value, {
			projSkill
		}))) return
		const defaultParams = {
			"projectTeamId": 0,
			"userId": 0,
			"userNickname": "",
			"projectName": "",
			"teamNum": 0,
			"needPersonNum": 0,
			"chargePersonGrade": "",
			"needPersonGrade": "",
			"needPersonMajor": "",
			"needPersonSkill": "",
			"projectDescribe": "",
			"endTime": ""
		}
		utils.login().then(res => {
			console.log(res)
			utils.httpRequest({
				url: ajaxUrl.issueTeamProj,
				loading: true,
				data: Object.assign({}, defaultParams, {
					userId: res.userId,
					userNickname: res.userNickname,
					projectName,
					teamNum,
					needPersonNum,
					chargePersonGrade,
					needPersonGrade,
					needPersonMajor,
					needPersonSkill: projSkill.join(','),
					projectDescribe,
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
						category: 0
					})
					res.cancel && (() => {
						Taro.switchTab({
							url: '/pages/home/home'
						})
					})()
					res.confirm && (()=>{
						Taro.redirectTo({
							url: `/pages/proj_detail/proj_detail?id=${data.data}&isTeam=1`
						})
					})()
				})
			})
		})
	}

	onDateChange = e => {
		this.setState({
			dateSel: e.detail.value
		})
	}

	render() {
		const { dateSel } = this.state
		return (
			<View className='issue-proj-wrapper'>
				<Form
					className='form-wrapper'
					onSubmit={this.handleFormSubmit}
				>
					<View className='form-item proj-tips-wrapper'>
						<Text className='proj-tips'>找队员需要发布你的招募信息</Text>
						<Text className='proj-tips'>以方便更多的想参赛的小伙伴来找你</Text>
					</View>

					<View className='form-item proj-name-wrapper flex'>
						<Label for='proj-name'>比赛名称：</Label>
						<Input
							className='proj-name flex-item'
							id='proj-name'
							name='projName'
							placeholder='请输入参与比赛的名称'
							placeholderClass='input-placeholder'
						/>
					</View>

					<View className='form-item proj-phad-wrapper flex'>
						<Label for='proj-phad'>目前团队人数：</Label>
						<Input
							className='proj-phad flex-item'
							id='proj-phad'
							name='projPhad'
							type='number'
							placeholder='请填写人数'
							placeholderClass='input-placeholder'
						/>
					</View>

					<View className='form-item proj-pneed-wrapper flex'>
						<Label for='proj-pneed'>所需队员人数：</Label>
						<Input
							className='proj-pneed flex-item'
							id='proj-pneed'
							name='projPneed'
							type='number'
							disabled
							value='1'
							placeholder='每次发布仅可招纳 1 人'
							placeholderClass='input-placeholder'
						/>
					</View>
					<View className='form-item proj-pneed-text-wrapper flex'>
						<Label></Label>
						<Text className='info flex-item'>(每次发布暂仅可招纳 1 人)</Text>
					</View>

					<View className='form-item proj-ghad-wrapper flex'>
						<Label for='proj-ghad'>负责人的年级：</Label>
						<Input
							className='proj-ghad flex-item'
							id='proj-ghad'
							name='projGhad'
							placeholder='请填写你的年级'
							placeholderClass='input-placeholder'
						/>
					</View>

					<View className='form-item proj-gneed-wrapper flex'>
						<Label for='proj-gneed'>所需队员年级：</Label>
						<Input
							className='proj-gneed flex-item'
							id='proj-gneed'
							name='projGneed'
							placeholder='如无要求，则填写“不限”'
							placeholderClass='input-placeholder'
						/>
					</View>

					<View className='form-item proj-mneed-wrapper flex'>
						<Label for='proj-mneed'>所需队员专业：</Label>
						<Input
							className='proj-mneed flex-item'
							id='proj-mneed'
							name='projMneed'
							placeholder='如无要求，则填写“不限”'
							placeholderClass='input-placeholder'
						/>
					</View>

					<View className='form-item proj-skill-wrapper flex'>
						<Label for='proj-skill'>所需队员技能：</Label>
						<View className='skill-list'>
							<Text className='txt'>最少填写一项，每项2-8个字符</Text>
							<View className='input-list flex'>
								<Input className='proj-skill proj-skill-0' name='projSkill0' maxLength='8' placeholder='技能一' placeholderClass='input-placeholder' />
								<Input className='proj-skill proj-skill-1' name='projSkill1' maxLength='8' placeholder='技能二' placeholderClass='input-placeholder' />
								<Input className='proj-skill proj-skill-2' name='projSkill2' maxLength='8' placeholder='技能三' placeholderClass='input-placeholder' />
								<Input className='proj-skill proj-skill-3' name='projSkill3' maxLength='8' placeholder='技能四' placeholderClass='input-placeholder' />
							</View>
						</View>
					</View>

					<View className='form-item proj-desc-wrapper flex'>
						<Label for='proj-desc'>项目描述：</Label>
						<Textarea
							className='proj-desc flex-item'
							id='proj-desc'
							name='projDesc'
							maxlength='50'
							placeholder='大致介绍下吧'
							placeholderClass='input-placeholder'
						/>
					</View>

					<View className='form-item proj-time-wrapper flex'>
						<Label for='proj-time'>截止时间：</Label>
						<Picker
							mode='date'
							name='projTime'
							className='proj-time flex-item'
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