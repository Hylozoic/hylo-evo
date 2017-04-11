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

  constructor (props) {
    super(props)
    this.state = {open: false}
  }

  render () {
    const { currentUser, createComment } = this.props
    const { open } = this.state
    const firstName = currentUser.name.split(' ')[0]
    return <div styleName='commentForm' onClick={() => this.setState({open: true})}>
      <div styleName='reply'><Icon name='Home' />Reply</div>
      <div styleName='prompt'>
        <RoundImage url={currentUser.avatarUrl} small styleName='image' />
        {!open && `Hi ${firstName}, what's on your mind?`}
        {open && <HyloEditor styleName='editor' placeholder='This Part Needs Design Help' debug />}
      </div>

    </div>
  }
}
