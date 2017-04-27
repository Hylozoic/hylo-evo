import React from 'react'

import PeopleSelector from 'components/PeopleSelector'
import './NewMessageThread.scss'

export default class NewMessageThread extends React.Component {
  static propTypes = {
  }

  render () {
    return <div>
      <PeopleSelector />
    </div>
  }
}
