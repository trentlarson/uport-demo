// Frameworks
import React, { Component } from 'react'
import { uportServer, uportConnect } from '../utilities/uportSetup'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as AppActions from '../actions/AppActions'

import { transport } from 'uport-core'

import styled from 'styled-components'

const CredentialsWrap = styled.section`
  @media only screen and (min-device-width : 320px) and (max-device-width : 480px) {
    position: inherit;
  }
`
const CredentialsArea = styled.section`
  text-align: center;
`
const CredsTable = styled.table`
  margin: auto;
  text-align: left;
`

const CredsLabel = styled.label`
  position: relative;
  top: 10px;
`

const CredsButton = styled.button`
  margin-top: 20px;
`

const NextButton = styled.button`
  margin-top: 20px;
`

const SubText = styled.p`
  margin: 20px auto 3em auto;
  font-size: 18px;
`

const RELATIONSHIPCLAIM = 'User'
const CERTIFICATECLAIM = 'uPort Demo'


// TODO swap out with all

class CollectCredentials extends Component {

  constructor (props) {
    super(props)
    this.credentialsbtnClickA = this.credentialsbtnClickA.bind(this)
    this.credentialsbtnClickB = this.credentialsbtnClickB.bind(this)
    this.credentialsbtnClickC = this.credentialsbtnClickC.bind(this)
    // console.log(this.props.uport.capabilities[0])
    console.log(this.props.uport.publicEncKey)
    uportServer.push = transport.push.send(this.props.uport.pushToken, this.props.uport.publicEncKey, 'https://pututu.uport.me/api/v2/sns')
    // uportServer.push = transport.push.send(this.props.uport.pushToken, this.props.uport.publicEncKey)
  }

  credentialsbtnClickA () {
    uportServer.attest({
      sub: this.props.uport.did,
      claim: {name: this.props.uport.name},
        exp: Math.floor(new Date().getTime() / 1000) + 30 * 24 * 60 * 60 // 30 days from now
    }).then(jwt => {
      // uportConnect.request(`https://id.uport.me/add?attestations=${jwt}`)
      uportServer.push(`https://id.uport.me/req/${jwt}`, )
    })
  }
  credentialsbtnClickB () {
    uportServer.attest({
      sub: this.props.uport.did,
      claim: {Relationship: RELATIONSHIPCLAIM},
      exp: Math.floor(new Date().getTime() / 1000) + 30 * 24 * 60 * 60  // 30 days from now
    }).then(jwt => {
      console.log(jwt)
      uportConnect.request(jwt, 'credReqB')
      // uportServer.push(`https://id.uport.me/me?attest=${jwt}`)
    })
  }
  credentialsbtnClickC () {
    uportServer.attest({
      sub: this.props.uport.iss,
      claim: {Certificate: CERTIFICATECLAIM},
      exp: new Date().getTime() + 30 * 24 * 60 * 60 * 1000  // 30 days from now
    }).then(jwt => {
      uportConnect.request(`https://id.uport.me/add?attestations=${jwt}`)
      // uportServer.push(`https://id.uport.me/me?attest=${jwt}`)
    })
  }

  render (props) {
    return (
      <CredentialsWrap>
        <h4>Reclaim ownership of your data</h4>
        <CredentialsArea>
          <CredsTable>
            <tbody>
              <tr>
                <td style={{"paddingRight":"8em"}}>
                  <CredsLabel>Name: {this.props.uport.name}</CredsLabel>
                </td>
                <td>
                  <CredsButton onClick={this.credentialsbtnClickA}>Get</CredsButton>
                </td>
              </tr>
              <tr>
                <td>
                  <CredsLabel>Relationship: User</CredsLabel>
                </td>
                <td>
                  <CredsButton onClick={this.credentialsbtnClickB}>Get</CredsButton>
                </td>
              </tr>
              <tr>
                <td>
                  <CredsLabel>Certificate: uPort Demo</CredsLabel>
                </td>
                <td>
                  <CredsButton onClick={this.credentialsbtnClickC}>Get</CredsButton>
                </td>
              </tr>
            </tbody>
          </CredsTable>
          <NextButton onClick={this.props.actions.credentialsDemoComplete}>Next</NextButton>
        </CredentialsArea>
        <SubText>Credentials take a moment to appear on your device.</SubText>
      </CredentialsWrap>
    )
  }
}

const mapStateToProps = (state, props) => {
  return {
    uport: state.App.uport
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(AppActions, dispatch)
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(CollectCredentials)
