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
const Time30Days = () => Math.floor(new Date().getTime() / 1000) + 30 * 24 * 60 * 60

class CollectCredentials extends Component {

  constructor (props) {
    super(props)
    this.credentialsbtnClickA = this.credentialsbtnClickA.bind(this)
    this.credentialsbtnClickB = this.credentialsbtnClickB.bind(this)
    this.credentialsbtnClickC = this.credentialsbtnClickC.bind(this)
    console.log(this.props.uport.pushToken)
    uportServer.push = transport.push.send(this.props.uport.pushToken, this.props.uport.publicEncKey, 'https://api.uport.space/pututu/sns')
  }

  credentialsbtnClickA () {
    uportServer.attest({
      sub: this.props.uport.did,
      claim: {name: this.props.uport.name},
      exp: Time30Days()
    }).then(jwt => {
      uportServer.push(`https://id.uport.me/req/${jwt}`, )
    })
  }
  credentialsbtnClickB () {
    uportServer.attest({
      sub: this.props.uport.did,
      claim: {Relationship: RELATIONSHIPCLAIM},
      exp: Time30Days()
    }).then(jwt => {
      console.log(jwt)
      uportConnect.request(jwt, 'credReqB')
      // uportServer.push(`https://id.uport.me/req/${jwt}`, )
    })
  }
  credentialsbtnClickC () {
    uportServer.attest({
      sub: this.props.uport.did,
      claim: {Certificate: CERTIFICATECLAIM},
      exp: Time30Days()
    }).then(jwt => {
      uportServer.push(`https://id.uport.me/req/${jwt}`, )
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
