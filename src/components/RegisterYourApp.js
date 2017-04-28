// Frameworks
import React, { Component } from 'react'
import styled from 'styled-components'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as AppActions from '../actions/AppActions'

const RegisterYourAppWrap = styled.section``
const NextButton = styled.button`
  margin-top: 20px;
`
const Link = styled.a`
  display: block;
`

class RegisterYourApp extends Component {
  render () {
    return (
      <RegisterYourAppWrap>
        <h4>Create a uPort ID for your app contracts</h4>
        <Link className='external' target='_blank' href='https://goo.gl/6mq9NW'>
          Click Here to Read the 'How To' Guide
        </Link>
        <br/>
        <Link className='external' target='_blank' href='https://appmanager.uport.me'>
          Go to the App Manager
        </Link>
        <NextButton
          onClick={this.props.actions.registerAppAreaComplete}>
          Next
        </NextButton>
      </RegisterYourAppWrap>
    )
  }
}

const mapStateToProps = (state, props) => {
  return { }
}
const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(AppActions, dispatch) }
}
export default connect(mapStateToProps, mapDispatchToProps)(RegisterYourApp)
