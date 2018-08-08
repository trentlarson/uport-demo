// Frameworks
import React, { Component } from 'react'
import styled from 'styled-components'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as AppActions from '../actions/AppActions'
import { withRouter, Link } from 'react-router-dom'

const RegisterYourAppWrap = styled.section``
const NextButton = styled.button`
  margin-top: 20px;
`
const LinkB = styled.a`
  display: block;
`

class RegisterYourApp extends Component {
  constructor (props) {
    super(props)
    this.logout = this.logout.bind(this)
  }

  logout () {
    uportConnect.logout()
    this.props.actions.connectUport(uportConnect.state)
    this.props.history.push('/logout')
  }

  render () {
    return (
      <RegisterYourAppWrap>
        <h4>Register your Application</h4>
        <br/>
        <LinkB className='external' target='_blank' href='http://developer.uport.me'>
          Go to the full Documentation Site.
        </LinkB>
        <br/>
        <LinkB className='external' target='_blank' href='http://developer.uport.me/myapps.html'>
          Go directly to the App Manager in the Documentation Site
        </LinkB>
        <br/>
        <LinkB className='external' target='_blank' href='https://goo.gl/6mq9NW'>
          Click here to read the 'How To' Guide for App Manager
        </LinkB>
        <br/>
        <Link to="/logout">
          <NextButton onClick={this.props.actions.registerAppAreaComplete}>
            Next
          </NextButton>
        </Link>
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
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RegisterYourApp))
