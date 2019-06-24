// Frameworks
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import R from 'ramda'
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'

import * as AppActions from '../actions/AppActions'
import { firstAndLast3OfDid } from '../utilities/claims'
import { getUserToken } from '../utilities/claimsTest'

const WelcomeWrap = styled.section``

class ReportBestAttendance extends Component {

  constructor (props) {
    super(props)

    this.state = {
      acacList: [] // list of { "did": "did:ethr:...", "actions": [{ "action":{"agentDid":"did:...", "event..."...}, "confirmations":{"issuer":"did:...", actionId:N} ] }
    }
  }

  componentDidMount() {
    let url = 'http://' + process.env.REACT_APP_ENDORSER_CH_HOST_PORT + '/api/report/actionClaimsAndConfirmationsSince?dateTime=2018-12-29T08:00:00.000-07:00'
    fetch(url, {
      headers: {
        "Content-Type": "application/json",
        "Uport-Push-Token": getUserToken(this.props)
      }})
      .then(response => {
        if (response.status === 200) {
          return response.json()
        } else {
          console.log("Got ACAC response status", response.status, "and content", response)
          response.json()
            .then(result => console.log("... and that ACAC response parses as:", result)) // helpful on that DID method error
            .catch(err => console.log("... and that ACAC response fails to parse as json because:", err))
          throw Error("There's a bad status, so watch for the result of parsing the ACAC.")
        }
      })
      .then(acacList => {
        this.setState({ acacList: acacList })
      })
      .catch(err => {
        console.log("Error retrieving action claims & confirmations list:", err)
      })
  }

  sortedClaims() {
    let claimListWithCounts =
        this.state.acacList
        .map(didAndActions => {
          let meets = didAndActions.actions.length
          let confs = R.sum(didAndActions.actions.map(acac => acac.confirmations.length))
          return { meetingCount:meets, confirmCount:confs, did:didAndActions.did }
        })
    return R.sort((a,b) => b.meetingCount - a.meetingCount, claimListWithCounts)
  }

  render () {

    return (
      <WelcomeWrap>
        <h4>Best Attendance</h4>
        <h3>Recent Events</h3>
        {
          this.sortedClaims()
            .map((claimWithCounts, index) =>
                 {
                   return <div key={index}>
                     <span>{firstAndLast3OfDid(claimWithCounts.did)} &nbsp;
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
