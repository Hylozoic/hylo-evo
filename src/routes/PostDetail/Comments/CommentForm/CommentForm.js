import React, { PropTypes, Component } from 'react'
import './CommentForm.scss'
import RoundImage from 'components/RoundImage'
import Icon from 'components/Icon'
import HyloEditor from 'components/HyloEditor'
const { object, func } = PropTypes

export default class CommentForm extends Component {
  static propTypes = {
    currentUser: object,
    createComment: func
  }

  render () {
    const { currentUser, createComment } = this.props
    const firstName = currentUser.name.split(' ')[0]
    return <div styleName='commentForm' onClick={() => this.setState({open: true})}>
      <div styleName='reply'><Icon name='Home' />Reply</div>
      <div styleName='prompt'>
        <RoundImage url={currentUser.avatarUrl} small styleName='image' />
        <HyloEditor styleName='editor' placeholder={`Hi ${firstName}, what's on your mind?`} />
      </div>

    </div>
  }
}
