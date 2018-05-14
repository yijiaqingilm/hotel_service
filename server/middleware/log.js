import log4js from 'log4js'

log4js.configure({
  appenders: [
    {
      type: 'console',
      category: 'console'// 设置后控制台不输出信息，可删除这句
    }, {
      type: 'dateFile',
      filename: 'logs/log',
      pattern: '_yyyy-MM-dd.log',
      alwaysIncludePattern: true,     // 文件名是否始终包含占位符
      absolute: false,                // filename是否绝对路径
      category: 'dateFileLog'
    }
  ],
  replaceConsole: true,
  levels: {
    dateFileLog: 'INFO',     // 设置记录器的默认显示级别，低于这个级别的日志，不会输出。其他级别(trace、debug、warn、error、fatal)
  }
})
var dateFileLog = log4js.getLogger('dateFileLog')
