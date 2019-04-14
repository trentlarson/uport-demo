// Frameworks
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as AppActions from '../actions/AppActions'
import styled from 'styled-components'
import { uportConnect } from '../utilities/uportSetup'
import { withRouter } from 'react-router-dom'
import Map from 'google-map-react';

let GOOGLE_MAPS_API_KEY=process.env.REACT_APP_GOOGLE_MAPS_API_KEY
const ConnectReqID = 'ConnectRequest'
const WelcomeWrap = styled.section``
const ConnectUport = styled.button``

class ReportResidences extends Component {

  static defaultProps = {
    center: {
      lng: -111.884787, lat: 40.883944
    },
    zoom: 19
  }
  //lat: 59.95, lng: 30.33

  constructor (props) {
    super(props)
    this.connectUport = this.connectUport.bind(this)

    uportConnect.onResponse(ConnectReqID).then(res => {
      console.log("res.payload")
      console.log(res.payload)
      this.props.actions.connectUport(uportConnect.state)
      this.props.history.push('/signclaim')
    })
    this.state = {}
  }

  connectUport () {
    const reqObj = { requested: ['name', 'phone', 'country'],
                     notifications: true }
    uportConnect.requestDisclosure(reqObj, ConnectReqID)
  }

  render () {
    return (
      <WelcomeWrap>
        <h4>Reports</h4>
        {
          this.props.uport && this.props.uport.name
            ? (
                <div style={{ height: '100vh', width: '100%' }}>
                <Map
              bootstrapURLKeys={{ key: GOOGLE_MAPS_API_KEY }}
                  defaultCenter={this.props.center}
                  defaultZoom={this.props.zoom}
                  yesIWantToUseGoogleMapApiInternals
                  onGoogleApiLoaded={({ map, maps }) => { this.setState({ map: map, maps:maps, mapLoaded: true }) }}
                >
                </Map>
                </div>
            )
            : (
              <ConnectUport onClick={this.connectUport}>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ReportResidences))
