import Taro, { Component } from '@tarojs/taro'
import { View, Icon } from '@tarojs/components'
import moment from 'moment'
import { set as setGlobalData, get as getGlobalData } from '../../assets/js/global_data'

import common from '../../assets/js/common'

import ajaxUrl from '../../assets/js/ajaxUrl'
import utils from '../../assets/js/utils'

import IconFont from '../IconFont'

import './index.scss'

export default class ProjItem extends Component {
	static defaultProps = {
		isTeam: true,
		isList: true,
		itemData: {}
	}

	constructor(props) {
		super(props)
		const { isTeam, isList, itemData } = this.props
		this.state = {
			isTeam,
			isList,
			itemData
		}
	}

	handleClickChat = (e) => {
		e.stopPropagation()
		const { isTeam, itemData } = this.state
		if (typeof itemData.wchatCode === 'string') {
			const userInfo = getGlobalData('userInfo')
			common.copyWeChat(itemData.wchatCode, () => {
				utils.notice({
					userId: userInfo.userId,
					userNickname: userInfo.userNickname,
					messageType: isTeam ? 'project-team' : 'project-person',
					dataId: isTeam ? itemData.projectTeamId : itemData.projectPersonId,
					dataUserId: itemData.userId,
					dataUserNickname: itemData.userNickname
				})
			})
		}
	}

	jump2Detail = () => {
		const { isList, isTeam, itemData } = this.props
		const _id = (isTeam == 1 ? itemData.projectTeamId : itemData.projectPersonId) || itemData.dataId
		isList && Taro.navigateTo({
			url: `/pages/proj_detail/proj_detail?id=${_id}&isTeam=${isTeam == 1 ? 1 : 0}`
		})
	}

	render() {
		const { isList, isTeam, itemData } = this.state
		return (
			<View className='proj-item-wrapper' onClick={this.jump2Detail}>
				<View className='proj-item__header flex'>
					<View className='proj-meta-info'>
						<Text className='user-name'>{itemData.userNickname}</Text>
						<Text className='pub-time'>{common.formatTime(moment(itemData.createTime))}</Text>
					</View>
					<Text className='top' hidden={!itemData.isTop}>置顶</Text>
				</View>
				<View className='proj-item__content'>
					<View className='proj-content'>
						<View className='proj-content-item flex'>
							<Text className='title'>{isTeam ? '比赛名称' : '意向比赛'}</Text>
							<Text className='value flex-item'>{itemData.projectName}</Text>
						</View>
						<View className='proj-content-item flex' hidden={!isTeam}>
							<Text className='title'>招募人数</Text>
							<Text className='value flex-item'>{itemData.needPersonNum}人</Text>
						</View>
						<View className='proj-content-item flex' hidden={isList || !isTeam}>
							<Text className='title'>团队人数</Text>
							<Text className='value flex-item'>{itemData.teamNum}人</Text>
						</View>

						<View className='proj-content-item flex' hidden={!isTeam}>
							<Text className='title'>负责人所在年级</Text>
							<Text className='value flex-item'>{itemData.chargePersonGrade}</Text>
						</View>
						<View className='proj-content-item flex' hidden={!isTeam}>
							<Text className='title'>所需队员年级及专业</Text>
							<Text className='value flex-item'>{itemData.needPersonGrade}-{itemData.needPersonMajor}</Text>
						</View>
						<View className='proj-content-item flex' hidden={isList || !isTeam}>
							<Text className='title'>所需技能</Text>
							<Text className='value flex-item'>{itemData.needPersonSkill}</Text>
						</View>
						<View className='proj-content-item flex' hidden={isList || !isTeam}>
							<Text className='title'>项目描述</Text>
							<Text className='value flex-item'>{itemData.projectDescribe}</Text>
						</View>
						<View className='proj-content-item flex' hidden={isTeam}>
							<Text className='title'>年级及专业</Text>
							<Text className='value flex-item'>{itemData.personGrade}-{itemData.personMajor}</Text>
						</View>
						<View className='proj-content-item flex' hidden={isTeam}>
							<Text className='title'>擅长方面</Text>
							<Text className='value flex-item'>{itemData.personSkill}</Text>
						</View>
						<View className='proj-content-item flex'>
							<Text className='title'>截止时间</Text>
							<Text className='value flex-item'>{itemData.endTime}</Text>
						</View>
					</View>
				</View>
				<View className='proj-item__footer flex'>
					<View className='chat' onClick={this.handleClickChat}>找TA聊聊</View>
					<View className='proj-action-list flex-item' hidden={isList}>
						{/* <View className='action-item share flex'>
							<IconFont type='share-alt' />
						</View> */}
					</View>
				</View>
			</View>
		)
	}
}