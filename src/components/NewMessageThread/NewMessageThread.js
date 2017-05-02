import React from 'react'
import PeopleSelector from 'components/PeopleSelector'
import CloseMessages from 'components/Thread/CloseMessages'
import './NewMessageThread.scss'

export default class NewMessageThread extends React.Component {
  static propTypes = {
  }

  render () {
    return <div styleName='new-message-thread'>
      <div styleName='thread-header' tabIndex='0'>
        <PeopleSelector matches={this.props.participants} />
        <CloseMessages />
      </div>
    </div>
  }
}
