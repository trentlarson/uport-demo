import Markdown from 'markdown-to-jsx';
import React, { Component } from 'react'
import styled from 'styled-components'

const content = `

# Project & Skill Discovery

How do we discover others with certain interests or skills?

Here are a few scenarios:

  1. I want to publish a project, problem, or skill for someone to find it.

  1. I want to find someone with certain interests or skills.

Here are the verbs used for assertions:

  - A person 'knowsAbout' and 'seeks' data, as well as 'homeLocation'. Technically: [schema.org "Person"](https://schema.org/Person)

Hopefully it's clear how to apply those assertions to the scenarios above, available in the app:

  1. Create a [Person](https://schema.org/Person) and include any descriptive words about the project, problem, or skill.

  1. Search for any criteria. If you cannot see them directly, then hopefully the skill or project already exists and someone can connect you together. If no DIDs are visible at all in your search results, that means that nobody visible... neither directly nor in your shared network to introduce you to each other.

##### Other References

- [Daniel Hardman](https://www.linkedin.com/in/danielhardman/) wrote <a href="https://docs.google.com/document/d/1M_PmELevT6uIGIENmZebM1oHFkU8OPTrHqORohGEdjA/edit">a paper about the ideal solutions for discovery</a> (with <a href="https://docs.google.com/presentation/d/1V1kFE_QCrElavfT7mqQFdkMw0eKMn7hbjStrg99vLZ0/edit#slide=id.ga47a6c451a_0_181">an introductory slide deck</a>).

- ["Private Algorithms For The Protected In Social Network Search"](https://www.pnas.org/doi/10.1073/pnas.1510612113) may give hints about privacy-preserving correlations in networks.


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

export default class DocTransactions extends Component {
  render() { return <TextBody><Markdown>{ content }</Markdown></TextBody> }
}
