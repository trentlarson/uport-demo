// Frameworks
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as AppActions from '../actions/AppActions'
import styled from 'styled-components'
import { withRouter, Link } from 'react-router-dom'


const WelcomeWrap = styled.section``
const NextButton = styled.button`
  margin-top: 20px;
`
const ColumnsSection = styled.button`
  flex: 1;
`
const LeftSection = styled.section`
  float: left;
`
const RightSection = styled.section`
  float: right;
`

class ReportList extends Component {

  render () {
    return (
      <WelcomeWrap>
        <h4>Reports</h4>
        <ColumnsSection>

          <LeftSection>
            <Link to="/reportBestAttendance">
            <NextButton>Best Attendance</NextButton>
            </Link>
          </LeftSection>

          <a href="https://livesofgifts.org/projects/">
            <NextButton>Projects</NextButton>
          </a>

          <Link to="/reportResidences">
            <NextButton>Residences</NextButton>
          </Link>

          <RightSection>
            <Link to="/reportSearch">
              <NextButton>Search</NextButton>
            </Link>
          </RightSection>

        </ColumnsSection>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ReportList))
