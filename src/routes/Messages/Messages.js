import React, { PropTypes, Component } from 'react'
import ThreadList from 'components/ThreadList'
import Thread from 'components/Thread'
import NewThread from 'components/NewThread'
import './Messages.scss'
const { string } = PropTypes

export default class Messages extends Component {
  static propTypes = {

  }

  render () {
    // const { exampleProp } = this.props
    return <div styleName='modal'>
      <div styleName='content'>
        <ThreadList />
      </div>
    </div>
  }
}
