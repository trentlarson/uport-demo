// Frameworks
import React, { Component } from 'react'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as AppActions from './actions/AppActions'

import styled from 'styled-components'

// Components
import AppNavbar from './components/AppNavbar'
import Welcome from './components/Welcome'
import SignTransaction from './components/SignTransaction'
import CollectCredentials from './components/CollectCredentials'
import RegisterYourApp from './components/RegisterYourApp'
import LogOut from './components/LogOut'

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
`

class App extends Component {
  render () {
    return (
      <AppWrap>
        <AppNavbar />
        <AppBody>
          {
            !this.props.uport &&
            !this.props.signTransaction
              ? <Welcome />
              : null
          }
          {
            this.props.signTransaction &&
            !this.props.collectCredentials
              ? <SignTransaction />
              : null
          }
          {
            this.props.collectCredentials &&
            !this.props.registerYourApp
              ? <CollectCredentials />
              : null
          }
          {
            this.props.registerYourApp &&
            !this.props.logOut
              ? <RegisterYourApp />
              : null
          }
          {
            this.props.logOut
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
    signTransaction: state.App.signTransaction,
    collectCredentials: state.App.collectCredentials,
    registerYourApp: state.App.registerYourApp,
    logOut: state.App.logOut
  }
}
const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(AppActions, dispatch) }
}
export default connect(mapStateToProps, mapDispatchToProps)(App)
