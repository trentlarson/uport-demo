// Frameworks
import React, { Component } from 'react'
import { uport } from '../utilities/uportSetup'
import { connect } from 'react-redux'

import { bindActionCreators } from 'redux'
import * as AppActions from '../actions/AppActions'

class SignInModal extends Component {

  constructor (props) {
    super(props)
    this.uportBtnClick = this.uportBtnClick.bind(this)
  }

  uportBtnClick () {
    this.props.actions.closeModal()

    uport.requestCredentials({
      requested: ['name', 'phone', 'country'],
      notifications: true
    })
    .then((credentials) => {
      this.props.actions.connectUport(credentials)
    })
  }

  render () {
    return (
      <div id='modal'>
        <div className='modal-content'>
          <div className='header'>
            <h2>Login</h2>
          </div>
          <div className='body'>
            <button className='btn fb-btn' disabled>Log in with Facebook</button>
            <button
              className='btn uport-btn'
              onClick={this.uportBtnClick}>Log in with uPort</button>
            <hr />
            <form>
              <input type='text' placeholder='Name' disabled />
              <input type='text' placeholder='Password' disabled />
              <button className='btn form-btn' disabled>Sign In</button>
            </form>
            <hr />
            <a onClick={this.props.actions.closeModal}>Close</a>
          </div>
        </div>
        <div className='overlay' />
      </div>
    )
  }
}

const mapStateToProps = (state, props) => {
  return { }
}
const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(AppActions, dispatch) }
}
export default connect(mapStateToProps, mapDispatchToProps)(SignInModal)
