import config from '../../config/app.config'

module.exports = {
	login: `${config.basePath}/user/login`,	// 登录
	getUserDetail: `${config.basePath}/user/detail`,	// 获取用户详情
	getMsgUnReadNum: `${config.basePath}/message/unread_num`, // 获取用户未读消息数
	modifyUserinfo: `${config.basePath}/user/modify`,	// 修改用户信息

	getIdeaList: `${config.basePath}/idea/select_pagination`,	// 想法列表
	getProjList: `${config.basePath}/user/select_pagination_project`,	// 项目列表
	getSelfProj: `${config.basePath}/projectPerson/select_pagination`,	// 个人项目列表
	getTeamProj: `${config.basePath}/projectTeam/select_pagination`,	// 团队项目列表

	getIdeaDetail: `${config.basePath}/idea/detail`,	// 想法详情
	getSelfProjDetail: `${config.basePath}/projectPerson/detail`,	// 个人项目详情
	getTeamProjDetail: `${config.basePath}/projectTeam/detail`,	// 个人项目详情

	issueIdea: `${config.basePath}/idea/add`,	// 发布想法
	issueSelfProj: `${config.basePath}/projectPerson/add`,	// 发布个人项目
	issueTeamProj: `${config.basePath}/projectTeam/add`,	// 发布团队项目

	delIdea: `${config.basePath}/idea/del`, // 删除想法
	delSelfProj: `${config.basePath}/projectPerson/del`, // 删除个人项目
	delTeamProj: `${config.basePath}/projectTeam/del`, // 删除团队项目

	getSchoolList: `${config.basePath}/college/select_pagination`,	// 学校列表

	doLike: `${config.basePath}/praise/add`,	// 点赞
	cancelLike: `${config.basePath}/praise/del`,	// 取消点赞
	like: `${config.basePath}/praise/praiseOrCancel`,	// 点赞或取消点赞

	doComment: `${config.basePath}/comment/add`,	// 评论
	delComment: `${config.basePath}/comment/del`,	// 删除评论
	getCommentList: `${config.basePath}/comment/select_pagination`,	// 获取评论列表

	getBannerList: `${config.basePath}/banner/select_pagination`,	// banner 列表

	getNotice: `${config.basePath}/message/select_pagination`,	// 通知
	doChat: `${config.basePath}/message/chat`,	// 找他聊聊

	getDictValue: `${config.basePath}/dict/detailByCode`, 	// 想法发布量

	getTagsList: `${config.basePath}/label/select_pagination`, 	// 获取标签列表

}