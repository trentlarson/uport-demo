// Frameworks
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as AppActions from './actions/AppActions'
import { Route, withRouter } from 'react-router-dom'
import styled from 'styled-components'

// Components
import AppNavbar from './components/AppNavbar'
import Welcome from './components/Welcome'
import ReportList from './components/ReportList'
import ReportClaims from './components/ReportClaims'
import ReportConfirms from './components/ReportConfirms'
import ReportBestAttendance from './components/ReportBestAttendance'
import ReportResidences from './components/ReportResidences'
import ReportSearch from './components/ReportSearch'
import LogOut from './components/LogOut'
import SignClaim from './components/SignClaim'
import Test from './components/Test'

import BvcVoteIgniteSpeakers from './components/bvc/VoteIgniteSpeakers'

import SignTransaction from './components/SignTransaction'
import CollectCredentials from './components/CollectCredentials'
import RegisterYourApp from './components/RegisterYourApp'

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

// from https://reactjs.org/docs/error-boundaries.html
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // You can also log the error to an error reporting service
    console.log("We in uport-demo are putting this in the console.log but nowhere else right now.", error, info);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went terribly wrong.</h1>;
    }

    return this.props.children;
  }
}

class App extends ErrorBoundary {

  constructor (props) {
    super(props)
    this.props.actions.connectUport(uportConnect.state)
  }

  render () {
    return (
      <AppWrap>
        <AppNavbar/>
        <AppBody>
          <Route exact path='/' component={Welcome}/>
          <Route path='/signclaim' component={SignClaim} />
          <Route path='/reportList' component={ReportList}/>
          <Route path='/reportClaims' component={ReportClaims}/>
          <Route path='/reportConfirms' component={ReportConfirms}/>
          <Route path='/reportBestAttendance' component={ReportBestAttendance}/>
          <Route path='/reportResidences' component={ReportResidences}/>
          <Route path='/reportSearch' component={ReportSearch}/>
          <Route path='/test' component={Test}/>
          <Route path='/logout' component={LogOut}/>

          <Route path='/bvc' component={BvcVoteIgniteSpeakers}/>

          <Route path='/transaction' component={SignTransaction}/>
          <Route path='/credentials' component={CollectCredentials}/>
          <Route path='/register' component={RegisterYourApp}/>
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
    signClaimPage: state.App.signClaimPage,
  }
}
const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(AppActions, dispatch) }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App))
