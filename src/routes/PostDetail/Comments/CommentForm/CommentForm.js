import React, { PropTypes, Component } from 'react'
import './CommentForm.scss'
import RoundImage from 'components/RoundImage'
import Icon from 'components/Icon'
const { string, func } = PropTypes

export default class CommentForm extends Component {
  static propTypes = {
    currentUser: string,
    createComment: func
  }

  constructor (props) {
    super(props)
    this.state = {open: false}
  }

  render () {
    const { currentUser, createComment } = this.props
    const { open } = this.state
    const firstName = currentUser.name.split(' ')[0]
    return <div styleName='commentForm' onClick={() => this.setState({open: !open})}>
      <div styleName='reply'><Icon name='Home' />Reply</div>
      {!open && <div styleName='prompt'>
        <RoundImage url={currentUser.avatarUrl} small styleName='avatar' />
        Hi {firstName}, what's on your mind?
      </div>}
      {open && <div>FORM</div>}
    </div>
  }
}
