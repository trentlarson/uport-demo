// Frameworks
import React, { Component } from 'react'
import { uport } from '../utilities/uportSetup'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as AppActions from '../actions/AppActions'

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

class CollectCredentials extends Component {

  constructor (props) {
    super(props)
    this.credentialsbtnClickA = this.credentialsbtnClickA.bind(this)
    this.credentialsbtnClickB = this.credentialsbtnClickB.bind(this)
    this.credentialsbtnClickC = this.credentialsbtnClickC.bind(this)
  }

  credentialsbtnClickA () {
    uport.attestCredentials({
      sub: this.props.uport.address,
      claim: {name: this.props.uport.name},
      exp: new Date().getTime() + 30 * 24 * 60 * 60 * 1000,  // 30 days from now
      uriHandler: (log) => { console.log(log) }
    })
  }
  credentialsbtnClickB () {
    uport.attestCredentials({
      sub: this.props.uport.address,
      claim: {Relationship: RELATIONSHIPCLAIM},
      exp: new Date().getTime() + 30 * 24 * 60 * 60 * 1000,  // 30 days from now
      uriHandler: (log) => { console.log(log) }
    })
  }
  credentialsbtnClickC () {
    uport.attestCredentials({
      sub: this.props.uport.address,
      claim: {Certificate: CERTIFICATECLAIM},
      exp: new Date().getTime() + 30 * 24 * 60 * 60 * 1000,  // 30 days from now
      uriHandler: (log) => { console.log(log) }
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
