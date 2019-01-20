// Frameworks
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as AppActions from '../actions/AppActions'
import styled from 'styled-components'
import { uportConnect } from '../utilities/uportSetup'
import { insertSpacesBeforeCaps, firstAndLast3 } from '../utilities/claims.js'
import { verifyJWT } from 'did-jwt'
import JSONInput from 'react-json-editor-ajrm'
import { withRouter } from 'react-router-dom'
import { DateTime } from 'luxon'


const SignReqID = 'SignRequest'
const WelcomeWrap = styled.section``

const JSONWrapper = styled.div`
  font-family: monospace !important
`
const ConnectUport = styled.button``
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

function confirmClaim(claimEncoded) {
  return {
    '@context': 'http://endorser.ch',
    '@type': 'Confirmation',
    'claimEncoded': claimEncoded
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
      embeddedClaim: null,
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
    } else if (unsignedClaim['@type'] === 'Confirmation' && unsignedClaim.claimEncoded) {
      let embeddedClaim = JSON.parse(atob(unsignedClaim.claimEncoded))
      if (embeddedClaim.agent && embeddedClaim.agent.did) {
        subject = embeddedClaim.agent.did
      }
    }
    uportConnect.requestVerificationSignature(unsignedClaim, subject, SignReqID)
  }

  render () {

    const claimButtons = this.state
          .otherClaimsToSign
          .map(jwt =>
               <ClaimButton key={jwt.id} onClick={() => {
                 this.setState({unsignedClaim: {}});
                 fetch('http://localhost:3000/api/claim/' + jwt.id, {
                   headers: {
                     "Content-Type": "application/json"
                   }})
                   .then(response => response.json())
                   .then(json => {
                     var embeddedInfo = {}
                     embeddedInfo[firstAndLast3(json.claimEncoded)] = JSON.parse(atob(json.claimEncoded))
                     return { confirmClaim: confirmClaim(json.claimEncoded), embeddedInfo: embeddedInfo } })
                   .then(moarJson => this.setState({ unsignedClaim: moarJson.confirmClaim, embeddedClaim: moarJson.embeddedInfo })
                 )
               }}>{insertSpacesBeforeCaps(jwt.claimType)}<br/>{jwt.subject}</ClaimButton>
              )

    return (
        <WelcomeWrap>
        <h4>Claim to Sign</h4>
        <div style={{display: 'flex', flex: 1, flexDirection: 'row', justifyContent: 'center', textAlign: 'left', marginBottom: '20px'}}>
          <div style={{marginRight: '20px'}}>

          <div style={{textAlign: 'center'}}>
            <ConnectUport onClick={this.signClaim}>
              Sign Claim
            </ConnectUport>
          </div>

          <h3>Claim</h3>
          <JSONWrapper>

            <JSONInput
                id='request'
                placeholder={ this.state.unsignedClaim }
                height='320px'
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

          <JSONWrapper>
          <JSONInput
           id='claimContents'
           viewOnly='true'
           confirmGood=''
           placeholder={ this.state.embeddedClaim ? this.state.embeddedClaim : "" }
           height='320px'
           width='570px'
           theme='light_mitsuketa_tribute'
           colors={{'background':'#D4D4D4'}}
           style={{body: {'fontSize': '10pt', textAlign: 'left', flex: 1}}}
           locale='en'
           />
          </JSONWrapper>

            <ClaimButton onClick={()=>{
              this.setState({unsignedClaim: null, embeddedClaim: {}})
              this.setState({unsignedClaim: attendedClaim})
            }}>Attended Template</ClaimButton>
            <ClaimButton onClick={()=>{
              this.setState({unsignedClaim: null, embeddedClaim: {}})
              this.setState({unsignedClaim: confirmClaim('...')})
            }}>Confirmation Template</ClaimButton>
            <br/>

          <h3>Claims</h3>
          <span>{claimButtons}</span>

          </div>

          {<div >
            <h3>Response JWT: </h3>
            <input type='text' style={{width: '570px'}} value={this.state.responseJWT}/>
            <h3>Parsed JWT: </h3>
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
