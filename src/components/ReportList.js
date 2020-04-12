// Frameworks
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as AppActions from '../actions/AppActions'
import styled from 'styled-components'
import { uportConnect } from '../utilities/uportSetup'
import { withRouter, Link } from 'react-router-dom'


const ConnectReqID = 'ConnectRequest'
const WelcomeWrap = styled.section``
const ConnectUport = styled.button``
const NextButton = styled.button`
  margin-top: 20px;
`
const LeftSection = styled.section`
  float: left;
`
const RightSection = styled.section`
  float: right;
`

class ReportList extends Component {

  constructor (props) {
    super(props)
    this.connectUport = this.connectUport.bind(this)

    uportConnect.onResponse(ConnectReqID).then(res => {
      console.log("res.payload")
      console.log(res.payload)
      this.props.actions.connectUport(uportConnect.state)
      this.props.history.push('/signClaim')
    })
  }

  connectUport () {
    const reqObj = { requested: ['name', 'phone', 'country'],
                     notifications: true }
    uportConnect.requestDisclosure(reqObj, ConnectReqID)
  }

  render () {
    return (
      <WelcomeWrap>
        <h4>Reports</h4>
        {
          this.props.uport && this.props.uport.name
            ? (<div>

               <LeftSection>
               <Link to="/reportBestAttendance">
               <NextButton>Best Attendance</NextButton>
               </Link>
               <br/>
               <Link to="/reportConfirms">
               <NextButton>Meeting Confirmations</NextButton>
               </Link>
               <br/>
               <Link to="/reportClaims">
               <NextButton>Your Previous Claims / Confirmations</NextButton>
               </Link>
               </LeftSection>

               <Link to="/reportResidences">
               <NextButton>Residences</NextButton>
               </Link>

               <RightSection>
               <Link to="/reportSearch">
               <NextButton>Search</NextButton>
               </Link>
               </RightSection>
               </div>
            )
            : (
              <ConnectUport onClick={this.connectUport}>
                Connect with uPort
              </ConnectUport>
            )
        }
      </WelcomeWrap>
    )
  }
}

const mapStateToProps = (state, props) => {
  return {
    uport: state.App.uport
  }
}
const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(AppActions, dispatch) }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ReportList))
