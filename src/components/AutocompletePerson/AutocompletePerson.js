import React from 'react'
import './AutocompletePerson.scss'

const { string } = React.PropTypes

export default function AutocompletePerson ({ exampleProp }) {
  return <div styleName='exampleName'>Select A Person</div>
}
AutocompletePerson.propTypes = {
  exampleProp: string
}
