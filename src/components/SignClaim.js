// Frameworks
import { verifyJWT } from 'did-jwt'
import { DateTime } from 'luxon'
import R from 'ramda'
import React from 'react'
import JSONInput from 'react-json-editor-ajrm'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { HashLoader } from 'react-spinners';
import { bindActionCreators } from 'redux'
import styled from 'styled-components'

import ErrorHandlingComponent from './ErrorHandlingComponent'
import * as AppActions from '../actions/AppActions'
import { claimDescription } from '../utilities/claims'
import { getUserDid, getUserToken } from '../utilities/claimsTest'
import { uportConnect } from '../utilities/uportSetup'



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




// 40.883944,-111.884787 is southwest corner of Corner Bakery
const DEFAULT_GEO_SHAPE = "40.883944,-111.884787 40.884088,-111.884787 40.884088,-111.884515 40.883944,-111.884515 40.883944,-111.884787"

const DEFAULT_ORG_NAME = "Bountiful Voluntaryist Community"
const DEFAULT_EVENT_NAME = "Saturday Morning Meeting"
const DEFAULT_ROLE_NAME = "Secretary"

const TODAY_START_TIME_STRING = DateTime.local().set({hour:0}).startOf("day").toISO()
const THIS_YEAR_START_DATE_STRING = DateTime.local().startOf('year').toISODate()
const THIS_YEAR_END_DATE_STRING = DateTime.local().endOf('year').toISODate()

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

class SignClaim extends ErrorHandlingComponent {

  constructor (props) {
    super(props)
    this.state = {
      claimStoredResponse: '',
      loading: false,
      responseJWT: '',
      responseJSON: null,
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
    agentDid = getUserDid() || agentDid
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

  orgRoleClaim(agentDid, orgName, roleName, startDate, endDate) {
    if (!orgName) {
      orgName = DEFAULT_ORG_NAME
    }
    if (!roleName) {
      roleName = DEFAULT_ROLE_NAME
    }
    if (!startDate) {
      startDate = THIS_YEAR_START_DATE_STRING
    }
    if (!endDate) {
      endDate = THIS_YEAR_END_DATE_STRING
    }
    agentDid = getUserDid() || agentDid
    if (!agentDid) {
      agentDid = uportConnect.did
    }
    let result = {
      "@context": "http://schema.org",
      "@type": "Organization",
      name: orgName,
      member: {
        "@type": "OrganizationRole",
        member: {
          "@type": "Person",
          identifier: agentDid,
        },
        roleName: roleName,
        startDate: startDate,
        endDate: endDate,
      }
    }
    return result
  }

  getSubject(claim) {
    var subject
    switch (claim['@type']) {
      case 'JoinAction': subject = claim.agent && claim.agent.did; break;
      case 'Organization': subject = claim.member && claim.member.member && claim.member.member.identifier; break;
      case 'Tenure': subject = claim.party && claim.party.did; break;
      case 'Confirmation':
        var subjects = R.uniq(R.map(this.getSubject)(claim.originalClaims))
        if (subjects.length === 1) {
          subject = subjects[0]
        }
        break;
      default:
    }
    return subject
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
    // These settings are a bit different because it's possible that they give no owner ID.
    if (getUserDid()) {
      result.party = { "did": getUserDid() }
    } else if (agentDid) {
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
        "Uport-Push-Token": getUserToken(this.props)
      }})
      .then(response => response.json())
      .then(data => this.setState({ claimsToConfirm: objectifyClaimArray(ACTION, data) }))
  }

  handleSignedClaim(res) {
    //console.log(res) // format: { id: "SignRequest", payload: "...", data: undefined }
    this.setState({loading: true})

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
          "Uport-Push-Token": getUserToken(this.props)
        },
        body: JSON.stringify({jwtEncoded:res.payload})})
        .then(this.alertOrReturnJson("saving signed claim"))
        .then(data => this.setState({ loading: false, claimStoredResponse: "Saved with ID " + data }))
        .catch(err => this.setState({ loading: false }))
    })
    .catch(window.alert)

  }

  signClaim () {
    this.setState({responseJWT: ''})
    let claimToSign = this.state.unsignedClaim
    var subject = this.getSubject(claimToSign) || ''
    uportConnect.requestVerificationSignature(claimToSign, subject, SignReqID)
  }

  render () {

    const confirmClaimButtons = <div>
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
      }
      {
        (this.state.unsignedClaim.originalClaims && !this.state.loadedMore)
          ?
          <MoreLink href="#" onClick={()=>{
            fetch('http://' + process.env.REACT_APP_ENDORSER_CH_HOST_PORT + '/api/action/?eventStartTime_lessThan=' + TODAY_START_TIME_STRING, {
              headers: {
                "Content-Type": "application/json",
                "Uport-Push-Token": getUserToken(this.props)
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

        <div>
          {/** The ClipLoader shows on the right without any CSS setting but the HashLoader doesn't. Weird. **/}
          <HashLoader
            color={'#FF0000'}
            loading={this.state.loading}
            size={30}
            sizeUnit={"px"}
          />
          <span style={{'color':'#66FF00'}}>{this.state.claimStoredResponse}</span>
        </div>


        {/* Attendance */}
        <input type="radio" name="claimType" onClick={()=>{
          this.setState({unsignedClaim: null})
          this.setState({unsignedClaim: this.joinActionClaim()})
        }}
        defaultChecked={this.state.unsignedClaim && this.state.unsignedClaim['@type'] && this.state.unsignedClaim['@type'] === 'JoinAction'}
        /> Set to Join Action
        <br/>


        {/* Org Role */}
        <input type="radio" name="claimType" onClick={()=>{
          this.setState({unsignedClaim: null})
          this.setState({unsignedClaim: this.orgRoleClaim()})
        }}/> Set to Organization Role
        <br/>


        {/* Land Tenure */}
        <input type="radio" name="claimType" onClick={()=>{
          this.setState({unsignedClaim: null})
          this.setState({unsignedClaim: this.ownershipClaim()})
        }}/> Set to Plot Ownership
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

        <span>{confirmClaimButtons}</span>

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
           <input type='text' style={{width: '590px'}} defaultValue={this.state.responseJWT}/>
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
    uport: state.App.uport,
  }
}
const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(AppActions, dispatch) }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SignClaim))
