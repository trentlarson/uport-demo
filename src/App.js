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
    this.props.actions.connectUport(uportConnect.state)
  }

  render () {
    return (
      <AppWrap>
        <AppNavbar />
        <AppBody>
          {
            !this.props.uport &&
            !this.props.signClaimPage
              ? <Welcome />
              : null
          }
          {
            this.props.signClaimPage === true &&
            !this.props.signTransactionPage
              ? <SignClaim />
              : null
          }
          {
            this.props.signTransactionPage === true &&
            !this.props.collectCredentialsPage
              ? <SignTransaction />
              : null
          }
          {
            this.props.collectCredentialsPage &&
            !this.props.registerYourAppPage
              ? <CollectCredentials />
              : null
          }
          {
            this.props.registerYourAppPage &&
            !this.props.logOutPage
              ? <RegisterYourApp />
              : null
          }
          {
            this.props.logOutPage
              ? <LogOut />
              : null
          }
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
