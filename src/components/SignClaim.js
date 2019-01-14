// Frameworks
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as AppActions from '../actions/AppActions'
import styled from 'styled-components'
import { uportConnect } from '../utilities/uportSetup'
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


// insert a space in front of any capital letters
function insertSpace(text) {
  return text[0] + text.substr(1).replace(/([A-Z])/g, ' $1')
}

class SignClaim extends Component {

  constructor (props) {
    super(props)

    attendedClaim.event.startTime = DateTime.local().startOf("hour").toISO()

    var subject = 'did:uport:2oze6gbJDBVsvvBpzghEhCJsWMazvKmwUCD'
    var unsignedClaim = attendedClaim
    if (uportConnect.did) {
      subject = uportConnect.did
      attendedClaim.agent.did = uportConnect.did
    }
    this.state = {
      responseJWT: null,
      responseJSON: null,
      claimStored: "",
      sub: subject,
      aud: '',
      unsignedClaim: unsignedClaim,
      embeddedClaim: null,
      otherClaimsToSign: [],
      otherClaimConfirmations: []
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
    fetch('http://localhost:3000/api/claim?claimType=JoinAction', {
      headers: {
        "Content-Type": "application/json"
      }})
      .then(response => response.json())
      .then(data => this.setState({ otherClaimsToSign: data }))

    fetch('http://localhost:3000/api/claim?claimType=Confirmation', {
      headers: {
        "Content-Type": "application/json"
      }})
      .then(response => response.json())
      .then(data => this.setState({ otherClaimConfirmations: data }))
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
    const sub = this.state.sub
    uportConnect.requestVerificationSignature(unsignedClaim, sub, SignReqID)
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
                   // extract the claim and decode it
                   //.then(json => {claim:, claimEncoded:json.claimEncoded})
                   .then(json => this.setState({ unsignedClaim: confirmClaim(json.claimEncoded), embeddedClaim: JSON.parse(atob(json.claimEncoded)) })
                 )
               }}>{insertSpace(jwt.claimType)}<br/>{jwt.subject}</ClaimButton>
              )

    const confirmedClaims = this.state
          .otherClaimConfirmations
          .map(jwt => <li key={jwt.id}>{jwt.subject}</li>)

    return (
        <WelcomeWrap>
        <h4>Sign the following claim: </h4>
        <div style={{display: 'flex', flex: 1, flexDirection: 'row', justifyContent: 'center', textAlign: 'left', marginBottom: '20px'}}>
          <div style={{marginRight: '20px'}}>
          <table>
            <tbody>
            <tr>
              <td>
                <h3>Subject&nbsp;</h3>
              </td>
              <td>
                <input type='text' style={{width: '400px'}} value={this.state.sub} onChange={(e) => this.setState({sub: e.target.value !== '' ? e.target.value : null})} />
              </td>
            </tr>
            </tbody>
          </table>
          <h3>Claim</h3>
            <JSONWrapper>
            <JSONInput
                id='request'
                placeholder={ this.state.unsignedClaim }
                height='300px'
                width='550px'
                onChange={(value) => {
                  if (value.jsObject !== undefined) {
                    this.setState({unsignedClaim: value.jsObject})
                  }
                }}
                style={{body: {'fontSize': '10pt', textAlign: 'left', flex: 1}}}
             locale='en'
            />
            </JSONWrapper>
            <ClaimButton onClick={()=>{
              this.setState({unsignedClaim: null, embeddedClaim: null})
              this.setState({unsignedClaim: attendedClaim, embeddedClaim: null})
            }}>Attended</ClaimButton>
            <ClaimButton onClick={()=>{
              this.setState({unsignedClaim: null, embeddedClaim: null})
              this.setState({unsignedClaim: confirmClaim('...'), embeddedClaim: null})
            }}>Confirm</ClaimButton>
            <ConnectUport onClick={this.signClaim}>
              Sign Claim
            </ConnectUport>
            <br/>

            <JSONWrapper>
            {!this.state.embeddedClaim ? "" : <JSONInput
             id='claimContents'
             viewOnly='true'
             confirmGood=''
             placeholder={ this.state.embeddedClaim ? this.state.embeddedClaim : "" }
             height='300px'
             width='550px'
             theme='light_mitsuketa_tribute'
             colors={{'background':'#D4D4D4'}}
             style={{body: {'fontSize': '10pt', textAlign: 'left', flex: 1}}}
             locale='en'
             />}
            </JSONWrapper>

            <span>{claimButtons}</span>

            <h3>Confirmed Claims: </h3>
             <span><ul>{confirmedClaims}</ul></span>

          </div>
          {this.state.responseJWT && <div >
            <h3>Response JWT: </h3>
            <input type='text' style={{width: '550px'}} value={this.state.responseJWT}/>
            <h3>Parsed JWT: </h3>
            <JSONWrapper>
            <JSONInput
                id='response'
                placeholder={ this.state.responseJSON }
                height='300px'
                width='550px'
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
