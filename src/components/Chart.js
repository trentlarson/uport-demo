// Frameworks
import React, { Component } from 'react'

// Assets
import chart from '../chart.png'

class Chart extends Component {
  render () {
    return (<img alt='chart' src={chart} style={{maxWidth: '100%'}} />)
  }
}

export default Chart
