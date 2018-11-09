import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'

import './index.scss'
import ProjItem from '../../components/ProjItem';

export default class ProjDetail extends Component {
	constructor(props) {
		super(props)
	}

	render() {
		let itemData = {}
		itemData.isDetail = true
		return (
			<View className='proj-detail-wrapper'>
				<ProjItem itemData={itemData} />
			</View>
		)
	}

}