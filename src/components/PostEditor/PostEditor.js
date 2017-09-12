import React, { PropTypes } from 'react'
import { get, isEmpty } from 'lodash/fp'
import cx from 'classnames'
import styles from './PostEditor.scss'
import contentStateToHTML from 'components/HyloEditor/contentStateToHTML'
import Icon from 'components/Icon'
import RoundImage from 'components/RoundImage'
import HyloEditor from 'components/HyloEditor'
import Button from 'components/Button'
import CommunitiesSelector from 'components/CommunitiesSelector'
import Loading from 'components/Loading'
import LinkPreview from './LinkPreview'
import { bgImageStyle } from 'util/index'
import { DragDropContext, DragSource, DropTarget } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import ChangeImageButton from 'components/ChangeImageButton'

const uploadSettings = id => ({
  type: 'post',
  id: id || 'new'
})

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

  buildStateFromProps = ({ editing, loading, currentCommunity, post }) => {
    const defaultPost = Object.assign({}, PostEditor.defaultProps.post, {
      communities: currentCommunity ? [currentCommunity] : []
    })
    const currentPost = post || defaultPost
    return {
      post: currentPost,
      titlePlaceholder: this.titlePlaceholderForPostType(currentPost.type),
      valid: false
    }
  }

  constructor (props) {
    super(props)
    this.state = this.buildStateFromProps(props)
  }

  componentDidMount () {
    this.titleInput.focus()
    this.props.loadImagePreviews()
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

  componentWillReceiveProps (nextProps) {
    if ((!isEmpty(this.props.imagePreviews) && this.props.imagePreviews !== nextProps.imagePreviews) ||
      nextProps.uploadImagePending) {
      this.setValid()
    }
  }

  componentWillUnmount () {
    this.props.clearLinkPreview()
    this.props.clearImagePreviews()
  }

  reset = (props) => {
    this.editor.reset()
    this.communitiesSelector.reset()
    this.setState(this.buildStateFromProps(props))
    this.props.loadImagePreviews()
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
      !this.editor.isEmpty() &&
      communities.length > 0)
  }

  setValid = () =>
    this.setState({valid: this.isValid()})

  save = () => {
    const { editing, createPost, updatePost, onClose, goToPost, imagePreviews } = this.props
    const { id, type, title, communities, linkPreview } = this.state.post
    const details = this.editor.getContentHTML()
    const postToSave = {
      id, type, title, details, communities, linkPreview, imageUrls: imagePreviews
    }
    const saveFunc = editing ? updatePost : createPost
    saveFunc(postToSave).then(editing ? onClose : goToPost)
  }

  render () {
    const { titlePlaceholder, valid, post } = this.state
    const { id, title, details, communities, linkPreview } = post
    const {
      onClose, initialPrompt, detailsPlaceholder,
      currentUser, communityOptions, editing, loading, addImagePreview,
      imagePreviews, removeImagePreview, switchImagePreviews, showImagePreviews,
      uploadImagePending
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
            ref={component => { this.editor = component && component.getWrappedInstance() }}
          />
          {linkPreview &&
            <LinkPreview linkPreview={linkPreview} onClose={this.removeLinkPreview} />}
        </div>
      </div>
      <ImagePreviews
        id={id || 'new'}
        showImagePreviews={showImagePreviews}
        imagePreviews={imagePreviews}
        uploadImagePending={uploadImagePending}
        addImage={addImagePreview}
        removeImage={removeImagePreview}
        switchImages={switchImagePreviews}
        setValid={() => this.setValid()} />
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
          addImage={addImagePreview}
          showImagePreviews={showImagePreviews}
          valid={valid}
          loading={loading}
          submitButtonLabel={submitButtonLabel}
          save={() => this.save()} />
      </div>
    </div>
  }
}

export const ImagePreviews = DragDropContext(HTML5Backend)(
class ImagePreviews extends React.Component {
  render () {
    const { id, showImagePreviews, imagePreviews, uploadImagePending, addImage, removeImage, switchImages } = this.props
    if (!showImagePreviews) return null

    return <div styleName='image-preview-section'>
      <div styleName='section-label'>Images</div>
      <div styleName='image-previews'>
        {imagePreviews.map((url, i) =>
          <ImagePreview url={url} removeImage={removeImage} switchImages={switchImages} key={i} position={i} />)}
        {uploadImagePending && <div styleName='add-image'><Loading /></div>}
        <ChangeImageButton update={addImage}
          uploadSettings={uploadSettings(id)}>
          <div styleName='add-image'>+</div>
        </ChangeImageButton>
      </div>
    </div>
  }
})

const imagePreviewSource = {
  beginDrag (props) {
    return {
      position: props.position
    }
  }
}

const imagePreviewTarget = {
  drop (props, monitor, component) {
    const item = monitor.getItem()
    props.switchImages(props.position, item.position)
  }
}

export const ImagePreview = DropTarget('ImagePreview', imagePreviewTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget()
}))(
DragSource('ImagePreview', imagePreviewSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  connectDragPreview: connect.dragPreview(),
  isDragging: monitor.isDragging()
}))(
class ImagePreview extends React.Component {
  render () {
    const {
      url, removeImage, connectDragSource, connectDragPreview, connectDropTarget, position
    } = this.props

    return connectDropTarget(connectDragSource(<div styleName='image-preview'>
      <div style={bgImageStyle(url)} styleName='image'>
        <Icon name='Ex' styleName='remove-button' onClick={() => removeImage(position)} />
        {connectDragPreview(<div styleName='drag-preview' />)}
      </div>
    </div>))
  }
}))

export function ActionsBar ({id, addImage, showingImagePreviews, valid, loading, submitButtonLabel, save}) {
  const addImageIcon = <Icon name='AddImage'
    styleName={cx('action-icon', {'highlight-icon': showingImagePreviews})} />

  return <div styleName='actionsBar'>
    <div styleName='actions'>
      {showingImagePreviews
        ? addImageIcon
        : <ChangeImageButton update={addImage}
          uploadSettings={uploadSettings(id)}>
          {addImageIcon}
        </ChangeImageButton>}

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
