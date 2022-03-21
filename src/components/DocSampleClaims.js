import Markdown from 'markdown-to-jsx';
import React, { Component } from 'react'
import styled from 'styled-components'
import { uportConnect } from '../utilities/uportSetup'

// Sad that @mdx-js/react doesn't work, so gotta include all this inside here.
const content = `

# Sample Claims

## Goodlaw Guardian

![{'@context':'https://schema.org','@type':'Organization','name':'Goodlaw','member':{'@type':'OrganizationRole','roleName':'Guardian','member':{'@type':'Person','identifier':'PUT_USER_DID'}}}](/mobile/qr-goodlaw-guardian.png)

Contents:

\`\`\`
{
'@context':'https://schema.org','@type':'Organization','name':'Goodlaw','member':{'@type':'OrganizationRole','roleName':'Guardian','member':{'@type':'Person','identifier':'PUT_USER_DID'}}
}
\`\`\`




`


const TextBody = styled.div`
  flex: 1 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: left;
  max-width: 80%;
  padding: 20px;
`

const ConnectReqID = 'ConnectRequest'

export default class DocSampleClaims extends Component {

  constructor (props) {
    super(props)
    this.connectUport = this.connectUport.bind(this)
    uportConnect.onResponse(ConnectReqID).then(res => {
      console.log("res.payload", res.payload)
      this.props.actions.connectUport(uportConnect.state)
      this.props.history.push('/signClaim')
    })
  }
  connectUport () {
    const reqObj = { requested: ['name', 'phone', 'country'],
                     notifications: true }
    uportConnect.requestDisclosure(reqObj, ConnectReqID)
  }

  render() {
    return (
      <TextBody>
        <Markdown>{ content }</Markdown>
      </TextBody>
    )
  }
}
