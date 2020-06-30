import cx from 'classnames'
import { throttle } from 'lodash'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import HyloEditor from 'components/HyloEditor'
import Icon from 'components/Icon'
import RoundImage from 'components/RoundImage'
import { inIframe } from 'util/index'
import { STARTED_TYPING_INTERVAL } from 'util/constants'

import './CommentForm.scss'

const { object, func, string } = PropTypes

export default class CommentForm extends Component {
  static propTypes = {
    currentUser: object,
    createComment: func,
    className: string,
    placeholderText: string
  }
  constructor (props) {
    super(props)

    this.editor = React.createRef()
  }

  startTyping = throttle((editorState, stateChanged) => {
    if (editorState.getLastChangeType() === 'insert-characters' && stateChanged) {
      this.props.sendIsTyping(true)
    }
  }, STARTED_TYPING_INTERVAL)

  save = text => {
    this.startTyping.cancel()
    this.props.sendIsTyping(false)
    this.props.createComment(text)
  }

  render () {
    const { currentUser, className } = this.props

    const placeholder = currentUser ? `Hi ${currentUser.firstName()}, what's on your mind?` : "Hi! What's on your mind?"

    return <div styleName='commentForm' className={className}
      onClick={() => this.editor.current.focus()}>
      <div styleName={cx('prompt', { 'disabled': !currentUser })}>
        { currentUser
          ? <RoundImage url={currentUser.avatarUrl} small styleName='image' />
          : <Icon name='Person' styleName='anonymous-image' />
        }
        <HyloEditor
          ref={this.editor}
          styleName='editor'
          readOnly={!currentUser}
          onChange={this.startTyping}
          placeholder={placeholder}
          parentComponent={'CommentForm'}
          submitOnReturnHandler={this.save} />

        { !currentUser
          ? <Link to={'/login?returnToUrl=' + encodeURIComponent(window.location.pathname)} target={inIframe() ? '_blank' : ''} styleName='signupButton'>Sign up to reply</Link>
          : ''
        }
      </div>
    </div>
  }
}
