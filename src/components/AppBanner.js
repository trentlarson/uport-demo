// Frameworks
import React, { Component } from 'react'

class AppBanner extends Component {
  render () {
    return (
      <div className='App-banner'>
        <div className='warning-banner slideInDown animated'>
          <b>This demo currently only works on the revived ROPSTEN network.</b>
        </div>
      </div>
    )
  }
}

export default AppBanner
