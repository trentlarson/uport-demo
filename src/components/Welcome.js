// Frameworks
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as AppActions from '../actions/AppActions'

class Welcome extends Component {

  render () {
    return (
      <div>
        <h4>Welcome to Crypto X</h4>
        <h6>
          This is a test application built by the uPort team
          to demonstrate the log-in and credentialing
          functionalities of our uPort libraries.
        </h6>
        <a onClick={this.props.actions.openModal}
          style={{cursor: 'pointer'}}
          className='btn btn-primary btn-md ml-auto p-2'>SIGN IN</a>
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
export default connect(mapStateToProps, mapDispatchToProps)(Welcome)
