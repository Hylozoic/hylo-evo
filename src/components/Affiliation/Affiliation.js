import React from 'react'
import './Affiliation.scss'

export default function Affiliation ({ affiliation, index, archive }) {
  const { role, preposition, orgName, url } = affiliation

  return (
    <div styleName={`affiliation ${index % 2 === 0 ? 'even' : 'odd'}`}>
      <div styleName='role'>{role}</div>
      <div>{preposition}</div>
      <div styleName='orgName'>{url ? (<a href={url} target='new'>{orgName}</a>) : orgName }</div>

      { archive && <span onClick={() => archive(affiliation.id)} styleName='leave-button'>Delete</span> }
    </div>
  )
}
