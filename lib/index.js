
const path = require('path')
const fs = require('fs-extra')
const inquirer = require('inquirer')


module.exports = async function (name, options) {

    // 获取当前命令行所在路径
    const cwd = process.cwd()
    // 拼接创建项目地址, 当前路径+项目名称
    const projectUrl = path.join(cwd, name)

    // 判断当前路径下是否存在与项目名重复目录
    if (fs.existsSync(projectUrl)) {

        // 判断用户是否要强制创建，覆盖
        if (options.force) {
            await fs.remove(projectUrl)
        } else {
            // 询问是否覆盖
            const { cover } = await inquirer.prompt([
                {
                    type:"confirm",
                    message:"是否覆盖当前目录？",
                    name:"cover",
                    default:true
                }
            ])
            if (!cover) {
                return
            }
            await fs.remove(projectUrl)
        }
    }
}