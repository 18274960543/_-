const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 时间格式化输出，如11天03小时25分钟19秒
const dateformat = micro_second => {
  var second = Math.floor(micro_second / 1000);
  var day = Math.floor(second / 3600 / 24);
  var hr = Math.floor(second / 3600 % 24);
  var min = Math.floor(second / 60 % 60);
  var sec = Math.floor(second % 60);
  // console.log('hr:', hr,'min:',min,'sec:',sec)
  return formatNumber(hr) + ":" + formatNumber(min) + ":" + formatNumber(sec);

  function formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  }
}

module.exports = {
  formatTime,
  dateformat
}
