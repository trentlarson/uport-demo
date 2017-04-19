// Frameworks
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as AppActions from './actions/AppActions'

// Components
import Welcome from './components/Welcome'
import AppHeader from './components/AppHeader'
import AppBanner from './components/AppBanner'
import Chart from './components/Chart'
import SharesBox from './components/SharesBox'
import SignInModal from './components/SignInModal'

class App extends Component {
  render () {
    console.log(this)

    return (
      <div className='App'>
        <AppHeader />
        <AppBanner />
        <div className='App-body'>
          <div className='App-body-inner-wrap'>
            {
              !this.props.uport
                ? <Welcome />
                : (
                  <section>
                    <Chart />
                    <SharesBox />
                  </section>
                )
            }
            {
              this.props.modal
                ? <SignInModal />
                : null
            }
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, props) => {
  return {
    uport: state.App.uport,
    modal: state.App.modal
  }
}
const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(AppActions, dispatch) }
}
export default connect(mapStateToProps, mapDispatchToProps)(App)
