import React, { PropTypes } from 'react'
import { get } from 'lodash/fp'
import cx from 'classnames'
import styles from './PostEditor.scss'
import Icon from 'components/Icon'
import Avatar from 'components/Avatar'
import HyloEditor from 'components/HyloEditor'
import Button from 'components/Button'
import CommunitiesSelector from 'components/CommunitiesSelector'

export default class PostEditor extends React.Component {
  static propTypes = {
    initialPrompt: PropTypes.string,
    onClose: PropTypes.func,
    titlePlaceholderForPostType: PropTypes.object,
    detailsPlaceholder: PropTypes.string,
    communityOptions: PropTypes.array,
    post: PropTypes.shape({
      id: PropTypes.string,
      type: PropTypes.string,
      title: PropTypes.string,
      details: PropTypes.string,
      communities: PropTypes.array
    }),
    createPost: PropTypes.func,
    updatePost: PropTypes.func,
    loading: PropTypes.bool,
    editing: PropTypes.bool
  }

  static defaultProps = {
    initialPrompt: 'What are you looking to post?',
    titlePlaceholderForPostType: {
      offer: 'What super powers can you offer?',
      default: 'What’s on your mind?'
    },
    detailsPlaceholder: 'Add details...',
    post: {
      type: 'discussion',
      title: '',
      details: '',
      communities: []
    },
    loading: false,
    editing: false
  }

  buildStateFromProps = ({ post }) => {
    const defaultedPost = post || PostEditor.defaultProps.post
    return {
      post: defaultedPost,
      titlePlaceholder: this.titlePlaceholderForPostType(defaultedPost.type),
      valid: false
    }
  }

  constructor (props) {
    super(props)
    this.state = this.buildStateFromProps(props)
  }

  componentDidUpdate (prevProps) {
    if (get('post.id', this.props) !== get('post.id', prevProps)) {
      this.reset(this.props)
      this.editor.focus()
    }
  }

  reset = (props) => {
    this.editor.reset()
    this.communitiesSelector.reset()
    this.setState(this.buildStateFromProps(props))
  }

  focus = () => this.editor && this.editor.focus()

  handlePostTypeSelection = event => {
    const type = event.target.textContent.toLowerCase()
    this.setState({
      post: {...this.state.post, type},
      titlePlaceholder: this.titlePlaceholderForPostType(type),
      valid: this.isValid({ type })
    })
  }

  titlePlaceholderForPostType (type) {
    const { titlePlaceholderForPostType } = this.props
    return titlePlaceholderForPostType[type] || titlePlaceholderForPostType['default']
  }

  postTypeButtonProps = (forPostType) => {
    const { loading } = this.props
    const { type } = this.state.post
    const active = type === forPostType
    const className = cx(
      styles['postType'],
      styles[`postType-${forPostType}`],
      {
        [styles[`active`]]: active,
        [styles[`selectable`]]: !loading && !active
      }
    )
    return {
      label: forPostType,
      onClick: this.handlePostTypeSelection,
      disabled: loading,
      color: '',
      className
    }
  }

  handleTitleChange = (event) => {
    const title = event.target.value
    this.setState({
      post: {...this.state.post, title},
      valid: this.isValid({ title })
    })
  }

  setSelectedCommunities = communities => {
    this.setState({
      post: {...this.state.post, communities},
      valid: this.isValid({ communities })
    })
  }

  isValid = (postUpdates = {}) => {
    const { type, title, communities } = Object.assign({}, this.state.post, postUpdates)
    return !!(this.editor &&
      communities &&
      type.length > 0 &&
      title.length > 0 &&
      !this.editor.isEmpty() &&
      communities.length > 0)
  }

  setValid = () =>
    this.setState({valid: this.isValid()})

  save = () => {
    const { editing, createPost, updatePost, onClose } = this.props
    const { type, title, communities } = this.state.post
    const details = this.editor.getContentHTML()
    const postToSave = { type, title, details, communities }
    console.log('!!postToSave!!', postToSave)
    const saveFun = editing ? updatePost : createPost
    saveFun(postToSave).then(onClose)
  }

  render () {
    const { titlePlaceholder, valid, post } = this.state
    if (!post) return null
    const { title, details, communities } = post
    const { onClose, initialPrompt, detailsPlaceholder, communityOptions, loading, editing } = this.props
    const submitButtonLabel = editing ? 'Save' : 'Post'
    return <div styleName='wrapper' ref={element => { this.wrapper = element }}>
      <div styleName='header'>
        <div styleName='initial'>
          <div styleName='initial-prompt'>{initialPrompt}</div>
          <a styleName='initial-closeButton' onClick={onClose}><Icon name='Ex' /></a>
        </div>
        <div styleName='postTypes'>
          <Button {...this.postTypeButtonProps('discussion')} />
          <Button {...this.postTypeButtonProps('request')} />
          <Button {...this.postTypeButtonProps('offer')} />
        </div>
      </div>
      <div styleName='body'>
        <div styleName='body-column'>
          <Avatar
            medium
            styleName='titleAvatar'
            url=''
            avatarUrl='https://d3ngex8q79bk55.cloudfront.net/user/13986/avatar/1444260480878_AxolotlPic.png'
          />
        </div>
        <div styleName='body-column'>
          <input
            type='text'
            styleName='titleInput'
            placeholder={titlePlaceholder}
            value={title}
            onChange={this.handleTitleChange}
            disabled={loading}
          />
          <HyloEditor
            styleName='editor'
            placeholder={detailsPlaceholder}
            onChange={this.setValid}
            contentHTML={details}
            readOnly={loading}
            ref={component => { this.editor = component && component.getWrappedInstance() }}
          />
        </div>
      </div>
      <div styleName='footer'>
        <div styleName='postIn'>
          <div styleName='postIn-label'>Post in</div>
          <div styleName='postIn-communities'>
            <CommunitiesSelector
              options={communityOptions}
              selected={communities}
              onChange={this.setSelectedCommunities}
              readOnly={loading}
              ref={component => { this.communitiesSelector = component }}
            />
          </div>
        </div>
        <div styleName='actionsBar'>
          <Button
            onClick={this.save}
            disabled={!valid || loading}
            styleName='postButton'
            label={submitButtonLabel}
            color='green'
          />
        </div>
      </div>
    </div>
  }
}
