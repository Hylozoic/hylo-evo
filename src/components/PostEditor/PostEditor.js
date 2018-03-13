import PropTypes from 'prop-types'
import React from 'react'
import { get } from 'lodash/fp'
import ReactTooltip from 'react-tooltip'
import cx from 'classnames'
import styles from './PostEditor.scss'
import contentStateToHTML from 'components/HyloEditor/contentStateToHTML'
import Icon from 'components/Icon'
import RoundImage from 'components/RoundImage'
import HyloEditor from 'components/HyloEditor'
import Button from 'components/Button'
import CommunitiesSelector from 'components/CommunitiesSelector'
import LinkPreview from './LinkPreview'
import ChangeImageButton from 'components/ChangeImageButton'
import AttachmentManager from './AttachmentManager'
import { uploadSettings } from './AttachmentManager/AttachmentManager'
import { ANNOUNCEMENT } from './PostEditor.store'
export default class PostEditor extends React.Component {
  static propTypes = {
    initialPrompt: PropTypes.string,
    onClose: PropTypes.func,
    titlePlaceholderForPostType: PropTypes.object,
    detailsPlaceholder: PropTypes.string,
    communityOptions: PropTypes.array,
    currentUser: PropTypes.object,
    currentCommunity: PropTypes.object,
    post: PropTypes.shape({
      id: PropTypes.string,
      type: PropTypes.string,
      title: PropTypes.string,
      details: PropTypes.string,
      linkPreview: PropTypes.object,
      communities: PropTypes.array
    }),
    linkPreviewStatus: PropTypes.string,
    createPost: PropTypes.func,
    updatePost: PropTypes.func,
    pollingFetchLinkPreview: PropTypes.func,
    removeLinkPreview: PropTypes.func,
    clearLinkPreview: PropTypes.func,
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

  buildStateFromProps = ({ editing, loading, currentCommunity, post, topicName }) => {
    const defaultPost = topicName
      ? {...PostEditor.defaultProps.post, details: `<p><a data-entity-type="#mention">#${topicName}</a> </p>`}
      : PostEditor.defaultProps.post

    const defaultPostWithCommunities = Object.assign({}, defaultPost, {
      communities: currentCommunity ? [currentCommunity] : []
    })

    const currentPost = post || defaultPostWithCommunities
    return {
      post: currentPost,
      titlePlaceholder: this.titlePlaceholderForPostType(currentPost.type),
      valid: editing === true // if we're editing, than it's already valid upon entry.
    }
  }

  constructor (props) {
    super(props)
    this.state = this.buildStateFromProps(props)
  }

  componentDidMount () {
    setTimeout(() => {
      this.titleInput.focus()
    }, 100)
  }

  componentDidUpdate (prevProps) {
    const linkPreview = this.props.linkPreview
    if (get('post.id', this.props) !== get('post.id', prevProps)) {
      this.reset(this.props)
      this.editor.focus()
    } else if (linkPreview !== prevProps.linkPreview) {
      this.setState({
        post: {...this.state.post, linkPreview}
      })
    }
  }

  componentWillUnmount () {
    this.props.clearLinkPreview()
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
    if (contentChanged) this.setLinkPreview(editorState.getCurrentContent())
  }

  setLinkPreview = (contentState) => {
    const { pollingFetchLinkPreview, linkPreviewStatus, clearLinkPreview } = this.props
    const { linkPreview } = this.state.post
    if (!contentState.hasText() && linkPreviewStatus) return clearLinkPreview()
    if (linkPreviewStatus === 'invalid' || linkPreviewStatus === 'removed') return
    if (linkPreview) return
    pollingFetchLinkPreview(contentStateToHTML(contentState))
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
      communities.length > 0)
  }

  setValid = () => this.setState({valid: this.isValid()})

  save = () => {
    const { editing, createPost, updatePost, onClose, goToPost, images, files } = this.props
    const { id, type, title, communities, linkPreview } = this.state.post
    const details = this.editor.getContentHTML()
    const postToSave = {
      id, type, title, details, communities, linkPreview, imageUrls: images, fileUrls: files
    }
    const saveFunc = editing ? updatePost : createPost
    saveFunc(postToSave).then(editing ? onClose : goToPost)
  }

  buttonLabel = () => {
    const { postPending, editing } = this.props
    if (postPending) return 'Posting...'
    if (editing) return 'Save'
    return 'Post'
  }

  render () {
    const { titlePlaceholder, valid, post } = this.state
    const { id, title, details, communities, linkPreview } = post
    const {
      onClose, initialPrompt, detailsPlaceholder,
      currentUser, communityOptions, loading, addImage,
      showImages, addFile, showFiles, setPostType, announcementSelected,
      communityMembersCount
    } = this.props

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
            value={title || ''}
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
            parentComponent={'PostEditor'}
            ref={component => { this.editor = component && component.getWrappedInstance() }}
          />
        </div>
      </div>
      {linkPreview &&
        <LinkPreview linkPreview={linkPreview} onClose={this.removeLinkPreview} />}
      <AttachmentManager postId={id || 'new'} type='image' />
      <AttachmentManager postId={id || 'new'} type='file' />
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
        <ActionsBar
          id={id}
          addImage={addImage}
          showImages={showImages}
          addFile={addFile}
          showFiles={showFiles}
          valid={valid}
          loading={loading}
          submitButtonLabel={this.buttonLabel()}
          save={() => this.save()}
          setPostType={setPostType}
          announcementSelected={announcementSelected}
        />
      </div>
    </div>
  }
}

export function ActionsBar ({id, addImage, showImages, addFile, showFiles, valid, loading, submitButtonLabel, save, setPostType, announcementSelected}) {
  return <div styleName='actionsBar'>
    <div styleName='actions'>
      <ChangeImageButton update={addImage}
        uploadSettings={uploadSettings(id)}
        attachmentType='image'
        disable={showImages}>
        <Icon name='AddImage'
          styleName={cx('action-icon', {'highlight-icon': showImages})} />
      </ChangeImageButton>
      <ChangeImageButton update={addFile}
        uploadSettings={uploadSettings(id)}
        attachmentType='file'
        disable={showFiles}>
        <Icon name='Paperclip'
          styleName={cx('action-icon', {'highlight-icon': showFiles})} />
      </ChangeImageButton>
      <span data-tip='Send Annoucnment' data-for='announcement-tt'>
        <Icon name='Paperclip'
          onClick={() => setPostType(announcementSelected ? null : ANNOUNCEMENT)}
          styleName={cx('action-icon', {'highlight-icon': announcementSelected})}
        />
      </span>
      <ReactTooltip
        effect={'solid'}
        delayShow={550}
        id='announcement-tt' />
    </div>
    <Button
      onClick={save}
      disabled={!valid || loading}
      styleName='postButton'
      label={submitButtonLabel}
      color='green'
    />
  </div>
}
