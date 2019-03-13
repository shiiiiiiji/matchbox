import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'

import ajaxUrl from '../../assets/js/ajaxUrl'
import utils from '../../assets/js/utils'

import './index.scss'
import ProjItem from '../../components/ProjItem';

import { set as setGlobalData, get as getGlobalData } from '../../assets/js/global_data'

export default class ProjDetail extends Component {
	constructor(props) {
		super(props)
	}

	config = {
		navigationBarTitleText: ''
	}

	componentWillMount() {
		// 获取 query 参数
		const queryData = this.$router.params
		this.setState({
			queryData
		})
	}

	componentDidMount() {
		const { queryData } = this.state
		const isTeam = queryData.isTeam == 1
		Taro.setNavigationBarTitle({
			title: isTeam ? '团队详情页' : '队员详情页'
		})
		if (!queryData.id || queryData.id === 'undefined') {
			Taro.showToast({
				icon: 'none',
				title: '参数有误'
			})
			return false;
		}
		utils.login().then(userInfo => {
			const _params = isTeam ? { projectTeamId: queryData.id } : { projectPersonId: queryData.id }
			utils.httpRequest({
				url: isTeam ? ajaxUrl.getTeamProjDetail : ajaxUrl.getSelfProjDetail,
				method: 'GET',
				data: _params
			}).then(res => {
				this.setState({
					projInfo: res.data,
					userInfo
				})
			})
		})
	}

	onShareAppMessage = res => {
		const { queryData, projInfo } = this.state
		const isTeam = queryData.isTeam == 1
		const id = isTeam ? projInfo.projectTeamId : projInfo.projectPersonId
		console.log(`/pages/home/home?type=proj&share=1&id=${id}&isTeam=${isTeam ? 1 : 0}`)
		return {
			title: isTeam
				? `${projInfo.userNickname}想要找人一起参与项目，快来吧`
				: `${projInfo.userNickname}正在找靠谱的团队哦，快来看看`,
			path: `/pages/home/home?type=proj&share=1&id=${id}&isTeam=${isTeam ? 1 : 0}`
		}
	}

	delItem = () => {
		const { queryData, projInfo } = this.state
		Taro.showModal({
			content: '确定删除吗？'
		}).then(res => {
			const isTeam = queryData.isTeam == 1
			const _params = isTeam ? { projectTeamId: projInfo.projectTeamId } : { projectPersonId: projInfo.projectPersonId }
			res.confirm && utils.httpRequest({
				url: isTeam ? ajaxUrl.delTeamProj : ajaxUrl.delSelfProj,
				method: 'GET',
				data: _params
			}).then(() => {
				setGlobalData('FEFRESH_FLAG', true)
				Taro.navigateBack()
			})
		})
	}

	render() {
		const { queryData, projInfo, userInfo } = this.state
		if (!projInfo) return null
		return (
			<View className='proj-detail-wrapper'>
				{/* <View className='read-tip flex'>已有{projInfo.readNum}人在这里找过项目，如你有需要，快来发布吧</View> */}
				<ProjItem
					isList={false}
					isTeam={queryData.isTeam == 1}
					itemData={projInfo}
				/>

				<View className='btn-wrapper flex'>
					<Button
						type='primary'
						size='mini'
						openType='share'
					>分享</Button>
					<Button
						type='warn'
						size='mini'
						hidden={userInfo.userId != projInfo.userId}
						onClick={this.delItem}
					>删除</Button>
				</View>

			</View>
		)
	}

}