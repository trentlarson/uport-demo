import Markdown from 'markdown-to-jsx';
import React, { Component } from 'react'
import styled from 'styled-components'

const content = `

# Z4A Pledges

  * [Mutual Integrity](/demo-mobile/qr-pledge-mutual-integrity.png)

  * [Transparency](/demo-mobile/qr-pledge-transparency.png)

  * [All-Win Goals](/demo-mobile/qr-pledge-all-win-goals.png)

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

export default class DocPledge extends Component {
  render() { return <TextBody><Markdown>{ content }</Markdown></TextBody> }
}
