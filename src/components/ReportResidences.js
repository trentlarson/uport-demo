// Frameworks
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as AppActions from '../actions/AppActions'
import styled from 'styled-components'
import { firstAndLast3OfDid } from '../utilities/claims'
import { uportConnect } from '../utilities/uportSetup'
import { withRouter } from 'react-router-dom'
import GoogleApiWrapper from './GoogleApiWrapper'
import R from 'ramda'

const ConnectReqID = 'ConnectRequest'
const WelcomeWrap = styled.section``
const ConnectUport = styled.button``

const RightSection = styled.section`
float: right;
`

function tenureAndConfirmsDesc(tenureAndConfs) {
  let tenure = tenureAndConfs[0].tenure // since they're all the same
  return firstAndLast3OfDid(tenure.partyDid) + " confirmed by " + tenureAndConfs.length
}

class ReportResidences extends Component {

  constructor (props) {
    super(props)
    this.connectUport = this.connectUport.bind(this)
    uportConnect.onResponse(ConnectReqID).then(res => {
      console.log("res.payload",res.payload)
      this.props.actions.connectUport(uportConnect.state)
      this.props.history.push('/signclaim')
    })

    this.state = {
      claimsByClaimant: []
    }
  }

  connectUport () {
    const reqObj = { requested: ['name', 'phone', 'country'],
                     notifications: true }
    uportConnect.requestDisclosure(reqObj, ConnectReqID)
  }

  setResidenceInfo(tenuresAndConfirms) {
    let byTenureId = R.groupBy((item) => ""+item.tenure.id)(tenuresAndConfirms)
    this.setState({claimsByClaimant: byTenureId})
  }

  render () {
    return (
      <WelcomeWrap>
        <h4>Report Residences</h4>
        {
          this.props.uport && this.props.uport.name
            ? (
                <div style={{ height: '100%', width: '100%' }}>
                <div>
                  <RightSection>
                  <ul>
                {
                  R.keys(this.state.claimsByClaimant).length === 0 ? "" : "Claims:"
                }
                {
                  R.keys(this.state.claimsByClaimant).map((tenureId)=><li key={tenureId}>{
                    tenureAndConfirmsDesc(this.state.claimsByClaimant[tenureId])
                  }</li>)
                }
                  </ul>
                  </RightSection>
                </div>
                <div>
                <GoogleApiWrapper setClaimants={this.setResidenceInfo.bind(this)} pushToken={this.props.uport.pushToken}/>
                </div>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ReportResidences))
