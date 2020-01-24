// Frameworks
import qs from 'qs'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { HashLoader } from 'react-spinners'
import { bindActionCreators } from 'redux'

import * as AppActions from '../actions/AppActions'
import styled from 'styled-components'
import { isHiddenDid } from '../utilities/claims'
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
      confirmIssuers: [],
      errorMessage: "",
      loadingConfirmations: false
    }
  }

  retrieveForClaim() {
    if (this.state.claimId) {
      this.setState({claimObj: null, confirmIssuers: [], errorMessage: "", loadingConfirmations: true }, () =>
        fetch('http://' + process.env.REACT_APP_ENDORSER_CH_HOST_PORT + '/api/claim/' + this.state.claimId, {
          headers: {
            "Content-Type": "application/json",
            "Uport-Push-Token": getUserToken(this.props)
          }})
        .then(response => {
          if (response.ok) {
            return response.json()
          } else {
            console.log("Error on /api/claim/" + this.state.claimId + " with response" , response)
            throw Error("Unable to access that claim.")
          }
        })
        .then(data => {
          this.setState({ claimObj: data })
        })
        .then(() => {
          fetch('http://' + process.env.REACT_APP_ENDORSER_CH_HOST_PORT + '/api/report/issuersWhoClaimedOrConfirmed?claimId=' + this.state.claimId, {
            headers: {
              "Content-Type": "application/json",
              "Uport-Push-Token": getUserToken(this.props)
            }})
            .then(response => {
              if (response.ok) {
                return response.json()
              } else {
                console.log("Error on /api/report/issuersWhoClaimedOrConfirmed?claimId=" + this.state.claimId + " with response" , response)
                throw Error("Unable to access confirmations for that claim.")
              }
            })
            .then(data => {
              this.setState({ confirmIssuers: data, loadingConfirmations: false })
            })
            .catch(error => this.setState({errorMessage: error.message, loadingConfirmations: false}))
        })
        .catch(error => this.setState({errorMessage: error.message, loadingConfirmations: false}))
      )
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
        <input type='text' style={{width: '400px'}} defaultValue={this.state.claimId} onChange={(evt) => { this.setState({claimId:evt.target.value}, () => this.retrieveForClaim()) }}/>

        <br/>
        <br/>
        <div style={{'color':'#FF0000'}}>{ this.state.errorMessage }</div>

        <h5>Confirmers</h5>

        <div style={{'marginLeft':'auto','marginRight':'auto','width':'2em'}}>
        <HashLoader
          color={'#FF0000'}
          loading={this.state.loadingConfirmations}
          size={30}
          sizeUnit={"px"}
        />
        </div>
        <ul>
        {
          this.state
            .confirmIssuers
            .map(issuer => <li key={issuer}>{issuer}{isHiddenDid(issuer) ? "*" : ""}</li>)
        }
        </ul>

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
