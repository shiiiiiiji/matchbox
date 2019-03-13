import Taro from '@tarojs/taro'
import ajaxUrl from './ajaxUrl'

import { set as setGlobalData, get as getGlobalData } from './global_data'

/**
 * @msg: 服务端状态信息
 */
const SERVER_INFO = {
	'0000': 'OPERATION_SUCCESS',	// 操作成功
	'9985': 'DATA_IS_EXISTED',	// 数据不存在
	'9986': 'IS_DELETED',	// 已删除
	'9987': 'ACCOUNT_IS_EXISTED',	// 账号已存在
	'9988': 'PASSWORD_ERROR',	// 密码错误
	'9989': 'ACCOUNT_NOT_EXIST',	// 账号不存在
	'9990': 'COOKIE_LOST',	// 缓存失效
	'9992': 'DATA_ERROR',	// 数据重复
	'9993': 'UPLOAD_ERROR',	// 文件上传错误
	'9994': 'PARAMETER_ERROR',	// 参数错误
	'9995': 'PIC_UPLOAD_ERROR',	// 图片上传失败
	'9996': 'MESS_SEND_ERROR',	// 短信发送失败
	'9997': 'PARAMETER_NULL',	// 必填参数为空
	'9998': 'NO_DATA',	// 无数据
	'9999': 'SYSTEM_ERROR',	// 系统错误
}

/**
 * @msg: 发起请求
 * @param {type} 
 * @return: 
 */
function httpRequest(params) {
	return new Promise((resolve, reject) => {
		if (params.loading) Taro.showLoading()
		// console.log('发起请求：params', params)
		Taro.request({
			url: params.url,
			method: params.method || 'POST',
			dataType: params.dataType || 'json',
			data: params.data || {},
			success: res => {
				const { data } = res
				if (data && data.code == '0000') {
					resolve(data)
				} else {
					Taro.showToast({
						title: data.msg || '网络异常'
					})
					console.error('httpRequest失败：', data);
					reject(data);
				}
			},
			fail: error => {
				Taro.showToast({
					title: '请求异常'
				})
				console.error('httpRequest失败：', error);
				reject(error);
			},
			complete: () => {
				if (params.loading) Taro.hideLoading()
			}
		})
	})
}

function login(queryData = { default: 1 }) {
	return new Promise((resolve, reject) => {
		const userInfo = getGlobalData('userInfo')
		// if (userInfo && userInfo.userId) {
		if (userInfo && userInfo.wchatCode) {
			resolve(userInfo)
		} else {
			Taro.login().then(res => {
				// console.log('登录凭证：', res)
				if (res.code) {
					httpRequest({
						url: ajaxUrl.login,
						method: 'GET',
						data: {
							code: res.code
						}
					}).then(res => {
						setGlobalData('userInfo', res.data)
						if (res.data.isFirst == 1) {
							// 第一次

							Taro.redirectTo({
								url: '/pages/guide/guide?' + queryStringfy(queryData)
							})
							console.log('第一次登录', res.data)
							reject(res.data)
						} else {
							resolve(res.data)
						}
					}).catch(err => {
						console.error('服务端登录接口报错', err)
						reject(err)
					})
				} else {
					console.error('登录凭证为空', res)
					reject(err)
				}
			}).catch(err => {
				console.error('获取登录凭证出错', err)
				reject(err)
			})
		}

	})
}

function notice(params) {
	const defaultParams = {
		"userId": 0,
		"userNickname": "",
		"messageType": "",
		"dataId": 0,
		"dataUserId": 0,
		"dataUserNickname": ""
	}
	httpRequest({
		url: ajaxUrl.doChat,
		data: Object.assign({}, defaultParams, params || {})
	})
}

function queryStringfy(obj) {
	let keys = Object.keys(obj);
	let str = '';
	keys.forEach(k => {
		if (obj[k]) {
			str += `&${k}=${obj[k]}`;
		}
	});

	return str.slice(1);
}

module.exports = {
	httpRequest,
	login,
	notice,
	queryStringfy
}