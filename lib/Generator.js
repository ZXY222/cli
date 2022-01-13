
const { getRepoList, getTagList } = require('./http')
const ora = require('ora')
const inquirer = require('inquirer')
const path = require('path')
const downloadGitRepo = require('download-git-repo')
const util = require("util");
const chalk = require('chalk')

// 添加加载动画
async function wrapLoading(fn, message, ...args) {
    // 使用 ora 初始化，传入提示信息 message
    const spinner = ora(message);
    // 开始加载动画
    spinner.start();

    try {
        // 执行传入方法 fn
        const result = await fn(...args);
        // 状态为修改为成功
        spinner.succeed();
        return result;
    } catch (error) {
        // 状态为修改为失败
        return false
        spinner.fail('Request failed, refetch ...')
    }
}


class Generator {
    constructor (name, targetDir){
        // 目录名称
        this.name = name;
        // 创建位置
        this.targetDir = targetDir;
        this.downloadGitRepo = util.promisify(downloadGitRepo)
    }
    // 获取用户选择的模板
    // 1）从远程拉取模板数据
    // 2）用户选择自己新下载的模板名称
    // 3）return 用户选择的名称

    async getRepo() {
        // 1）从远程拉取模板数据
        const repoList = await wrapLoading(getRepoList, '获取模板中,别急！！！');
        if (!repoList) return;

        // 过滤我们需要的模板名称
        const repos = repoList?.map(item => item.name);

        // 2）用户选择自己新下载的模板名称
        const { repo } = await inquirer.prompt({
            name: 'repo',
            type: 'list',
            choices: repos,
            message: '选择我们创建的项目模板'
        })

        // 3）return 用户选择的名称
        return repo;
    }

    async getTag(repo) {
        // 基于 repo 结果，远程拉取对应的 tag 列表
        const tags = await wrapLoading(getTagList, '获取版本中,别急！！！', repo);
        if (!tags || tags.length === 0) return;

        // 过滤我们需要的 tag 名称
        const tagsList = tags.map(item => item.name);

        // 用户选择自己需要下载的 tag
        const { tag } = await inquirer.prompt({
            name: 'tag',
            type: 'list',
            choices: tagsList,
            message: '请选择需要的版本'
        })

        // return 用户选择的 tag
        return tag
    }

    async downLoadProject(repo, tag) {
        // 下载地址
        const requestUrl = `zxy2222/${repo}${tag?'#'+tag:''}`;

        // 下载方法
        const res = await wrapLoading(
            this.downloadGitRepo, // 远程下载方法
            '正在生成模板', // 加载提示信息
            requestUrl, // 参数1: 下载地址
            path.resolve(process.cwd(), this.targetDir)) // 参数2: 创建位置

        // wrapLoading做了catch捕捉,会返false
        return res
    }

    // 核心创建逻辑
    async create(){
        // 获取选中模板名称
        const repo = await this.getRepo()

        if (!repo) {
            chalk.hex('#db041d').bold('模板获取出错')
        }
        console.log('傻逼你选择的是' + repo)

        // 获取版本
        const tag = await this.getTag(repo)
        if (!tag) {
            chalk.hex('#db041d').bold('版本获取出错')
        }

        console.log('傻逼你选择的版本是' + tag)
        const result = await this.downLoadProject(repo, tag || '')
        if (result === false) {
            chalk.hex('#db041d').bold('项目创建失败')
            return
        }
        // 创建完成提示
        console.log(`\r\n项目创建成功 ${chalk.cyan(this.name)}`)
        console.log(`\r\n  cd ${chalk.cyan(this.name)}`)
        console.log('  npm install\r\n')
        console.log('  npm run dev\r\n')
    }
}

module.exports = Generator;