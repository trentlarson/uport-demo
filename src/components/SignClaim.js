// Frameworks
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as AppActions from '../actions/AppActions'
import styled from 'styled-components'
import { uportConnect } from '../utilities/uportSetup'
import { claimDescription } from '../utilities/claims.js'
import { verifyJWT } from 'did-jwt'
import JSONInput from 'react-json-editor-ajrm'
import { withRouter } from 'react-router-dom'
import { DateTime } from 'luxon'
import R from 'ramda'


const ACTION = "Action"
const TENURE = "Tenure"
const SignReqID = 'SignRequest'
const WelcomeWrap = styled.section``

const JSONWrapper = styled.div`
  font-family: monospace !important
`
const ConnectUport = styled.button`
  background-color: #4C8F50;
`
const MoreLink = styled.a`
  text-color: #FFFFFF;
`
const ClaimButton = styled.button`
  margin-right: 20px;
  margin-top: 10px;
  margin-bottom: 10px;
  font-size: 12pt;
  padding: 10px;
`

const DEFAULT_GEO_SHAPE = "40.883944,-111.884787 40.884088,-111.884787 40.884088,-111.884515 40.883944,-111.884515 40.883944,-111.884787"

const DEFAULT_ORG_NAME = "Bountiful Voluntaryist Community"
const DEFAULT_EVENT_NAME = "Saturday Morning Meeting"

const TODAY_START_TIME_STRING = DateTime.local().set({hour:0}).startOf("day").toISO()

function confirmClaim(claims) {
  return {
    "@context": "http://endorser.ch",
    "@type": "Confirmation",
    "originalClaims": claims
  }
}

function objectifyClaimArray(type, claims) {
  var result = {}
  for (var claim of claims) {
    result[type + ":" + claim.id] = claim
  }
  return result
}

function imgPerConfirm(num) {
  var result = []
  for (var i = 0; i < num; i++) {
    result.push(<img src="/green-check.png" key={i} alt="selected"/>)
  }
  return result
}

class SignClaim extends Component {

  constructor (props) {
    super(props)
    this.state = {
      responseJWT: '',
      responseJSON: null,
      claimStoredResponse: '',
      unsignedClaim: this.joinActionClaim(),
      // For the type of claimsToConfirm, see no-parameter result from: http://localhost:3000/api/action/
      // ... with API doc: http://localhost:3000/api-docs#/action/get_api_action_
      // but where the array is turned into an object with keys of the "type:id" of each claim type & ID.
      claimsToConfirm: {},
      loadedMore: false
    }
    this.signClaim = this.signClaim.bind(this)
    this.handleSignedClaim = this.handleSignedClaim.bind(this)

    uportConnect.onResponse(SignReqID)
      .then(this.handleSignedClaim)
      .catch(error => {
        this.setState({responseJWT: error})
      })

  }

  joinActionClaim(eventOrgName, eventName, eventStartDate, agentDid) {
    if (!eventOrgName) {
      eventOrgName = DEFAULT_ORG_NAME
    }
    if (!eventName) {
      eventName = DEFAULT_EVENT_NAME
    }
    if (!eventStartDate) {
      eventStartDate = DateTime.local().set({hour:8}).startOf("hour").toISO()
    }
    if (!agentDid) {
      agentDid = uportConnect.did
    }
    return {
      "@context": "http://schema.org",
      "@type": "JoinAction",
      // note that there is constructor code below that sets "did" inside "agent"
      "agent": { "did": agentDid },
      "event": {
        "organizer": { "name": eventOrgName },
        "name": eventName,
        "startTime": eventStartDate
      }
    }
  }

  ownershipClaim(agentDid, polygon) {
    if (!polygon) {
      polygon = DEFAULT_GEO_SHAPE
    }
    let result = {
      "@context": "http://endorser.ch",
      "@type": "Tenure",
      "spatialUnit": {
        "geo": {
          "@type": "GeoShape",
          "polygon": polygon
        }
      }
    }
    if (agentDid) {
      result.party = { "did": agentDid }
    } else if (uportConnect.did) {
      result.party = { "did": uportConnect.did }
    }
    return result
  }

