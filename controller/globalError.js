const resErrorDev = (err, res) => {
  console.error(err)
  res.status(err.statusCode).json({
    status: 'error',
    message: err.message,
    errors: err.errors,
    error: {
      name: err.name,
      message: err.message,
      ...err,
    },
    stack: err.stack,
  })
}
const resErrorPro = (err, res) => {
  if (err.isOperational) {
    console.error(err)
    res.status(err.statusCode).json({
      status: 'error',
      message: err.message, // 給使用者看的錯誤訊息
      errors: err.errors, // 如果需要客製化多筆 errors
    })
  } else {
    console.log('出事了阿伯，這錯誤從哪邊出來的啊')
    console.error(err)
    res.status(500).json({
      status: 'error',
      message: '系統錯誤，請洽管理員', // 給使用者看的錯誤訊息
      error: err.message, // 偷偷給工程師看的錯誤訊息
    })
  }
}

export default (err, req, res, next) => {
  err.statusCode = err.statusCode || 500
  const isDev = process.env.NODE_ENV === 'development'

  if (isDev) {
    return resErrorDev(err, res)
  }

  console.error('err.name', err.name)

  // jwt
  if (err.name === 'TokenExpiredError') {
    err.message = '為了資訊安全，網站會定期將使用者登出。請重新登入'
    err.isOperational = true
    return resErrorPro(err, res)
  }

  // mongoose
  if (err.name === 'CastError') {
    err.message = '資料ID格式錯誤'
    err.isOperational = true
    return resErrorPro(err, res)
  }
  if (err.name === 'ValidationError') {
    err.message = '資料欄位未填寫正確'
    err.isOperational = true
    return resErrorPro(err, res)
  }

  return resErrorPro(err, res)
}
