// Frameworks
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as AppActions from '../actions/AppActions'
import styled from 'styled-components'
import { uportConnect } from '../utilities/uportSetup'
import { withRouter } from 'react-router-dom'
import R from 'ramda'
import GoogleApiWrapper from './GoogleApiWrapper';

const ConnectReqID = 'ConnectRequest'
const WelcomeWrap = styled.section``
const ConnectUport = styled.button``

const RightSection = styled.section`
float: right;
`

class ReportResidences extends Component {

  constructor (props) {
    super(props)
    this.connectUport = this.connectUport.bind(this)
    uportConnect.onResponse(ConnectReqID).then(res => {
      console.log("res.payload")
      console.log(res.payload)
      this.props.actions.connectUport(uportConnect.state)
      this.props.history.push('/signclaim')
    })

    this.state = {
      claimants: []
    }
  }

  connectUport () {
    const reqObj = { requested: ['name', 'phone', 'country'],
                     notifications: true }
    uportConnect.requestDisclosure(reqObj, ConnectReqID)
  }

  setResidenceInfo(someInfo) {
    this.setState({claimants: someInfo})
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
                  this.state.claimants.length === 0 ? "" : "Claims:"
                }
                {
                  this.state.claimants.map((id)=><li key={id}>{id}</li>)
                }
                  </ul>
                  </RightSection>
                </div>
                <div>
                  <GoogleApiWrapper setClaimants={this.setResidenceInfo.bind(this)}/>
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