  componentDidMount() {
    fetch('http://' + process.env.REACT_APP_ENDORSER_CH_HOST_PORT + '/api/action/?eventStartTime_greaterThanOrEqualTo=' + TODAY_START_TIME_STRING, {
      headers: {
        "Content-Type": "application/json",
        "Uport-Push-Token": this.props.uport.pushToken
      }})
      .then(response => response.json())
      .then(data => this.setState({ claimsToConfirm: objectifyClaimArray(ACTION, data) }))
  }

  handleSignedClaim(res) {
    //console.log(res) // format: { id: "SignRequest", payload: "...", data: undefined }
    verifyJWT(res.payload).then(json => {

      // json format: https://github.com/uport-project/did-jwt/blob/288b8a57b44706036ad440c1e0ea7dde06365810/src/JWT.js#L103
      // { "payload":{"iat":1547430185,"exp":1547516585,"sub":"did:ethr:...","claim":{...},"iss":"did:ethr:..."},
      //   "doc":{"@context":"https://w3id.org/did/v1","id":"did:ethr:...","publicKey":[{"id":"did:ethr:...#owner","type":"Secp256k1VerificationKey2018","owner":"did:ethr:...","ethereumAddress":"..."}],"authentication":[{"type":"Secp256k1SignatureAuthentication2018","publicKey":"did:ethr:...#owner"}]},
      //    "issuer":"did:ethr:...",
      //    "signer":{"id":"did:ethr:...#owner","type":"Secp256k1VerificationKey2018","owner":"did:ethr:...","ethereumAddress":"..."},"jwt":"..."}
      //console.log('json', JSON.stringify(json))

      this.setState({
        responseJWT: res.payload,
        responseJSON: json.payload
      })
      fetch('http://' + process.env.REACT_APP_ENDORSER_CH_HOST_PORT + '/api/claim', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Uport-Push-Token": this.props.uport.pushToken
        },
        body: JSON.stringify({jwtEncoded:res.payload})})
        .then(response => response.json())
        .then(data => this.setState({ claimStoredResponse: "Saved with ID " + data }))
    })
    .catch(window.alert)

  }

  signClaim () {
    this.setState({responseJWT: ''})
    const claimToSign = this.state.unsignedClaim
    uportConnect.requestVerificationSignature(claimToSign, uportConnect.did, SignReqID)
  }

  render () {

    const claimButtons = <div>
      {
        Object.keys(this.state.claimsToConfirm)
          .map(claimId => {
            if (!this.state.unsignedClaim.originalClaims) {
              return <span key={claimId}></span>
            } else {
              let apiClaim = this.state.claimsToConfirm[claimId]
              var originalClaim = undefined
              if (claimId.startsWith(ACTION)) {
                originalClaim = this.joinActionClaim(apiClaim.eventOrgName, apiClaim.eventName, apiClaim.eventStartTime, apiClaim.agentDid)
              } else if (claimId.startsWith(TENURE)) {
                originalClaim = this.ownershipClaim(apiClaim.partyDid, apiClaim.polygon)
              } else {
                console.log("Unknown claim type of " + claimId + " won't be added to confirmations.")
              }
              if (!originalClaim) {
                return ""
              } else {
                return <span key={claimId}>
                  <ClaimButton onClick={() => {

                    // add this claim to the confirmation
                    // (Weird: without this clone it doesn't update in the setState, even though it does inside the old "fetch")
                    var newConfirm = JSON.parse(JSON.stringify(this.state.unsignedClaim))
                    this.setState({ unsignedClaim: {} })
                    newConfirm.originalClaims.push(originalClaim)

                    // remove this claim from the buttons
                    var newClaims = this.state.claimsToConfirm
                    delete newClaims[claimId]

                    // now set the state
                    this.setState({ unsignedClaim: newConfirm, claimsToConfirm: newClaims })

                  }}>
                  {claimId.substring(0, claimId.indexOf(":"))}<br/>
                  {claimDescription(originalClaim)}
                  </ClaimButton>
                  </span>

              }
            }
          })
          .reverse()
      }
      {
        (this.state.unsignedClaim.originalClaims && !this.state.loadedMore)
          ?
          <MoreLink href="#" onClick={()=>{
            fetch('http://' + process.env.REACT_APP_ENDORSER_CH_HOST_PORT + '/api/action/?eventStartTime_lessThan=' + TODAY_START_TIME_STRING, {
              headers: {
                "Content-Type": "application/json",
                "Uport-Push-Token": this.props.uport.pushToken
              }})
              .then(response => response.json())
              .then(data => {
                let newClaims = R.merge(this.state.claimsToConfirm, objectifyClaimArray(ACTION, data))
                this.setState({ claimsToConfirm: newClaims, loadedMore: true })
              })
          }}>Load More</MoreLink>
          :
          <span/>
      }
    </div>

    return (
        <WelcomeWrap>
        <h4>Claim to Sign</h4>
        <div style={{display: 'flex', flex: 1, flexDirection: 'column', justifyContent: 'center', textAlign: 'left', marginBottom: '20px'}}>
        <div style={{marginRight: '20px'}}>

        <h3>Sample Claims</h3>

        <div style={{'textAlign':'right'}}><span>{this.state.claimStoredResponse}</span></div>


        {/* Attendance */}
        <input type="radio" name="claimType" onClick={()=>{
          this.setState({unsignedClaim: null})
          this.setState({unsignedClaim: this.joinActionClaim()})
        }}/> Set to Join Action

        <span>{ this.state.unsignedClaim['@type'] === 'JoinAction' ? <img src='/green-check.png' alt="selected"/> : "" }</span>
        <br/>


        {/* Land Tenure */}
        <input type="radio" name="claimType" onClick={()=>{
          this.setState({unsignedClaim: null})
          this.setState({unsignedClaim: this.ownershipClaim()})
        }}/> Set to Plot Ownership

        <span>{ this.state.unsignedClaim['@type'] === 'Tenure' ? <img src='/green-check.png' alt="selected"/> : "" }</span>
        <br/>


        {/* Confirmations */}
        <input type="radio" name="claimType" onClick={()=>{
          this.setState({unsignedClaim: null})
          this.setState({unsignedClaim: confirmClaim([])})
        }}/> Set to Confirmation...

        <span>{
          this.state.unsignedClaim['@type'] === 'Confirmation' 
            ? imgPerConfirm(this.state.unsignedClaim.originalClaims.length)
            : ""
        }</span>
        <br/>
        <br/>

        <span>{claimButtons}</span>

          <div style={{textAlign: 'center'}}>
            <ConnectUport onClick={this.signClaim}>
              Sign Claim
            </ConnectUport>
          </div>

          <br/>
          <br/>
          <br/>

          <h3>Claim Details</h3>

          <JSONWrapper>
            <JSONInput
                id='request'
                placeholder={ this.state.unsignedClaim }
                height='400px'
                width='590px'
                onChange={(value) => {
                  if (value.jsObject !== undefined) {
                    this.setState({unsignedClaim: value.jsObject})
                  }
                }}
                style={{body: {'fontSize': '10pt', textAlign: 'left', flex: 1}}}
             locale='en'
            />
          </JSONWrapper>

          </div>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>

        <div>
           <h3>Response (JWT)</h3>
           <input type='text' style={{width: '590px'}} value={this.state.responseJWT}/>
           <h3>Signed Claim Response (Parsed JWT)</h3>
           <JSONWrapper>
           <JSONInput
                id='response'
                placeholder={ this.state.responseJSON }
                height='320px'
                width='590px'
                viewOnly
                style={{body: {'fontSize': '10pt', textAlign: 'left'}}}
                locale='en'
           />
           </JSONWrapper>
        </div>
        </div>
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
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SignClaim))
