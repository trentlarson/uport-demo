// Frameworks
import qs from 'qs'
import R from 'ramda'
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
const FullClaimButton = styled.button`
margin-right: 20px;
margin-top: 10px;
margin-bottom: 10px;
font-size: 12pt;
padding: 10px;
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
      confirmPublicUrls: undefined, // may be an object with DID keys and URL values
      errorMessage: "",
      fullClaimErrorMessage: "",
      fullClaimObj: null,
      loadingConfirmations: false,
      loadingFullClaimObj: false,
    }
  }

  retrieveForClaim() {
    if (this.state.claimId) {
      this.setState({claimObj: null, confirmIssuers: [], errorMessage: "", fullClaimObj: null, loadingConfirmations: true }, () =>
        fetch(process.env.REACT_APP_ENDORSER_CH_HOST_PORT + '/api/claim/' + this.state.claimId, {
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
          fetch(process.env.REACT_APP_ENDORSER_CH_HOST_PORT + '/api/report/issuersWhoClaimedOrConfirmed?claimId=' + this.state.claimId, {
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
              this.setState({ confirmIssuers: data.result, confirmPublicUrls: data.publicUrls, loadingConfirmations: false })
            })
            .catch(error => this.setState({errorMessage: error.message, loadingConfirmations: false}))
        })
        .catch(error => this.setState({errorMessage: error.message, loadingConfirmations: false}))
      )
    } else {
      this.setState({claimObj:{}})
    }
  }


  retrieveFullClaim() {
    if (this.state.claimId) {
      this.setState({loadingFullClaimObj: true }, () => {
        fetch(process.env.REACT_APP_ENDORSER_CH_HOST_PORT + '/api/claim/full/' + this.state.claimId, {
          headers: {
            "Content-Type": "application/json",
            "Uport-Push-Token": getUserToken(this.props)
          }})
        .then(response => {
          if (response.ok) {
            return response.json()
          } else {
            console.log("Error on /api/claim/full/" + this.state.claimId + " with response" , response)
            throw Error("Unable to access that full claim.")
          }
        })
        .then(data => {
          this.setState({ fullClaimObj: data, loadingFullClaimObj: false })
        })
        .catch(error => this.setState({fullClaimErrorMessage: error.message, loadingFullClaimObj: false}))
      })
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

        {
          this.state.claimId
          ? <h5>Confirmers</h5>
          : ""
        }

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
            .map(issuer =>
                 <li key={issuer}>{issuer}{isHiddenDid(issuer) ? "*" : ""}
                 {this.state.confirmPublicUrls && this.state.confirmPublicUrls[issuer]
                  ? <a href={this.state.confirmPublicUrls[issuer]}><span style={{'textDecoration': 'underline', 'color':'#8888FF'}}>&nbsp;- Public</span></a>
                  : ""
                 }
                 </li>)
        }
        </ul>
        <div>
        {
          R.any(isHiddenDid, this.state.confirmIssuers)
          ? "* You cannot see HIDDEN IDs because they're not in your network.  They must confirm one of your claims to be visible to you."
          : ""
        }
        </div>

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

      {
        !this.state.claimId
          ? ""
          : (!this.state.fullClaimObj
             ? <FullClaimButton onClick={() => this.retrieveFullClaim()}>
               Load Full Claim
             </FullClaimButton>
             : <div>
               Full Claim Data
               <JSONWrapper>
                 <JSONInput
                   id='fullClaim'
                   placeholder={ this.state.fullClaimObj ? this.state.fullClaimObj : [] }
                   height='400px'
                   width='590px'
                   style={{body: {'fontSize': '10pt', textAlign: 'left', flex: 1}}}
                   locale='en'
                   viewOnly='true'
                 />
               </JSONWrapper>
             </div>

          )
      }
      <div style={{'color':'#FF0000'}}>{ this.state.fullClaimErrorMessage }</div>

      <HashLoader
        color={'#FF0000'}
        loading={this.state.loadingFullClaimObj}
        size={30}
        sizeUnit={"px"}
      />

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
