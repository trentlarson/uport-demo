// Frameworks
import React, { Component } from 'react'
import { uportConnect } from '../utilities/uportSetup'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as AppActions from '../actions/AppActions'
import { withRouter, Link } from 'react-router-dom'

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
const credAReq ='credAReq'
const credBReq ='credBReq'
const credCReq ='credCReq'

const credentialFactory = (sub, exp) => (claim) => ({sub, exp, claim})


class CollectCredentials extends Component {

  constructor (props) {
    super(props)
    this.credentialsbtnClickA = this.credentialsbtnClickA.bind(this)
    this.credentialsbtnClickB = this.credentialsbtnClickB.bind(this)
    this.credentialsbtnClickC = this.credentialsbtnClickC.bind(this)
    uportConnect.onResponse(credAReq).then(payload => {
      // TODO this request doesn't close qr code??
      console.log(payload)
    })
    this.credentialCreate = credentialFactory (this.props.uport.did, Time30Days())
  }

  credentialsbtnClickA () {
    uportConnect.attest(this.credentialCreate({Name: this.props.uport.name}), credAReq)
  }

  credentialsbtnClickB () {
    uportConnect.attest(this.credentialCreate({Relationship: RELATIONSHIPCLAIM}), credBReq)
  }

  credentialsbtnClickC () {
    uportConnect.attest(this.credentialCreate({Certificate: CERTIFICATECLAIM}), credCReq)
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
          <Link to="/register">
            <NextButton onClick={this.props.actions.credentialsDemoComplete}>
              Next
            </NextButton>
          </Link>
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
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CollectCredentials))
