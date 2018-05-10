// Frameworks
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as AppActions from '../actions/AppActions'
import styled from 'styled-components'
import { uportServer, uportConnect } from '../utilities/uportSetup'
const CHASQUI_URL = 'https://chasqui.uport.me/api/v1/topic/'
import { crypto } from 'uport-core'


const ConnectReqID = 'ConnectRequest'
const WelcomeWrap = styled.section``
const ConnectUport = styled.button``
const SubText = styled.p`
  margin: 0 auto 3em auto;
  font-size: 18px;
`

class Welcome extends Component {

  constructor (props) {
    super(props)
    this.connectUport = this.connectUport.bind(this)

    uportConnect.onResponse('ConnectRequest').then(res => {
      console.log(res)
      this.props.actions.connectUport(res.res)
    })
  }

  connectUport () {
    const reqObj = { requested: ['name', 'phone', 'country'],
                     notifications: true,
                     callbackUrl: CHASQUI_URL + crypto.randomString(16) }
    uportServer.requestDisclosure(reqObj).then(jwt => {
      // TODO simple func to wrap in libs
      console.log(jwt)
      uportConnect.request(`https://id.uport.me/me?requestToken=${jwt}`, 'ConnectRequest')
    })
  }

  render () {
    return (
      <WelcomeWrap>
        <h4>Build a Better dApp</h4>
        <SubText>Identity and transaction infrastructure for Ethereum</SubText>
        <ConnectUport
          onClick={this.connectUport}>
          Connect with uPort
        </ConnectUport>
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
export default connect(mapStateToProps, mapDispatchToProps)(Welcome)
