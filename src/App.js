// Frameworks
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as AppActions from './actions/AppActions'
import { Route, withRouter } from 'react-router-dom'
import styled from 'styled-components'

// Components
import AgreeAction from './components/AgreeAction'
import AppNavbar from './components/AppNavbar'
import Documentation from './components/Documentation'
import DocTransactions from './components/DocTransactions'
import LogOut from './components/LogOut'
import PrivacyPolicy from './components/PrivacyPolicy'
import PublicReportList from './components/PublicReportList'
import ReportList from './components/ReportList'
import ReportClaim from './components/ReportClaim'
import ReportClaims from './components/ReportClaims'
import ReportConfirms from './components/ReportConfirms'
import ReportBestAttendance from './components/ReportBestAttendance'
import ReportResidences from './components/ReportResidences'
import ReportSearch from './components/ReportSearch'
import SignClaim from './components/SignClaim'
import Test from './components/Test'
import Welcome from './components/Welcome'

import BvcIndex from './components/bvc/Index'
import BvcVoteIgniteSpeakers from './components/bvc/VoteIgniteSpeakers'
import BvcAttendedFirearmTraining from './components/bvc/AttendedFirearmTraining'
import BvcAttendedSaturdayMorning from './components/bvc/AttendedSaturdayMorning'

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
    this.setState({hasError: true})
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
      this.state.hasError
      ?
        <h1>Something went terribly wrong. <br/> Notify someone with this project to let them know what you were trying to do.</h1>
      :
      <AppWrap>
        <AppNavbar/>
        <AppBody>
          <Route exact path='/' component={Welcome}/>

          <Route path='/docs' component={Documentation}/>
          <Route path='/doc-transactions' component={DocTransactions}/>
          <Route path='/privacy-policy' component={PrivacyPolicy}/>
          <Route path='/privacyPolicy' component={PrivacyPolicy}/>

          <Route path='/agreeAction' component={AgreeAction} />
          <Route path='/signClaim' component={SignClaim} />
          <Route path='/reportList' component={ReportList}/>
          <Route path='/publicReportList' component={PublicReportList}/>
          <Route path='/reportClaim' component={ReportClaim}/>
          <Route path='/reportClaims' component={ReportClaims}/>
          <Route path='/reportConfirms' component={ReportConfirms}/>
          <Route path='/reportBestAttendance' component={ReportBestAttendance}/>
          <Route path='/reportResidences' component={ReportResidences}/>
          <Route path='/reportSearch' component={ReportSearch}/>
          <Route path='/test' component={Test}/>
          <Route path='/logout' component={LogOut}/>

          <Route path='/bvc/index' component={BvcIndex}/>
          <Route path='/bvc/voteIgnite' component={BvcVoteIgniteSpeakers}/>
          <Route path='/bvc/attendedSat' component={BvcAttendedSaturdayMorning}/>
          <Route path='/bvc/attendedFirearm' component={BvcAttendedFirearmTraining}/>
          <Route path='/tasks' render={() => window.location = "https://raw.githubusercontent.com/trentlarson/endorser-ch/master/tasks.yml"}/>

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
