import PropTypes from 'prop-types'
import React from 'react'
import ReactTooltip from 'react-tooltip'
import { get, isEqual, throttle } from 'lodash/fp'
import cx from 'classnames'
import styles from './PostEditor.scss'
import contentStateToHTML from 'components/HyloEditor/contentStateToHTML'
import Icon from 'components/Icon'
import RoundImage from 'components/RoundImage'
import HyloEditor from 'components/HyloEditor'
import Button from 'components/Button'
import CommunitiesSelector from 'components/CommunitiesSelector'
import TopicSelector from 'components/TopicSelector'
import LinkPreview from './LinkPreview'
import ChangeImageButton from 'components/ChangeImageButton'
import SendAnnouncementModal from 'components/SendAnnouncementModal'
import AttachmentManager from './AttachmentManager'
import { uploadSettings } from './AttachmentManager/AttachmentManager'
import cheerio from 'cheerio'
import { TOPIC_ENTITY_TYPE } from 'hylo-utils/constants'
import { MAX_TITLE_LENGTH } from './PostEditor.store'

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

  buildStateFromProps = ({ editing, loading, currentCommunity, post, topic, announcementSelected }) => {
    const defaultPostWithCommunitiesAndTopic = Object.assign({}, PostEditor.defaultProps.post, {
      communities: currentCommunity ? [currentCommunity] : [],
      topics: topic ? [topic] : [],
      detailsTopics: []
    })

    const currentPost = post || defaultPostWithCommunitiesAndTopic
    return {
      post: currentPost,
      titlePlaceholder: this.titlePlaceholderForPostType(currentPost.type),
      valid: editing === true, // if we're editing, than it's already valid upon entry.
      announcementSelected: announcementSelected,
      toggleAnnouncementModal: false,
      titleLengthError: false
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
    if (title.length >= MAX_TITLE_LENGTH) {
      this.setState({titleLengthError: true})
    } else {
      this.setState({titleLengthError: false})
    }
    this.setState({
      post: {...this.state.post, title},
      valid: this.isValid({ title })
    })
  }

  handleDetailsChange = (editorState, contentChanged) => {
    if (contentChanged) {
      const contentState = editorState.getCurrentContent()
      this.setLinkPreview(contentState)
      this.updateTopics(contentState)
    }
  }

  setLinkPreview = (contentState) => {
    const { pollingFetchLinkPreview, linkPreviewStatus, clearLinkPreview } = this.props
    const { linkPreview } = this.state.post
    if (!contentState.hasText() && linkPreviewStatus) return clearLinkPreview()
    if (linkPreviewStatus === 'invalid' || linkPreviewStatus === 'removed') return
    if (linkPreview) return
    pollingFetchLinkPreview(contentStateToHTML(contentState))
  }

  updateTopics = throttle(2000, (contentState) => {
    const html = contentStateToHTML(contentState)
    const $ = cheerio.load(html)
    var topicNames = []
    $(`a[data-entity-type=${TOPIC_ENTITY_TYPE}]`).map((i, el) =>
      topicNames.push($(el).text().replace('#', '')))
    const hasChanged = !isEqual(this.state.detailsTopics, topicNames)
    if (hasChanged) {
      this.setState({
        detailsTopics: topicNames.map(tn => ({name: tn, id: tn}))
      })
    }
  })

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
    const thing = !!(this.editor &&
      communities &&
      type.length > 0 &&
      title.length > 0 &&
      communities.length > 0 &&
      title.length <= MAX_TITLE_LENGTH
    )
    return thing
  }

  save = () => {
    const { editing, createPost, updatePost, onClose, goToPost, images, files, setAnnouncement, announcementSelected } = this.props
    const { id, type, title, communities, linkPreview } = this.state.post
    const details = this.editor.getContentHTML()
    const topicNames = this.topicSelector.getSelected().map(t => t.name)
    const postToSave = {
      id, type, title, details, communities, linkPreview, imageUrls: images, fileUrls: files, topicNames, sendAnnouncement: announcementSelected
    }
    const saveFunc = editing ? updatePost : createPost
    setAnnouncement(false)
    saveFunc(postToSave).then(editing ? onClose : goToPost)
  }

  buttonLabel = () => {
    const { postPending, editing } = this.props
    if (postPending) return 'Posting...'
    if (editing) return 'Save'
    return 'Post'
  }

  toggleAnnouncementModal = () => {
    const { showAnnouncementModal } = this.state
    this.setState({
      ...this.state,
      showAnnouncementModal: !showAnnouncementModal
    })
  }

  render () {
    const { titlePlaceholder, titleLengthError, valid, post, detailsTopics = [], showAnnouncementModal } = this.state
    const { id, title, details, communities, linkPreview, topics } = post
    const {
      onClose, initialPrompt, detailsPlaceholder,
      currentUser, communityOptions, loading, addImage,
      showImages, addFile, showFiles, setAnnouncement, announcementSelected,
      canModerate, myModeratedCommunities
    } = this.props
    return <div styleName={showAnnouncementModal ? 'hide' : 'wrapper'} ref={element => { this.wrapper = element }}>
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
            maxLength={MAX_TITLE_LENGTH}
          />
          {titleLengthError && <span styleName='title-error'>{`Title can't have more than ${MAX_TITLE_LENGTH} characters`}</span>}
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
        <div styleName='footerSection'>
          <div styleName='footerSection-label'>Topics</div>
          <div styleName='footerSection-communities'>
            <TopicSelector
              selectedTopics={topics}
              detailsTopics={detailsTopics}
              ref={component => { this.topicSelector = component && component.getWrappedInstance() }} />
          </div>
        </div>
        <div styleName='footerSection'>
          <div styleName='footerSection-label'>Post in</div>
          <div styleName='footerSection-communities'>
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
          setAnnouncement={setAnnouncement}
          announcementSelected={announcementSelected}
          canModerate={canModerate}
          toggleAnnouncementModal={this.toggleAnnouncementModal}
          showAnnouncementModal={showAnnouncementModal}
          communityCount={get('communities', post).length}
          myModeratedCommunities={myModeratedCommunities}
          communities={post.communities}
        />
      </div>
    </div>
  }
}

export function ActionsBar ({id,
  addImage,
  showImages,
  addFile,
  showFiles,
  valid,
  loading,
  submitButtonLabel,
  save,
  setAnnouncement,
  announcementSelected,
  canModerate,
  toggleAnnouncementModal,
  showAnnouncementModal,
  communityCount,
  myModeratedCommunities,
  communities
}) {
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
      {canModerate && <span data-tip='Send Announcement' data-for='announcement-tt'>
        <Icon name='Announcement'
          onClick={() => setAnnouncement(!announcementSelected)}
          styleName={cx('action-icon', {'highlight-icon': announcementSelected})}
        />
        <ReactTooltip
          effect={'solid'}
          delayShow={550}
          id='announcement-tt' />
      </span>}
      {showAnnouncementModal && <SendAnnouncementModal
        closeModal={toggleAnnouncementModal}
        save={save}
        communityCount={communityCount}
        myModeratedCommunities={myModeratedCommunities}
        communities={communities}
      />}

    </div>
    <Button
      onClick={announcementSelected ? toggleAnnouncementModal : save}
      disabled={!valid || loading}
      styleName='postButton'
      label={submitButtonLabel}
      color='green'
    />
  </div>
}
