const config = {
  username: '__morse',
  password: 'remorse_',
  email: '',
  loginUrl: 'https://www.betfair.it/sport',
  tennisUrl: 'https://www.betfair.it/sport/tennis'
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



export  {
  config,
  selectors,
}
