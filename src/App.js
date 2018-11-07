// Frameworks
import React, { Component } from 'react'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as AppActions from './actions/AppActions'
import { Route, Switch,  withRouter } from 'react-router-dom'

import styled from 'styled-components'

// Components
import AppNavbar from './components/AppNavbar'
import Welcome from './components/Welcome'
import SignTransaction from './components/SignTransaction'
import CollectCredentials from './components/CollectCredentials'
import RegisterYourApp from './components/RegisterYourApp'
import LogOut from './components/LogOut'
import SignClaim from './components/SignClaim'
import { uportConnect } from './utilities/uportSetup'

const AppWrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
`

const AppBody = styled.div`
  flex: 1 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  max-width: 100%;
  padding: 20px;
`

class App extends Component {
  constructor (props) {
    super(props)
    // Load existing state
    const resObj = {pushToken: uportConnect.pushToken, publicEncKey: uportConnect.publicEncKey, address: uportConnect.address, did: uportConnect.did, mnid: uportConnect.mnid}
    this.props.actions.connectUport(resObj)
    // TODO  if props.uport.did  then     this.props.history.push('/credentials ')
  }

  render () {
    return (
      <AppWrap>
        <AppNavbar />
        <AppBody>
          <Route exact path='/' component={Welcome}/>
          <Route path='/signclaim' component={SignClaim}/>
          <Route path='/transaction' component={SignTransaction}/>
          <Route path='/credentials' component={CollectCredentials}/>
          <Route path='/register' component={RegisterYourApp}/>
          <Route path='/logout' component={LogOut}/>
        </AppBody>
      </AppWrap>
    )
  }
}

const mapStateToProps = (state, props) => {
  return {
    uport: state.App.uport,
    signTransactionPage: state.App.signTransactionPage,
    collectCredentialsPage: state.App.collectCredentialsPage,
    registerYourAppPage: state.App.registerYourAppPage,
    logOutPage: state.App.logOutPage,
    signClaimPage: state.App.signClaimPage
  }
}
const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(AppActions, dispatch) }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App))
