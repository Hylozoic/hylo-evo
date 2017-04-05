import React from 'react'
import './UserProfile.scss'

const { string } = React.PropTypes

export default function UserProfile ({ exampleProp }) {
  return <div styleName='exampleName'>{exampleProp}</div>
}
UserProfile.propTypes = {
  exampleProp: string
}
