// Frameworks
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as AppActions from '../actions/AppActions'
import styled from 'styled-components'
import { uportConnect } from '../utilities/uportSetup'
import { verifyJWT } from 'did-jwt'
import JSONInput from 'react-json-editor-ajrm'
import { withRouter, Link } from 'react-router-dom'


const SignReqID = 'SignRequest'
const WelcomeWrap = styled.section``

const JSONWrapper = styled.div`
  font-family: monospace !important
`
const ConnectUport = styled.button``
const NextButton = styled.button`
  margin-top: 20px;
`
const ClaimButton = styled.button`
  margin-right: 20px;
  margin-top: 10px;
  margin-bottom: 10px;
  font-size: 12pt;
  padding: 10px;
`

const attendedClaim = {
  '@context': 'http://schema.org',
  '@type': 'AttendedAction',
  'agent':
  { '@type': 'Person',
    'did': 'did:ethr:0xdf0d8e5fd234086f6649f77bb0059de1aebd143e' },
  object:
  { '@type': 'Event',
    'name': 'Bountiful Voluntaryist Community Saturday morning meeting',
    'startTime': '2018-12-29T08:00:00-07' }
}

export const confirmClaim = {
  '@context': 'http://endorser.ch',
  '@type': 'ConfirmClaim',
  'payload': '...'
}


// insert a space in front of any capital letters
function insertSpace(text) {
  return text[0] + text.substr(1).replace(/([A-Z])/g, ' $1')
}

class SignClaim extends Component {

  constructor (props) {
    super(props)
    this.state = {
      responseJWT: null,
      responseJSON: null,
      sub: 'did:uport:2oze6gbJDBVsvvBpzghEhCJsWMazvKmwUCD',
      aud: '',
      unsignedClaim: { name: 'Bob'},
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
    fetch('http://localhost:3001/api/jwt', {
      headers: {
        "Content-Type": "application/json"
      }})
      .then(response => response.json())
      .then(data => this.setState({ otherClaimsToSign: data }))}

  handleSignedClaim(res) {
    console.log(res)
    verifyJWT(res.payload).then(json => {
      console.log('json', json)
      this.setState({
        responseJWT: res.payload,
        responseJSON: json.payload
      })
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
                 this.setState({unsignedClaim: null})
                 this.setState({unsignedClaim: jwt})
               }}>{insertSpace(jwt.claimType)}<br/>{jwt.subject}</ClaimButton>
              )

    return (
      <WelcomeWrap>
        <h4>Sign the following claim: </h4>
        <div style={{display: 'flex', flex: 1, flexDirection: 'row', justifyContent: 'center', textAlign: 'left', marginBottom: '20px'}}>
          <div style={{marginRight: '20px'}}>
          <h3>Subject: </h3>
          <input type='text' style={{width: '500px'}} value={this.state.sub} onChange={(e) => this.setState({sub: e.target.value !== '' ? e.target.value : null})} />
          <h3>Audience: </h3>
          <input type='text' style={{width: '500px'}} value={this.state.aud} onChange={(e) => this.setState({aud: e.target.value !== '' ? e.target.value : null})} />
          <h3>Claim: </h3>
            <JSONWrapper>
            {!this.state.unsignedClaim !== null && <JSONInput
                id='request'
                placeholder={ this.state.unsignedClaim }
                height='300px'
                width='500px'
                onChange={(value) => {
                  if (value.jsObject !== undefined) {
                    this.setState({unsignedClaim: value.jsObject})
                  }
                }}
                style={{body: {'fontSize': '10pt', textAlign: 'left', flex: 1}}}
            />}
            </JSONWrapper>
            <ClaimButton onClick={()=>{
              this.setState({unsignedClaim: null})
              this.setState({unsignedClaim: attendedClaim})
            }}>Attended</ClaimButton>
            <ClaimButton onClick={()=>{
              this.setState({unsignedClaim: null})
              this.setState({unsignedClaim: confirmClaim})
            }}>Confirm</ClaimButton>
            <br/>
            <span>{claimButtons}</span>
          </div>
          {this.state.responseJWT && <div >
            <h3>Response JWT: </h3>
            <input type='text' style={{width: '500px'}} value={this.state.responseJWT}/>
            <h3>Parsed JWT: </h3>
            <JSONWrapper>
            <JSONInput
                id='response'
                placeholder={ this.state.responseJSON }
                height='300px'
                width='500px'
                viewOnly
                style={{body: {'fontSize': '10pt', textAlign: 'left'}}}
            />
            </JSONWrapper>
          </div>}
        </div>
        <ConnectUport onClick={this.signClaim}>
          Sign Claim
        </ConnectUport>
        <div>
        <Link to="/transaction">
          <NextButton>
            Next
          </NextButton>
        </Link>
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
