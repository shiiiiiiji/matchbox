/*
 * @User: uhr(ze.zh@hotmail.com)
 * @Date: 2018-11-14 10:24:54
 * @Desc: 环境配置
 */

const local = {
  environmentName: "本地环境",
  environment: "dev",
  basePath: "https://47.98.98.59/matchbox"
};

const prod = {
  environmentName: "生产环境",
  environment: "prod",
  // basePath: 'https://www.shmaur.com/matchbox'
  basePath: "https://www.mbfunlife.com/matchbox"
};

module.exports = prod;
