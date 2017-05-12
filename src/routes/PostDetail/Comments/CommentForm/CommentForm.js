import React, { PropTypes, Component } from 'react'
import './CommentForm.scss'
import RoundImage from 'components/RoundImage'
import HyloEditor from 'components/HyloEditor'
import { firstName } from 'store/models/Person'
const { object, func, string } = PropTypes

export default class CommentForm extends Component {
  static propTypes = {
    currentUser: object,
    createComment: func,
    className: string
  }

  render () {
    const { currentUser, className, createComment } = this.props
    if (!currentUser) return null

    const save = text => {
      createComment(text)
    }

    const placeholder = `Hi ${firstName(currentUser)}, what's on your mind?`
    return <div styleName='commentForm' className={className}>
      <div styleName={'prompt'}>
        <RoundImage url={currentUser.avatarUrl} small styleName='image' />
        <HyloEditor styleName='editor' placeholder={placeholder} submitOnReturnHandler={save} />
      </div>
    </div>
  }
}
