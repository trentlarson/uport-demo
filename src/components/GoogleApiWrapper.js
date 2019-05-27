// from https://reactjsexample.com/a-react-component-that-uses-the-google-maps-api

import React, { Component } from 'react'
import { GoogleApiWrapper, Map, Marker, Polygon } from 'google-maps-react'
import R from 'ramda'

const { Credentials } = require('uport-credentials')

const GOOGLE_MAPS_API_KEY=process.env.REACT_APP_GOOGLE_MAPS_API_KEY

let creds = [
  { did: 'did:ethr:0x00c9c2326c73f73380e8402b01de9defcff2b064', privateKey: '8de6e2bd938a29a8348316cbae3811475f22f2ae87a42ad0ece727ff25c613b5' },
  { did: 'did:ethr:0x11bb3621f8ea471a750870ae8dd5f4b8203e9557', privateKey: 'e4a3d47ed1058e5c07ed825b5cf0516aab757b1d141a4dc24392271537e10aa0' },
  { did: 'did:ethr:0x22c51a43844e44b59c112cf74f3f5797a057837a', privateKey: '590e1a75d89e453d9b33f982badc4fdcd67046c8dbf4323f367b847776126d1b' },
  { did: 'did:ethr:0x332661e9e6af65eea6df253296a26257ff304647', privateKey: 'ae945c106dc5538b5dc6acffef7901ef5e30b22c80d7af0a5d466432a49eeb9c' },
]

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
      polygonPaths: [],
      pushToken: this.props.uport.pushToken,
    }
    if (this.props.testUserDid) {
      let fakePushToken = {
        "iat": 1558468854,
        "exp": 1590004854,
        "aud": "did:ethr:0x62e2a07c9ee3925766553dc8b7081061ea46919f",
        "type": "notifications",
        "value": "arn:aws:sns:us-west-2:113196216558:endpoint/GCM/uPort/b782d4a3-f0c3-3b59-a297-68e9fbebad29",
        "iss": this.props.testUserDid
      }
      let cred = R.find(R.propEq("did", this.props.testUserDid))(creds)
      let Cred = new Credentials(cred)
      Cred.createVerification(fakePushToken).then((token) => {
            this.setState({ pushToken: token })
            console.log("set state pushToken to fake", this.state.pushToken)
          })
    }
  }

  mapClicked = (mapProps, map, e) => {
    let lat = e.latLng.lat(), lng = e.latLng.lng()
    this.setState({ markerPosition: { lat, lng  } })
    fetch('http://' + process.env.REACT_APP_ENDORSER_CH_HOST_PORT + `/api/report/tenureClaimsAndConfirmationsAtPoint?lat=${lat}&lon=${lng}`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        "Uport-Push-Token": this.state.pushToken
      }})
      .then(response => {
        if (response.status === 200) {
          return response.json()
        } else {
          throw new Error(response.statusText)
        }
      })
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
      .catch(err => {
        alert("Error retrieving tenures: " + err.message)
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
