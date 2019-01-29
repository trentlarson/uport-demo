// Frameworks
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import R from 'ramda'

import * as AppActions from '../actions/AppActions'
import styled from 'styled-components'
import { uportConnect } from '../utilities/uportSetup'
import { withRouter } from 'react-router-dom'


const WelcomeWrap = styled.section``

class ReportBestAttendance extends Component {

  constructor (props) {
    super(props)

    var subject = 'INVALID DID... ARE YOU NOT LOGGED IN?'
    if (uportConnect.did) {
      subject = uportConnect.did
    }

    this.state = {
      acacMap: [], // list of { "did:ethr:...":[{ "action":{"agentDid":"did:...", "event..."...}, "confirmations":{"issuer":"did:...", actionId:N} ] }
      subject: subject
    }
  }

  componentDidMount() {
    let url = 'http://localhost:3000/api/report/actionClaimsAndConfirmationsSince?dateTime=2018-12-29T08:00:00.000-07:00'
    fetch(url, {
      headers: {
        "Content-Type": "application/json"
      }})
      .then(response => response.json())
      .then(acacMap => {
        this.setState({ acacMap: acacMap })
      })
  }

  sortedClaims(acacMap) {
    let claimListWithCounts =
        Object.keys(acacMap)
        .map(did => {
          let meets = this.state.acacMap[did].length
          let confs = R.sum(this.state.acacMap[did].map(action => action.confirmations.length))
          return { meetingCount:meets, confirmCount:confs, did:did }
        })
    return R.sort((a,b) => b.meetingCount - a.meetingCount, claimListWithCounts)
  }

  render () {

    return (
      <WelcomeWrap>
        <h4>Best Attendance</h4>
        <h3>Recent Events</h3>
        {
          this.sortedClaims(this.state.acacMap)
            .map(claimWithCounts =>
                 {
                   return <div key={claimWithCounts.did}>
                     <span>{claimWithCounts.did} &nbsp;
                     - {claimWithCounts.meetingCount} meeting{claimWithCounts.meetingCount === 1 ? "" : "s"}, &nbsp;
                       {claimWithCounts.confirmCount} confirmation{claimWithCounts.confirmCount === 1 ? "" : "s"}</span>
                     </div>
                 }
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ReportBestAttendance))
