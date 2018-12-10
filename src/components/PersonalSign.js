import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { withRouter, Link } from 'react-router-dom'

import { recoverPersonalSignature } from '../utilities/ethUtils'
import * as AppActions from '../actions/AppActions'
import { uportConnect } from '../utilities/uportSetup'

const WelcomeWrap = styled.section``
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

const MESSAGE = 'This is a message that I would like you to sign'
const PersonalSignReqID = 'personalSign'

class PersonalSign extends Component { 
  constructor(props) {
    super(props)

    this.state = {
      data: MESSAGE,
      signature: null,
      signedBy: null,
      recovered: null,
    }

    this.handleResponse = this.handleResponse.bind(this)

    uportConnect.onResponse(PersonalSignReqID)
      .then(this.handleResponse)
      .catch(console.error)
  }

  handleResponse({ payload }) {
    console.log(payload)
    const recovered = recoverPersonalSignature(payload.data, payload.signature)
    this.setState({
      signature: payload.signature,
      signedBy: payload.did.substr(9),
      recovered,
    })
  }

  render() {
    const {signature, data, signedBy, recovered} = this.state
    const {r,s,v} = signature || {}
    return (
      <WelcomeWrap>
        <h4>Sign the following message:</h4>
        <div style={{display: 'flex', flex: 1, flexDirection: 'row', justifyContent: 'center', textAlign: 'left', marginBottom: '20px'}}>
          <div style={{marginRight: '20px'}}>
          <h3>Typed Data: </h3>
            <div>
              <input type='text' style={{width: '500px'}} onChange={({target}) => this.setState({data: target.value})} value={data} />
            </div>
            <ClaimButton onClick={()=>{
              this.setState({signature: null, data: MESSAGE})
            }}>Reset</ClaimButton>
          </div>
          {(recovered !== null && signedBy === recovered) && (
            <div>
              <h3>Signed by:</h3>
              <div>{signedBy}</div>
              <h3>Signature: </h3>
              <div>r: {r}</div>
              <div>s: {s}</div>
              <div>v: {v}</div>
              <h3>Address recovered from signature:</h3>
              <div>{recovered}</div>
            </div>
          )}
        </div>
        <ConnectUport onClick={() => uportConnect.requestPersonalSign(data, PersonalSignReqID)}>
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
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PersonalSign))
