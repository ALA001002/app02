import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
dayjs.extend(duration)

// 倒计时时间
export const timeToEndDate = (
  startDate = '',
  // startDate = '2022-06-18',
  endDate = '2022-04-01',
  format = 'YYYY-MM-DD',
  formatStr = 'DD天HH时mm分ss秒'
) => {
  const duration = dayjs(startDate, format) - Date.now()
  if (duration > 0) {
    console.log()
    return dayjs.duration(duration).format(formatStr)
  } else if (dayjs(endDate, format) - Date.now() > 0) {
    return dayjs.duration(dayjs(endDate) - Date.now()).format(formatStr)
  } else {
    return null
  }
}
// 倒计时时间
export const formatter = (time)=>{
  return dayjs(time).format('YYYY-MM-DD')
}

// 开始状态
export const startStatus = (
  startDate = '2021-06-18',
  endDate = '2021-06-21',
  format = 'YYYY-MM-DD'
) => {
  const duration = dayjs(startDate, format) - Date.now()
  if (duration > 0) {
    return 'notStart'
  } else if (dayjs(endDate, format) - Date.now() > 0) {
    return 'start'
  } else {
    return 'end'
  }
}

// 小时倒计时 并且 带状态
export const countdownStatus = (
  startDate = '2021-06-18',
  endDate = '2021-06-21',
  formatStr
) => {
  const duration = dayjs(startDate) - Date.now()
  if (duration > 0) {
    return dayjs.duration(duration).format(formatStr) + ' 后开始'
  } else if (dayjs(endDate) - Date.now() > 0) {
    return '立即参与'
  } else {
    return ''
  }
}
