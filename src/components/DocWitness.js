import Markdown from 'markdown-to-jsx';
import React, { Component } from 'react'
import styled from 'styled-components'

const content = `

# Witness -- for example: Gratitude

How can we share with someone a signed record of seeing them, revealing our gratitude such that they can see and appreciate the recognition but without making it fully public?

  * Declare an "Event" about an "agent", with a "description" of what happened. Technically: [Event by Bio Vocabulary](https://vocab.org/bio/#event)

  * Other possibilities include:

    * ["WatchAction" by schema.org](https://schema.org/WatchAction) is meant for watching media (eg. a movie).

    * ["Observation" by the W3c Sensor Ontology](https://www.w3.org/TR/vocab-ssn/#SOSAObservation) is close but meant for mechanical devices,

    * ["Witness" by the Library of Congress](https://id.loc.gov/vocabulary/relators/wit.html) is for voices in media

    * Unfortunately, most of the other ["observe" actions at LOV](https://lov.linkeddata.es/dataset/lov/terms?q=observe) are no longer active.

Soon we'll allow for encrypted content, so that only the recipient will be able to see the statement.

Note that the open nature of this service allows for negative expressions as well; that feedback is usually more appropriate in different channels. Someday we hope to provide ways for individuals to filter such things, but for now we simply recognize that there are infinite ways abuse others and we won't proactively shut down channels, prefering to allow freedom until the problem arises.

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

export default class DocWitness extends Component {
  render() { return <TextBody><Markdown>{ content }</Markdown></TextBody> }
}
