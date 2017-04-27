// Frameworks
import React, { Component } from 'react'
import styled from 'styled-components'

const RegisterYourAppWrap = styled.section``

class RegisterYourApp extends Component {

  constructor (props) {
    super(props)
    this.goToLogOut = this.goToLogOut.bind(this)
  }

  goToLogOut () {
    // Something
  }

  render () {
    return (
      <RegisterYourAppWrap>
        <h4>Create a uPort ID for your app contracts</h4>
        <span>FILLER CONTENT FOR REDIRECT</span>
      </RegisterYourAppWrap>
    )
  }
}

export default RegisterYourApp
