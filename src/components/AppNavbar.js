// Frameworks
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter, Link } from 'react-router-dom'
import { uportConnect } from '../utilities/uportSetup'
import { getUserDid, getUserName } from '../utilities/claimsTest'

// Actions
import * as AppActions from '../actions/AppActions'

import styled from 'styled-components'

const NavBar = styled.nav`
  color: #FFFFFF;
  padding: 20px 40px;
  font-size: 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`
const LogoLink = styled.a`
  color: #FFFFFF;
  text-decoration: underline;
`
const DemoText = styled.span`
  font-weight: bold;
`

const LeftArea = styled.div`
  display: block;
`
const RightArea = styled.div`
  display: block;
  text-align: left;
`

const UportAvatarWrap = styled.div`
`

const UserName = styled.span`
  display: inline-block;
  vertical-align: middle;
  font-size: 18px;
  color: white;
  text-align: right;
  margin-right: 1em;
`

// const UportAvatar = styled.img`
//   display: inline-block;
//   vertical-align: middle;
//   border-radius: 50%;
//   width: 50px;
//   height: 50px;
//   border: 2px solid white;
// `

class AppNavbar extends Component {

  constructor (props) {
    super(props)
    this.logout = this.logout.bind(this)
  }

  logout () {
    uportConnect.logout()
    this.props.actions.connectUport(uportConnect.state)
    this.props.history.push('/logout')
  }

  render () {
    return (
      <NavBar>
        <Link to="/">
        <LeftArea>
          <DemoText>Home</DemoText>
        </LeftArea>
        </Link>

        <RightArea>
          {
            getUserDid() || (this.props.uport && this.props.uport.name)
              ? (<div>
                <UportAvatarWrap>
                  <UserName>{getUserName(this.props)}</UserName>
                </UportAvatarWrap>
                <LogoLink onClick={this.logout}>
                  Logout
                </LogoLink>
                </div>
              )
              : null
          }
        </RightArea>
      </NavBar>
    )
  }
}

// AppNavbar.propTypes = {
//   uport: React.PropTypes.object
// }

function mapStateToProps (state, props) {
  return { uport: state.App.uport }
}
function mapDispatchToProps (dispatch) {
  return { actions: bindActionCreators(AppActions, dispatch) }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AppNavbar))
