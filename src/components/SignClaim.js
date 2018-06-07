// Frameworks
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as AppActions from '../actions/AppActions'
import styled from 'styled-components'
import { uportServer, uportConnect } from '../utilities/uportSetup'
import { crypto } from 'uport-core'

const SignReqID = 'SignRequest'
const WelcomeWrap = styled.section``
const ConnectUport = styled.button``
const NextButton = styled.button`
  margin-top: 20px;
`
const SubText = styled.p`
  margin: 0 auto 3em auto;
  font-size: 18px;
`
class SignClaim extends Component {

  constructor (props) {
    super(props)
    this.signClaim = this.signClaim.bind(this)

    uportConnect.onResponse(SignReqID).then(payload => {
      console.log(payload)
      this.props.actions.signClaim()
    })
  }

  signClaim () {
    uportServer.createVerificationRequest('did:uport:2oze6gbJDBVsvvBpzghEhCJsWMazvKmwUCD').then(jwt => {
      console.log(jwt)
      uportConnect.request(jwt, SignReqID, {type: 'redirect'})
    })
  }

  render () {
    return (
      <WelcomeWrap>
        <h4>Sign the following claim: </h4>
        <SubText> {'{'} "Self Signed": {'{'}value: true  {'}'} {'}'} </SubText>
        <ConnectUport
          onClick={this.signClaim}>
          Sign Claim
        </ConnectUport>
        <div>
        <NextButton
          onClick={this.props.actions.signClaim}>
          Next
        </NextButton>
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
export default connect(mapStateToProps, mapDispatchToProps)(SignClaim)
