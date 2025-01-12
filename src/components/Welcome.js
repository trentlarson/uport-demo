// Frameworks
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as AppActions from '../actions/AppActions'
import styled from 'styled-components'
import { withRouter, Link } from 'react-router-dom'


const WelcomeWrap = styled.section``

const SubText = styled.p`
  margin: 0 auto 3em auto;
  font-size: 18px;
`
const NextButton = styled.button`
  margin-top: 20px;
`

class Welcome extends Component {

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
                <br/>
                <br/>
                <br/>
                <br/>
                <h2>Special Purposes</h2>
                <Link to="/bvc/index">
                  <NextButton>Bountiful Voluntaryist Community</NextButton>
                </Link>
              </div>
            )
            : (
              <div>

                <Link to="/publicReportList">
                <NextButton>Public Reports</NextButton>
                </Link>

                <br/>
                <br/>
                <br/>
                <br/>
                <br/>
                    See the most popular app at <a href="https://TimeSafari.org">TimeSafari.org</a>
                <br/>
                <br/>
                    For more power, use the Endorser mobile app to record claims. <Link to="/doc-tutorial">Like this.</Link>
                <br/>
                <br/>

                <a href="https://apps.apple.com/us/app/endorser-mobile/id1556368693" target="_blank">
                    <img src="https://uploads-ssl.webflow.com/5aac5d32ca4ae1564547cd0b/5aac5d32ca4ae108bd47cd15_app-store-badge.svg" alt=""/>
                </a>
                &nbsp;&nbsp; (Ask for Android.)
                {/**
                <a href="https://play.google.com/store/apps/details?id=ch.endorser.mobile" target="_blank">
                  <img src="https://uploads-ssl.webflow.com/5aac5d32ca4ae1564547cd0b/5aac5d32ca4ae15b7047cd13_google-play-badge.svg" alt=""/>
                </a>
                **/}

                <br/>
                <br/>
                Note that you'll have to get a registered person to register you.
                <br/>
                <Link to="/privacyPolicy">See policies.</Link>
                <br/>
                <a href="https://CommunityCred.org">Contact us.</a>
                <br/>
                <br/>
                <br/>
                <br/>
                <br/>
                <br/>

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
