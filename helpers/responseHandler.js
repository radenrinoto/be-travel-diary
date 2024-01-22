const responseSuccess = (res, status, statusMessage, data) => {
  return res.status(status).json({ status: statusMessage, data })
}

const responseError = (
  res,
  status = 500,
  statusMessage = 'Internal server error',
  message = "Something wen't wrong"
) => {
  return res.status(status).json({ status: statusMessage, message })
}

module.exports = { responseSuccess, responseError }
