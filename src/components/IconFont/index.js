import Taro, { Component } from '@tarojs/taro'
import { Text } from '@tarojs/components'

import './index.scss'

export default class IconFont extends Component {
	static defaultProps = {
		className: '',
		type: '',
		size: ''
	}

	constructor() {
	}

	render() {
		let { type, size } = this.props
		if (!type) return null
		return (
			<Text className='icon fa weui-grid__icon fa-{{type}} icon_{{size}}'></Text>
		)
	}
}