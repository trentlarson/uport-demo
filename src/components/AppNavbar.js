// Frameworks
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter, Link } from 'react-router-dom'

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
  text-decoration: none;
`
const DemoText = styled.span`
  font-weight: bold;
  text-decoration: none
`

const LeftArea = styled.div`
  display: block;
  text-decoration: none
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

const UportAvatar = styled.img`
  display: inline-block;
  vertical-align: middle;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  border: 2px solid white;
`

class AppNavbar extends Component {
  render () {
    return (
      <NavBar>
        <Link to="/">
        <LeftArea>
          <LogoLink >uport</LogoLink>
          <span> | </span>
          <DemoText>Demo</DemoText>
        </LeftArea>
        </Link>

        <RightArea>
          {
            this.props.uport !== null &&
            this.props.uport !== undefined &&
            this.props.uport.avatar
              ? (
                <UportAvatarWrap>
                  <UserName>{this.props.uport.name}</UserName>
                  <UportAvatar alt='user-img' src={this.props.uport.avatar.uri} />
                </UportAvatarWrap>
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
