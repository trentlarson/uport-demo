// Frameworks
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as AppActions from '../actions/AppActions'
import styled from 'styled-components'

const WelcomeWrap = styled.section``
const ConnectUport = styled.button``

class Welcome extends Component {
  render () {
    return (
      <WelcomeWrap>
        <h4>Build a better DApp</h4>
        <h6>Identity and transaction infrastructure for Ethereum</h6>
        <ConnectUport
          onClick={this.props.actions.welcomeComplete}>
          Connect with uPort
        </ConnectUport>
      </WelcomeWrap>
    )
  }
}

const mapStateToProps = (state, props) => {
  return {}
}
const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(AppActions, dispatch) }
}
export default connect(mapStateToProps, mapDispatchToProps)(Welcome)
