import Markdown from 'markdown-to-jsx';
import React, { Component } from 'react'
import styled from 'styled-components'

const content = `

# Membership and Pledges

How can we show that someone has authorization, or has shown agreement to conditions?

Here are a few scenarios:

1. I want to take a pledge about policing.

1. I want to record membership for my users.

The verbs used in these are "Accept" & "Agree", along with a text description of the pledge. Technically: schema.org ["AcceptAction"](https://schema.org/AcceptAction) and ["AgreeAction"](https://schema.org/AgreeAction)

So we can apply that to the scenarios above, available in the app:

1. Sign a "Pledge" commitment (which creates an "AcceptAction").

1. Confirm someone else's pledge or claim (which creates a "ConfirmAction").

If you're looking for confirmation from people other than youself, hopefully you'll see those with a search in the app. If not, there's no good way to confirm for yourself... you need to be connected somehow.

##### Outside Work

  - The [Thick Red Line](https://thickredline.org/) aims to build membership inside police departments with a simple pledge (regarding victimless crimes -- see [page 3 here](https://thickredline.org/wp-content/uploads/2020/10/The_Police_and_Sheriffs_Dept_Starter_Pack_Handbook-1.pdf)).


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
