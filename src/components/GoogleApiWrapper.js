// from https://reactjsexample.com/a-react-component-that-uses-the-google-maps-api

import React, { Component } from 'react'
import { GoogleApiWrapper, InfoWindow, Map, Marker, Polygon } from 'google-maps-react'

const GOOGLE_MAPS_API_KEY=process.env.REACT_APP_GOOGLE_MAPS_API_KEY

export class MapContainer extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Map
      google={this.props.google}
      style={{ width: '600', height: '450' }}
      zoom={14}
      initialCenter={{ lat: 40.883944, lng: -111.884787 }}
      >
      <Polygon
      paths={this.props.boundaryCoords}
      strokeColor="#0000FF"
      strokeOpacity={0.8}
      strokeWeight={2}
      fillColor="#0000FF"
      fillOpacity={0.35} />
      </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: GOOGLE_MAPS_API_KEY
})(MapContainer)
