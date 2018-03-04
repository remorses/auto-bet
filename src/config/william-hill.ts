const config = {
  username: '__morse',
  password: 'remorse_',
  email: '',
  loginUrl: 'http://sports.williamhill.it/bet_ita/it',
  tennisUrl: 'http://sports.williamhill.it/bet_ita/it/betting/y/17/mh/Tennis.html'
}

const selectors = {
  usernameField: '#tmp_username_div',
  passwordField: '#tmp_pwd_div',
  submitLogin: "#signInBtnHolder",
  goToTennis: 'a#tennis',
  tennisTables: 'div#_sport_0_types > div',
  tennisTable: '',
  tennisChampionName: ''
}



module.exports = {
  config,
  selectors,
}
