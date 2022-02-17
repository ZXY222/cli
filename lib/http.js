// 通过 axios 处理请求
const axios = require('axios')

axios.interceptors.response.use(res => {
    return res.data;
})


/**
 * 获取模板列表
 * @returns Promise
 */
async function getRepoList(name = 'zxy2222') {
    return axios.get(`https://api.github.com/users/${name}/repos`)
}

/**
 * 获取版本信息
 * @param {string} repo 模板名称
 * @returns Promise
 */
async function  getTagList(repo) {
    return axios.get(`https://api.github.com/repos/zxy2222/${repo}/tags`)
}

/**
 * 获取自定义仓库获取版本信息
 * @param {string} repo 模板名称
 * @returns Promise
 */

async function  getCustomTagList(repo) {
    return axios.get(`https://api.github.com/repos/zxy2222/${repo}/tags`)
}

module.exports = {
    getRepoList,
    getTagList,
    getCustomTagList
}