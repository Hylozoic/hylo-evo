import React, { PropTypes, Component } from 'react'
import './CommentForm.scss'
import RoundImage from 'components/RoundImage'
import HyloEditor from 'components/HyloEditor'
const { object, func } = PropTypes

export default class CommentForm extends Component {
  static propTypes = {
    currentUser: object,
    createComment: func
  }

  render () {
    const { currentUser, createComment } = this.props
    if (!currentUser) return null

    const save = text => {
      console.log('saving', text)
    }

    const firstName = currentUser.name.split(' ')[0]
    const placeholder = `Hi ${firstName}, what's on your mind?`
    return <div styleName='commentForm'>
      <div styleName={'prompt'}>
        <RoundImage url={currentUser.avatarUrl} small styleName='image' />
        <HyloEditor styleName='editor' placeholder={placeholder} submitOnReturnHandler={save} />
      </div>
    </div>
  }
}
