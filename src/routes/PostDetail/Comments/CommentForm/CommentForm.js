import React, { PropTypes, Component } from 'react'
import './CommentForm.scss'
import RoundImage from 'components/RoundImage'
import Icon from 'components/Icon'
import HyloEditor from 'components/HyloEditor'
import cx from 'classnames'
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
    console.log('open', open)
    const close = () => {
      console.log('closing')
      this.setState({open: false})
    }
    const firstName = currentUser.name.split(' ')[0]
    const placeholder = `Hi ${firstName}, what's on your mind?`
    return <div styleName={cx('commentForm', {'commentForm--open': open})} onClick={() => !open && this.setState({open: true})}>
      <div styleName='reply'><Icon name='Reply' styleName='icon' />Reply</div>
      <div styleName={cx('prompt', {'prompt--open': open})}>
        <RoundImage url={currentUser.avatarUrl} small styleName='image' />
        {!open && <span styleName='placeholder'>{placeholder}</span>}
        {open && <HyloEditor styleName='editor' placeholder={placeholder} />}
      </div>
      {open && <div styleName='buttons'>
        <span styleName='cancel-button' onClick={close}>Cancel</span>
        <span styleName='post-button' onClick={() => this.setState({open: false})}>Post</span>
      </div>}
    </div>
  }
}
