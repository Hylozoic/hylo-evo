import React, { PropTypes } from 'react'
import { get } from 'lodash/fp'
import cx from 'classnames'
import linkMatcher from 'util/linkMatcher'
import styles from './PostEditor.scss'
import contentStateToHTML from 'components/HyloEditor/contentStateToHTML'
import Icon from 'components/Icon'
import RoundImage from 'components/RoundImage'
import HyloEditor from 'components/HyloEditor'
import Button from 'components/Button'
import CommunitiesSelector from 'components/CommunitiesSelector'
import LinkPreview from './LinkPreview'

export default class PostEditor extends React.Component {
  static propTypes = {
    initialPrompt: PropTypes.string,
    onClose: PropTypes.func,
    titlePlaceholderForPostType: PropTypes.object,
    detailsPlaceholder: PropTypes.string,
    communityOptions: PropTypes.array,
    currentUser: PropTypes.object,
    post: PropTypes.shape({
      id: PropTypes.string,
      type: PropTypes.string,
      title: PropTypes.string,
      details: PropTypes.string,
      communities: PropTypes.array
    }),
    linkPreviewIdOrStatus: PropTypes.string,
    createPost: PropTypes.func,
    updatePost: PropTypes.func,
    fetchLinkPreview: PropTypes.func,
    removeLinkPreview: PropTypes.func,
    resetLinkPreview: PropTypes.func,
    goToPost: PropTypes.func,
    editing: PropTypes.bool,
    loading: PropTypes.bool
  }

  static defaultProps = {
    initialPrompt: 'What are you looking to post?',
    titlePlaceholderForPostType: {
      offer: 'What super powers can you offer?',
      request: 'What are you looking for help with?',
      default: 'What’s on your mind?'
    },
    detailsPlaceholder: 'Add a description',
    post: {
      type: 'discussion',
      title: '',
      details: '',
      communities: []
    },
    editing: false,
    loading: false
  }

  buildStateFromProps = ({ post }) => {
    const defaultedPost = Object.assign({}, PostEditor.defaultProps.post, post)
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

  componentDidMount () {
    this.titleInput.focus()
  }

  componentDidUpdate (prevProps) {
    if (get('post.id', this.props) !== get('post.id', prevProps)) {
      this.reset(this.props)
      this.editor.focus()
    }
    if (get('post.linkPreview', this.props) !== get('post.linkPreview', prevProps)) {
      this.setState({ post: this.props.post })
    }
  }

  componentWillUnmount () {
    this.removeLinkPreview()
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

  handleDetailsChange = (editorState, contentChanged) => {
    this.setValid()
    if (contentChanged) {
      const contentState = editorState.getCurrentContent()
      const { resetLinkPreview } = this.props
      if (!contentState.hasText()) resetLinkPreview()
      this.setLinkPreview(contentState)
    }
  }

  setLinkPreview = (contentState) => {
    const contentStateHTML = contentStateToHTML(contentState)
    const { fetchLinkPreview, linkPreviewIdOrStatus } = this.props
    const { linkPreview } = this.state.post
    if (linkPreview) return
    if (linkPreviewIdOrStatus === 'removed') return
    // LEJ: I'd prefer to handle this stuff somewhere in the store...
    const poll = (url, delay) => {
      if (delay > 4) return
      fetchLinkPreview(url).then(value => {
        if (!value) return
        const { title } = value.meta.extractModel.getRoot(value.payload.data)
        if (!title) {
          setTimeout(() => poll(url, delay * 2), delay * 1000)
        }
      })
    }
    if (linkMatcher.test(contentStateHTML)) {
      const urlMatch = linkMatcher.match(contentStateHTML)[0].url
      poll(urlMatch, 0.5)
    }
  }

  removeLinkPreview = () => {
    this.props.removeLinkPreview()
    this.setState({
      post: {...this.state.post, linkPreview: null}
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
    const { editing, createPost, updatePost, onClose, goToPost } = this.props
    const { id, type, title, communities, linkPreview } = this.state.post
    const details = this.editor.getContentHTML()
    const postToSave = { id, type, title, details, communities, linkPreview }
    const saveFunc = editing ? updatePost : createPost
    saveFunc(postToSave).then(editing ? onClose : goToPost)
  }

  render () {
    const { titlePlaceholder, valid, post } = this.state
    if (!post) return null
    const { title, details, communities, linkPreview } = post
    const {
      onClose, initialPrompt, detailsPlaceholder,
      currentUser, communityOptions, editing, loading
    } = this.props
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
          <RoundImage
            medium
            styleName='titleAvatar'
            url={currentUser && currentUser.avatarUrl}
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
            ref={x => { this.titleInput = x }}
          />
          <HyloEditor
            styleName='editor'
            placeholder={detailsPlaceholder}
            onChange={this.handleDetailsChange}
            contentHTML={details}
            readOnly={loading}
            ref={component => { this.editor = component && component.getWrappedInstance() }}
          />
          {linkPreview &&
            <LinkPreview linkPreview={linkPreview} onClose={this.removeLinkPreview} />}
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
