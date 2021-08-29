const loginPinRule = {
  mobile: { type: 'string', required: true },
  pin: { type: 'string', required: false, default: '000000' },
}

module.exports = {
  loginPinRule: loginPinRule,
}
