// Frameworks
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as AppActions from '../actions/AppActions'
import styled from 'styled-components'
import { firstAndLast3OfDid } from '../utilities/claims'
import { withRouter } from 'react-router-dom'
import GoogleApiWrapper from './GoogleApiWrapper'
import R from 'ramda'

const WelcomeWrap = styled.section``

const RightSection = styled.section`
float: right;
`

function tenureAndConfirmsDesc(tenuresAndConfs) {
  let tenureDid = tenuresAndConfs[0].did
  let allTenures = R.flatten(R.map(R.prop("tenures"), tenuresAndConfs))
  // this is a list of tenure objects
  let allTens = R.flatten(R.map(R.prop("tenure"), allTenures))
  // this is a list of confirmations
  let allConfs = R.flatten(R.map(R.prop("confirmations"), allTenures))
  let allConfCounts = allConfs.length
  let allVisibleTos = []
      .concat(R.map(R.prop("didVisibileToDids"), tenuresAndConfs))
      .concat(R.flatten(R.map(R.prop("partyDidVisibleToDids"), allTens)))
      .concat(R.flatten(R.map(R.prop("issuerVisibleToDids"), allConfs)))
  let allVisibleTosFiltered = R.uniq(R.flatten(R.filter(R.compose(R.not, R.isNil), allVisibleTos)))
  var reachable = (allVisibleTosFiltered.length > 0) ? "reachable via" : ""
  return <span>
    {firstAndLast3OfDid(tenureDid)} confirmed by {allConfCounts}
    <br/>
    {reachable} <ul>{R.join(',',allVisibleTosFiltered)}</ul>
    </span>
}

class ReportResidences extends Component {

  constructor (props) {
    super(props)
    this.state = {
      claimsByTenure: []
    }
  }

  setClaimants(tenuresAndConfirms) {
    let byTenureId = R.groupBy((item) => ""+item.tenures[0].tenure.id)(tenuresAndConfirms)
    this.setState({claimsByTenure: byTenureId})
  }

  render () {
    return (
      <WelcomeWrap>
        <h4>Report Residences</h4>
        {
                <div style={{ height: '100%', width: '100%' }}>
                <div>
                  <RightSection>
                  <ul>
                {
                  R.keys(this.state.claimsByTenure).length === 0 ? "" : "Claims:"
                }
                {
                  R.keys(this.state.claimsByTenure).map((tenureId)=><li key={tenureId}>{
                    tenureAndConfirmsDesc(this.state.claimsByTenure[tenureId])
                  }</li>)
                }
                  </ul>
                  </RightSection>
                </div>
                <div>
                <GoogleApiWrapper setClaimants={this.setClaimants.bind(this)} uport={this.props.uport} />
                </div>
                </div>
        }
      </WelcomeWrap>
    )
  }
}

const mapStateToProps = (state, props) => {
  return {
    uport: state.App.uport,
  }
}
const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(AppActions, dispatch) }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ReportResidences))
