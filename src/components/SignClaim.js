// Frameworks
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as AppActions from '../actions/AppActions'
import styled from 'styled-components'
import { uportConnect } from '../utilities/uportSetup'
import { insertSpacesBeforeCaps } from '../utilities/claims.js'
import { verifyJWT } from 'did-jwt'
import JSONInput from 'react-json-editor-ajrm'
import { withRouter } from 'react-router-dom'
import { DateTime } from 'luxon'


const SignReqID = 'SignRequest'
const WelcomeWrap = styled.section``

const JSONWrapper = styled.div`
  font-family: monospace !important
`
const ConnectUport = styled.button`
  background-color: #4C8F50;
`
const ClaimButton = styled.button`
  margin-right: 20px;
  margin-top: 10px;
  margin-bottom: 10px;
  font-size: 12pt;
  padding: 10px;
`

const attendedClaim = {
  "@context": "http://schema.org",
  "@type": "JoinAction",
  // note that there is constructor code below that sets "did" inside "agent"
  "agent": { "did": "did:ethr:0xdf0d8e5fd234086f6649f77bb0059de1aebd143e" },
  "event": {
    "organizer": { "name": "Bountiful Voluntaryist Community" },
    "name": "Saturday Morning Meeting",
    "startTime": "2018-12-29T08:00:00.000-07:00"
  }
}

function confirmClaim(originalClaim) {
  return {
    '@context': 'http://endorser.ch',
    '@type': 'Confirmation',
    'originalClaims': [originalClaim]
  }
}


class SignClaim extends Component {

  constructor (props) {
    super(props)

    attendedClaim.event.startTime = DateTime.local().startOf("hour").toISO()

    var unsignedClaim = attendedClaim
    if (uportConnect.did) {
      attendedClaim.agent.did = uportConnect.did
    }
    this.state = {
      responseJWT: '',
      responseJSON: null,
      claimStored: '',
      unsignedClaim: unsignedClaim,
      otherClaimsToSign: []
    }
    this.signClaim = this.signClaim.bind(this)
    this.handleSignedClaim = this.handleSignedClaim.bind(this)

    uportConnect.onResponse(SignReqID)
    .then(this.handleSignedClaim)
    .catch(error => {
      this.setState({responseJWT: error})
    })

  }

  componentDidMount() {
    fetch('http://localhost:3000/api/claim?excludeConfirmations=1', {
      headers: {
        "Content-Type": "application/json"
      }})
      .then(response => response.json())
      .then(data => this.setState({ otherClaimsToSign: data }))
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
      fetch('http://localhost:3000/api/claim', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({jwtEncoded:res.payload})})
        .then(response => response.json())
        .then(data => this.setState({ claimStored: "Saved with ID " + data }))
    })
    .catch(window.alert)

  }

  signClaim () {
    this.setState({responseJWT: null})
    const unsignedClaim = this.state.unsignedClaim
    var subject = uportConnect.did
    if (unsignedClaim.agent && unsignedClaim.agent.did) {
      subject = unsignedClaim.agent.did
    } else if (unsignedClaim['@type'] === 'Confirmation' && unsignedClaim.originalClaim) {
      if (unsignedClaim.originalClaim.agent && unsignedClaim.originalClaim.agent.did) {
        subject = unsignedClaim.originalClaim.agent.did
      }
    }
    uportConnect.requestVerificationSignature(unsignedClaim, subject, SignReqID)
  }

  render () {

    const claimButtons = this.state
          .otherClaimsToSign
          .map(jwt =>
               <span key={jwt.id}>
               <ClaimButton key="{'setClaim' + jwt.id}" onClick={() => {
                 this.setState({unsignedClaim: {}});
                 fetch('http://localhost:3000/api/claim/' + jwt.id, {
                   headers: {
                     "Content-Type": "application/json"
                   }})
                   .then(response => response.json())
                   .then(jwtJson => {
                     let originalClaim = JSON.parse(atob(jwtJson.claimEncoded))
                     this.setState({ unsignedClaim: confirmClaim(originalClaim) }) })
               }}>Confirm {insertSpacesBeforeCaps(jwt.claimType)}<br/>{jwt.issuedAt}</ClaimButton>

               <ClaimButton key="{'addClaim' + jwt.id}" onClick={() => {
                 if (this.state.unsignedClaim.originalClaims) {
                   fetch('http://localhost:3000/api/claim/' + jwt.id, {
                     headers: {
                       "Content-Type": "application/json"
                     }})
                     .then(response => response.json())
                     .then(jwtJson => {
                       var newConfirm = this.state.unsignedClaim
                       this.setState({ unsignedClaim: {} })
                       let originalClaim = JSON.parse(atob(jwtJson.claimEncoded))
                       newConfirm.originalClaims.push(originalClaim)
                       this.setState({ unsignedClaim: newConfirm }) })
                 } else {
                   alert('To add a confirm, select an original confirm first.')
                 }
               }}>(or <br/> add)</ClaimButton>
               </span>
              )

    return (
        <WelcomeWrap>
        <h4>Claim to Sign</h4>
        <div style={{display: 'flex', flex: 1, flexDirection: 'column', justifyContent: 'center', textAlign: 'left', marginBottom: '20px'}}>
          <div style={{marginRight: '20px'}}>

        <h3>Sample Claims</h3>

        <ClaimButton onClick={()=>{
          this.setState({unsignedClaim: null})
          this.setState({unsignedClaim: attendedClaim})
        }}>Sample Join Action</ClaimButton>
        <br/>

        <span>{claimButtons}</span>

        <h3>Claim</h3>

          <div style={{textAlign: 'center'}}>
            <ConnectUport onClick={this.signClaim}>
              Sign Claim
            </ConnectUport>
          </div>

          <JSONWrapper>

            <JSONInput
                id='request'
                placeholder={ this.state.unsignedClaim }
                height='400px'
                width='570px'
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

          {<div >
           <h3>Response (JWT)</h3>
           <input type='text' style={{width: '570px'}} value={this.state.responseJWT}/>
           <h3>Signed Claim Response (Parsed JWT)</h3>
           <JSONWrapper>
           <JSONInput
                id='response'
                placeholder={ this.state.responseJSON }
                height='320px'
                width='570px'
                viewOnly
                style={{body: {'fontSize': '10pt', textAlign: 'left'}}}
                locale='en'
           />
           </JSONWrapper>
           <div style={{'textAlign':'right'}}><span>{this.state.claimStored}</span></div>
           </div>}
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
