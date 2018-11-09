/*!
 * WeApp v1.0.0 (https://github.com/ChanceYu/weapp)
 * Copyright 2017 ChanceYu.
 * Licensed under the MIT license
 */

/* 公共方法封装 */

import Taro from '@tarojs/taro'
import moment from 'moment'

import { set as setGlobalData, get as getGlobalData } from './global_data'

moment.locale('zh-cn')	// 设置中文

const common = {

  /**
   * 类型判断
   * @param {Any} value 任意需要判断的参数
   * @return {String} 返回的类型
   */
	type(value) {
		let str = Object.prototype.toString.call(value).split(' ')[1];
		str = str.substr(0, str.length - 1);

		/* Object Array Boolean String Function Number ... */
		return str;
	},

  /**
   * 将对象解析成url字符串
   * @param  {Object} obj 参数对象
   * @param  {Boolean} unEncodeURI 不使用编码
   * @return {String} 转换之后的url参数
   */
	param(obj = {}, unEncodeURI) {
		let result = [];

		for (let name of Object.keys(obj)) {
			let value = obj[name];

			result.push(name + '=' + (unEncodeURI ? value : encodeURIComponent(value)));
		}

		if (result.length) {
			return '?' + result.join('&');
		} else {
			return '';
		}
	},

  /**
   * 将url字符串解析成对象
   * @param  {String} str 带url参数的地址
   * @param  {Boolean} unDecodeURI 不使用解码
   * @return {Object} 转换之后的url参数
   */
	unparam(str = '', unDecodeURI) {
		let result = {};
		let query = str.split('?')[1];

		if (!query) return result;

		let arr = query.split('&');

		arr.forEach((item, idx) => {
			let param = item.split('=');
			let name = param[0];
			let value = param[1] || '';

			if (name) {
				result[name] = unDecodeURI ? value : decodeURIComponent(value);
			}
		});

		return result;
	},

  /**
   * 转发分享
   * @param  {String} title 标题
   * @param  {String} url 页面地址，默认就是当前页面地址
   * @return {Function} 转发函数
   */
	share(title = '小程序名称!', url) {
		return () => {
			let pages = getCurrentPages();
			let currPage = pages[pages.length - 1];
			let path = '/' + currPage.route;
			let params = common.param(currPage.options, true);

			return {
				title: title,
				path: (url || path) + params
			}
		}
	},

  /**
   * 保留当前页面，跳转到应用内的某个页面
   * @param {String} url 页面路径
   * @param {Object} params 页面参数
   */
	navigateTo(url, params) {
		this._openInterceptor('navigateTo', url, params);
	},

  /**
   * 关闭当前页面，跳转到应用内的某个页面
   * @param {String} url 页面路径
   * @param {Object} params 页面参数
   */
	redirectTo(url, params) {
		this._openInterceptor('redirectTo', url, params);
	},

  /**
   * 跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面
   * @param {String} url 页面路径
   * @param {Object} params 页面参数
   */
	switchTab(url, params) {
		this._openInterceptor('switchTab', url, params);
	},

  /**
   * 关闭所有页面，打开到应用内的某个页面
   * @param {String} url 页面路径
   * @param {Object} params 页面参数
   */
	reLaunch(url, params) {
		this._openInterceptor('reLaunch', url, params);
	},

  /**
   * 页面跳转封装
   * @param {String} method 微信JS方法
   * @param {String} url 页面路径
   * @param {Object} params 页面参数
   */
	_openInterceptor(method, url, params) {
		if (this.IsPageNavigating) return;
		this.IsPageNavigating = true;

		params = this.param(params);

		wx[method]({
			url: url + params,
			complete: () => {
				this.IsPageNavigating = false;
			}
		});
	},

	/**
  * @msg: 格式化显示时间
  * @param {Object/String} time 事件对象 
  * @return: 
  */
	formatTime(t) {
		// console.log(moment.isMoment(t));
		if (!moment.isMoment(t)) {
			t = moment(t)
		}
		const now = moment()
		const diff = now.diff(t, 's')
		if (t < 60) return '刚刚'
		if (t < 60 * 60) return parseInt(t / 60) + '分钟前'
		if (t.isSame(now, 'day')) return t.format('HH:mm')
		if (t.isSame(now, 'year')) return t.format('MM-DD')
		return t.format('YYYY-MM-DD')
	},

	/**
  * @msg: 格式化显示数量
  * @param {Number} num 
  * @return: 
  */
	formatNumber(num) {
		return num < 1000 ? num : '999+'
	},

	/**
  * @msg: 复制微信号
  * @param {type} 
  * @return: 
  */
	copyWeChat(v) {
		Taro.setClipboardData({
			data: v
		}).then(() => {
			// 此接口默认会 toast
			Taro.showToast({
				title: '微信号复制成功',
				icon: 'success',
				duration: 1200
			}).then(res => {
				if (Taro.getStorageSync('MB_HAD_BOUNCE') != '1') {
					console.log(Taro.getStorageSync('MB_HAD_BOUNCE'))
					const appName = getGlobalData('appName')
					setTimeout(() => {
						Taro.showModal({
							title: '小彩蛋',
							content: '快去添加好友聊起来吧~记得备注来自“' + appName + '”哦',
							showCancel: false
						})
						Taro.setStorage({
							key: 'MB_HAD_BOUNCE',
							data: '1'
						})
					}, 1200)
				}
			})

		}).catch((e) => {
			Taro.showToast({
				title: '微信号复制失败！',
				icon: 'none'
			})
		})
	}
};

module.exports = common;