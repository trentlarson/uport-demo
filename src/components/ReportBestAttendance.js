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
const SubText = styled.p`
  margin: 0 auto 3em auto;
  font-size: 18px;
`

class ReportBestAttendance extends Component {

  constructor (props) {
    super(props)

    var subject = 'INVALID DID... ARE YOU NOT LOGGED IN?'
    if (uportConnect.did) {
      subject = uportConnect.did
    }

    this.state = {
      acacMap: [],
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

  render () {

    return (
      <WelcomeWrap>
        <h4>Event Reports</h4>
        <SubText>See stats on recent events</SubText>
        <h3>Recent Events</h3>
        {
          Object.keys(this.state.acacMap)
            .map(did =>
                 {
                   let meets = this.state.acacMap[did].length
                   let confs = R.sum(this.state.acacMap[did].map(action => action.confirmations.length))
                   return <div key={did}>
                     <span>{did} &nbsp;
                     - {meets} meeting{meets === 1 ? "" : "s"}, &nbsp;
                       {confs} confirmation{confs === 1 ? "" : "s"}</span>
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
