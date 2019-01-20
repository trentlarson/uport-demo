// Frameworks
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as AppActions from '../actions/AppActions'
import styled from 'styled-components'
import { uportConnect } from '../utilities/uportSetup'
import { withRouter, Link } from 'react-router-dom'


const ConnectReqID = 'ConnectRequest'
const WelcomeWrap = styled.section``
const ConnectUport = styled.button``
const SubText = styled.p`
  margin: 0 auto 3em auto;
  font-size: 18px;
`
const NextButton = styled.button`
  margin-top: 20px;
`

class Welcome extends Component {

  constructor (props) {
    super(props)
    this.connectUport = this.connectUport.bind(this)

    uportConnect.onResponse(ConnectReqID).then(res => {
      console.log("res.payload")
      console.log(res.payload)
      this.props.actions.connectUport(uportConnect.state)
      this.props.history.push('/signclaim')
    })
  }

  connectUport () {
    const reqObj = { requested: ['name', 'phone', 'country'],
                     notifications: true }
    uportConnect.requestDisclosure(reqObj, ConnectReqID)
  }

  render () {
    return (
      <WelcomeWrap>
        <h4>Build a Better dApp</h4>
        <SubText>Identity and transaction infrastructure for Ethereum</SubText>
        {
          this.props.uport && this.props.uport.name
            ? (<div>
                <p>Welcome back {this.props.uport.name}</p>
                <Link to="/signclaim">
                  <NextButton>Claim / Confirm</NextButton>
                </Link>
                <br/>
                <Link to="/explore">
                  <NextButton>Previous Claims / Confirmations</NextButton>
                </Link>
                <br/>
                <Link to="/reports">
                  <NextButton>Report</NextButton>
                </Link>
              </div>
            )
            : (
              <ConnectUport  onClick={this.connectUport}>
                Connect with uPort
              </ConnectUport>
            )
        }
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Welcome))
