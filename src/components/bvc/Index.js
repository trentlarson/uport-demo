import { DateTime } from 'luxon'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter, Link } from 'react-router-dom'
import styled from 'styled-components'

import * as AppActions from '../../actions/AppActions'

const NextButton = styled.button`
margin-top: 20px;
`

class Index extends Component {

  render () {

    const IS_SATURDAY = DateTime.local().weekday === 6

    return (
      <div>
        <h1>Bountiful Voluntaryist Community</h1>

        <Link to="/bvc/attendedSat">
        <NextButton>Attended {IS_SATURDAY ? "Today's" : "Last Saturday's"} Meeting</NextButton>
        </Link>

        <br/>
        <Link to="/agreeAction">
          <NextButton>Confirm</NextButton>
        </Link>

        <br/>
        <Link to="/bvc/attendedFirearm">
          <NextButton>Attended 2021.01.15 Firearm Training</NextButton>
        </Link>

      </div>
    );
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Index))
