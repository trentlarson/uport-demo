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
      this.props.history.push('/signClaim')
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
        <h4>Endorser Search</h4>
        <SubText>Make claims, confirm other claims, and report on them. </SubText>
        {
          this.props.uport && this.props.uport.name
            ? (<div>
                <Link to="/signclaim">
                  <NextButton>Claim / Confirm</NextButton>
                </Link>
                <br/>
                <Link to="/reportList">
                  <NextButton>Reports</NextButton>
                </Link>
              </div>
            )
            : (
              <div>
              <ConnectUport onClick={this.connectUport}>
                Connect with uPort
              </ConnectUport>

              <br/>
              <br/>
              <a href="https://itunes.apple.com/us/app/uport-id/id1123434510?mt=8" target="_blank">
              <img src="https://uploads-ssl.webflow.com/5aac5d32ca4ae1564547cd0b/5aac5d32ca4ae108bd47cd15_app-store-badge.svg" alt=""/>
              </a>
              <a href="https://play.google.com/store/apps/details?id=com.uportMobile&amp;hl=en" target="_blank">
              <img src="https://uploads-ssl.webflow.com/5aac5d32ca4ae1564547cd0b/5aac5d32ca4ae15b7047cd13_google-play-badge.svg" alt=""/>
              </a>

              <br/>
              <br/>
              <Link to="/publicReportList">
              <NextButton>Public Reports</NextButton>
              </Link>

              </div>

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
