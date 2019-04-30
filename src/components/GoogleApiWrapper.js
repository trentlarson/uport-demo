// from https://reactjsexample.com/a-react-component-that-uses-the-google-maps-api

import React, { Component } from 'react'
import { GoogleApiWrapper, Map, Marker, Polygon } from 'google-maps-react'
import R from 'ramda'

const GOOGLE_MAPS_API_KEY=process.env.REACT_APP_GOOGLE_MAPS_API_KEY

function polygonPathsFromString(polygonStr) {
  let points = R.split(" ", polygonStr)
  let pointArrays = R.map(R.split(","), points)
  let result = R.map((point) => { return {lat:Number(point[0]), lng:Number(point[1])} }, pointArrays)
  return result
}

export class MapContainer extends Component {

  constructor (props) {
    super(props)
    this.state = {
      markerPosition: {},
      polygonPaths: []
    }
  }

  mapClicked = (mapProps, map, e) => {
    let lat = e.latLng.lat(), lng = e.latLng.lng()
    this.setState({ markerPosition: { lat, lng  } })
    fetch('http://' + process.env.REACT_APP_ENDORSER_CH_HOST_PORT + `/api/report/tenureClaimsAndConfirmationsAtPoint?lat=${lat}&lon=${lng}`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        "Uport-Push-Token": this.props.pushToken
      }})
      .then(response => response.json())
      .then(data => {
        if (data.length === 0) {
          this.setState({ polygonPaths: [] })
          this.props.setClaimants([])
        } else {
          this.setState({ polygonPaths: polygonPathsFromString(data[0].tenures[0].tenure.polygon) })
          if (data.length > 1) {
            alert("Multiple found.  Only showing boundaries for one.")
          }
          this.props.setClaimants(data)
        }
      })
  }

  render() {
    return (
      <div>
        <Map
        google={this.props.google}
        style={{ width: 600, height: 450 }}
        zoom={18}
        initialCenter={{ lat: 40.883944, lng: -111.884787 }}
        onClick={this.mapClicked}
        >

          <Marker position={this.state.markerPosition} />

          <Polygon
          paths={this.state.polygonPaths}
          strokeColor="#0000FF"
          strokeOpacity={0.8}
          strokeWeight={2}
          fillColor="#0000FF"
          fillOpacity={0.35}
          />

        </Map>
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: GOOGLE_MAPS_API_KEY
})(MapContainer)
