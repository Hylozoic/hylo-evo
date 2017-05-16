import React, { PropTypes, Component } from 'react'
import './AllTopics.scss'
const { string } = PropTypes
import FullPageModal from 'routes/FullPageModal'

export default class AllTopics extends Component {
  static propTypes = {
    example: string
  }

  render () {
    return <FullPageModal
      content={<div styleName='exampleName'>
        Topic List goes here.
      </div>} />
  }
}
