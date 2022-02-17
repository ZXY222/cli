const chalk = require('chalk')

function Tips(result, name) {
    if (result === false) {
        chalk.hex('#db041d').bold('项目创建失败')
        return
    }
    // 创建完成提示
    console.log(`\r\n项目创建成功 ${chalk.cyan(name)}`)
    console.log(`\r\n  cd ${chalk.cyan(name)}`)
    console.log('  npm install\r\n')
    console.log('  npm run dev\r\n')
}

module.exports = {
    Tips
}