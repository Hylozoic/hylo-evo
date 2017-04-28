import React from 'react'
import { values } from 'lodash'
import './PeopleTyping.scss'
const { string, object } = React.PropTypes

function PeopleTyping ({className, peopleTyping}) {
  const names = values(peopleTyping).map(v => v.name)
  return names.length ? <div styleName='typing' className={className}>
    {names.length === 1 && <div>
      {names[0]} is typing...
    </div>}
    {names.length > 1 && <div>Multiple people are typing...</div>}
    &nbsp;
  </div> : null
}
PeopleTyping.propTypes = {
  className: string,
  peopleTyping: object
}

export default PeopleTyping
