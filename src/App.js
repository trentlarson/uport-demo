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
import SignTransaction from './components/SignTransaction'
import CollectCredentials from './components/CollectCredentials'
import RegisterYourApp from './components/RegisterYourApp'
import LogOut from './components/LogOut'
import SignClaim from './components/SignClaim'
import Test from './components/Test'
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
    this.props.actions.connectUport(uportConnect.state)
  }

  render () {
    return (
      <AppWrap>
        <AppNavbar testUserName={this.props.testUserName}/>
        <AppBody>
          <Route exact path='/' component={Welcome}/>
          <Route path='/signclaim' render={(props) => <SignClaim {...props} testUserDid={this.props.testUserDid}/>} />
          <Route path='/reportList' component={ReportList}/>
          <Route path='/reportClaims' component={ReportClaims}/>
          <Route path='/reportConfirms' component={ReportConfirms}/>
          <Route path='/reportBestAttendance' component={ReportBestAttendance}/>
          <Route path='/reportResidences' render={(props) => <ReportResidences {...props} testUserDid={this.props.testUserDid}/>} />
          <Route path='/reportSearch' component={ReportSearch}/>
          <Route path='/test' component={Test}/>
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
    signClaimPage: state.App.signClaimPage,
    //testUserDid: "did:ethr:0x00c9c2326c73f73380e8402b01de9defcff2b064", testUserName: "Duane's Friend Too",
    //testUserDid: "did:ethr:0x22c51a43844e44b59c112cf74f3f5797a057837a", testUserName: "Duane",
    //testUserDid: "did:ethr:0x332661e9e6af65eea6df253296a26257ff304647", testUserName: "Duane's Friend",
  }
}
const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(AppActions, dispatch) }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App))
