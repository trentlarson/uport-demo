// Frameworks
import qs from 'qs'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as AppActions from '../actions/AppActions'
import styled from 'styled-components'
import { getUserToken } from '../utilities/claimsTest'
import { withRouter } from 'react-router-dom'
import JSONInput from 'react-json-editor-ajrm'


const WelcomeWrap = styled.section``
const SubText = styled.p`
  margin: 0 auto 3em auto;
  font-size: 18px;
`
const JSONWrapper = styled.div`
  font-family: monospace !important
`

class ReportClaim extends Component {

  constructor (props) {
    super(props)

    var claimId = ""
    if (props.location.search) {
      // these are the request query parameters
      var params = qs.parse(props.location.search, {ignoreQueryPrefix:true})
      if (params && params.claimId) {
        claimId = params.claimId
      }
    }

    this.state = {
      claimId: claimId,
      claimObj: null,
      confirmIssuers: []
    }
  }

  retrieveForClaim() {
    if (this.state.claimId) {
      fetch('http://' + process.env.REACT_APP_ENDORSER_CH_HOST_PORT + '/api/claim/' + this.state.claimId, {
        headers: {
          "Content-Type": "application/json",
          "Uport-Push-Token": getUserToken(this.props)
        }})
        .then(response => {console.log("===== response", response); return response.json()})
        .then(data => {
          console.log("--------- setting claimObj to", data)
          this.setState({ claimObj: data })
        })
      fetch('http://' + process.env.REACT_APP_ENDORSER_CH_HOST_PORT + '/api/report/issuersWhoClaimedOrConfirmed?claimId=' + this.state.claimId, {
        headers: {
          "Content-Type": "application/json",
          "Uport-Push-Token": getUserToken(this.props)
        }})
        .then(response => response.json())
        .then(data => {
          this.setState({ confirmIssuers: data })
        })
    } else {
      this.setState({claimObj:{}})
    }
  }

  componentDidMount() {
    this.retrieveForClaim()
  }

  render () {

    return (
      <WelcomeWrap>
        <h4>Claim</h4>
        <SubText>Explore the content of a claim or confirmation</SubText>

      Claim ID &nbsp;
        <input type='text' style={{width: '400px'}} defaultValue={this.state.claimId} onChange={(value) => { this.setState({claimId:value}); this.retrieveForClaim(); }}/>

        <h5>Claim Details</h5>

        <JSONWrapper>
        <JSONInput
          id='claim'
          placeholder={ this.state.claimObj ? this.state.claimObj : [] }
          height='400px'
          width='590px'
          style={{body: {'fontSize': '10pt', textAlign: 'left', flex: 1}}}
          locale='en'
        />
        </JSONWrapper>

        <h5>Confirmers</h5>

        <ul>
        {
          this.state
            .confirmIssuers
            .map(issuer => <li key={issuer}>{issuer}</li>)
        }
        </ul>

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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ReportClaim))
