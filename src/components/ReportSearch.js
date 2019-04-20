// Frameworks
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as AppActions from '../actions/AppActions'
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'


const WelcomeWrap = styled.section``
const SubText = styled.p`
  margin: 0 auto 3em auto;
  font-size: 18px;
`

class ReportClaims extends Component {

  constructor (props) {
    super(props)
    this.state = {
      query: ""
    }
  }

  componentDidMount() {
  }

  render () {

    return (
      <WelcomeWrap>
        <h4>Search Your Network</h4>
        <SubText>See who in your network has a claim or can introduce you.</SubText>
        <h3>Claim</h3>
        <div>
        <input type='text' value={this.state.query}/>
        <input type='submit' value='search'/>
        </div>

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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ReportClaims))
