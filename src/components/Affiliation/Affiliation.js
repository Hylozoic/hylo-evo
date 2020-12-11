import React from 'react'
import './Affiliation.scss'

export default function Affiliation ({ affiliation, className }) {
  const { orgName, role, url } = affiliation
  return (
    <div styleName={`affiliation ${className}`}>
      <div styleName='role'>{role}</div> at <div styleName='orgName'>{url ? (<a href={url}>{orgName}</a>) : orgName }</div>
    </div>
  )
}
