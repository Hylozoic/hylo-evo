import React from 'react'

import Icon from 'components/Icon'
import PeopleSelector from 'components/PeopleSelector'
import './NewMessageThread.scss'

export default class NewMessageThread extends React.Component {
  static propTypes = {
  }

  render () {
    return <div styleName='new-message-thread'>
      <div styleName='thread-header' tabIndex='0'>
        <PeopleSelector matches={this.props.participants} />
        <Icon name='Ex' styleName='close-button' />
      </div>
    </div>
  }
}
