import PropTypes from 'prop-types'
import React from 'react'
import ReactTooltip from 'react-tooltip'
import { get, isEqual, throttle } from 'lodash/fp'
import cheerio from 'cheerio'
import cx from 'classnames'
import Moment from 'moment'
import { TOPIC_ENTITY_TYPE } from 'hylo-utils/constants'
import { POST_PROP_TYPES } from 'store/models/Post'
import AttachmentManager from './AttachmentManager'
import { uploadSettings } from './AttachmentManager/AttachmentManager'
import contentStateToHTML from 'components/HyloEditor/contentStateToHTML'
import Icon from 'components/Icon'
import RoundImage from 'components/RoundImage'
import HyloEditor from 'components/HyloEditor'
import Button from 'components/Button'
import CommunitiesSelector from 'components/CommunitiesSelector'
import TopicSelector from 'components/TopicSelector'
import MemberSelector from 'components/MemberSelector'
import LinkPreview from './LinkPreview'
import DatePicker from 'components/DatePicker'
import ChangeImageButton from 'components/ChangeImageButton'
import SendAnnouncementModal from 'components/SendAnnouncementModal'
import styles from './PostEditor.scss'

export const MAX_TITLE_LENGTH = 50

export default class PostEditor extends React.Component {
  static propTypes = {
    onClose: PropTypes.func,
    initialPromptForPostType: PropTypes.object,
    titlePlaceholderForPostType: PropTypes.object,
    detailsPlaceholder: PropTypes.string,
    communityOptions: PropTypes.array,
    currentUser: PropTypes.object,
    currentCommunity: PropTypes.object,
    post: PropTypes.shape(POST_PROP_TYPES),
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
    initialPromptForPostType: {
      project: <span styleName='postType postType-project'>CREATE PROJECT</span>,
      event: <span styleName='postType postType-event'>CREATE EVENT</span>,      
      default: 'What are you looking to post?'
    },
    titlePlaceholderForPostType: {
      offer: 'What super powers can you offer?',
      request: 'What are you looking for help with?',
      project: 'What would you like to call your project?',
      event: 'What is your event called?',      
      default: 'What’s on your mind?'
    },
    detailsPlaceholder: 'Add a description',
    post: {
      type: 'discussion',
      title: '',
      details: '',
      communities: [],
      location: '',
      startTime: Moment().hour(18).minute(0),
      endTime: Moment().hour(21).minute(0)
    },
    editing: false,
    loading: false
  }

  buildStateFromProps = ({ editing, currentCommunity, post, topic, initialPrompt, announcementSelected, postTypeContext }) => {  

    const defaultPostWithCommunitiesAndTopic = Object.assign({}, PostEditor.defaultProps.post, {
      type: postTypeContext || PostEditor.defaultProps.post.type,
      communities: currentCommunity ? [currentCommunity] : PostEditor.defaultProps.post.communities,
      topics: topic ? [topic] : [],
      detailsTopics: []
    })
    const currentPost = post ?
      ({...post,
        startTime: Moment(post.startTime),
        endTime: Moment(post.endTime)
      })
      : defaultPostWithCommunitiesAndTopic

    return {
      post: currentPost,
      initialPrompt: initialPrompt || this.initialPromptForPostType(currentPost.type),
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

  initialPromptForPostType (type) {
    const { initialPromptForPostType } = this.props
    return initialPromptForPostType[type] || initialPromptForPostType['default']
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
    title.length >= MAX_TITLE_LENGTH ? this.setState({titleLengthError: true}) : this.setState({titleLengthError: false})
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

  handleStartTimeChange = startTime => {
    this.setState({
      post: {...this.state.post, startTime},
      valid: this.isValid({ startTime })
    })
  }

  handleEndTimeChange = endTime => {
    this.setState({
      post: {...this.state.post, endTime},
      valid: this.isValid({ endTime })
    })
  }

  handleLocationChange = event => {
    const location = event.target.value
    this.setState({
      post: {...this.state.post, location}
    })
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

  updateProjectMembers = members => {
    this.setState({
      post: {...this.state.post, members}
    })
  }

  updateEventInvitations = eventInvitations => {
    this.setState({
      post: {...this.state.post, eventInvitations}
    })
  }

  isValid = (postUpdates = {}) => {
    const { type, title, communities } = Object.assign({}, this.state.post, postUpdates)

    return !!(this.editor &&
      communities &&
      type.length > 0 &&
      title.length > 0 &&
      communities.length > 0 &&
      title.length <= MAX_TITLE_LENGTH
    )
  }

  save = () => {
    const {
      editing, createPost, createProject, updatePost, onClose, goToPost, images, files, setAnnouncement, announcementSelected, isProject
    } = this.props
    const {
      id, type, title, communities, linkPreview, members, eventInvitations, startTime, endTime, location
    } = this.state.post
    const details = this.editor.getContentHTML()
    const topicNames = this.topicSelector.getSelected().map(t => t.name)
    const memberIds = members && members.map(m => m.id)
    const eventInviteeIds = eventInvitations && eventInvitations.map(m => m.id)
    const postToSave = {
      id, type, title, details, communities, linkPreview, imageUrls: images, fileUrls: files, topicNames, sendAnnouncement: announcementSelected, memberIds, eventInviteeIds, startTime, endTime, location
    }
    const saveFunc = editing ? updatePost : isProject ? createProject : createPost
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
    const { initialPrompt, titlePlaceholder, titleLengthError, valid, post, detailsTopics = [], showAnnouncementModal } = this.state
    const { id, title, details, communities, linkPreview, topics, members, eventInvitations, startTime, endTime, location } = post
    const {
      onClose, detailsPlaceholder,
      currentUser, communityOptions, loading, addImage,
      showImages, addFile, showFiles, setAnnouncement, announcementSelected,
      canModerate, myModeratedCommunities, isProject, isEvent
    } = this.props

    return <div styleName={showAnnouncementModal ? 'hide' : 'wrapper'} ref={element => { this.wrapper = element }}>
      <div styleName='header'>
        <div styleName='initial'>
          <div styleName='initial-prompt'>{initialPrompt}</div>
          <a styleName='initial-closeButton' onClick={onClose}><Icon name='Ex' /></a>
        </div>
        {!isProject && !isEvent && <div styleName='postTypes'>
          <Button {...this.postTypeButtonProps('discussion')} />
          <Button {...this.postTypeButtonProps('request')} />
          <Button {...this.postTypeButtonProps('offer')} />
        </div>}
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
            maxLength={MAX_TITLE_LENGTH} />
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
        {isProject && <div styleName='footerSection'>
          <div styleName='footerSection-label'>Project Members</div>
          <div styleName='footerSection-communities'>
            <MemberSelector
              initialMembers={members || []}
              onChange={this.updateProjectMembers}
              readOnly={loading}
              ref={component => { this.membersSelector = component }}
            />
          </div>
        </div>}
        {isEvent && <div styleName='footerSection'>
          <div styleName='footerSection-label alignedLabel'>Start Time</div>
          <DatePicker value={startTime} onChange={this.handleStartTimeChange} />
        </div>} 
        {isEvent && <div styleName='footerSection'>
          <div styleName='footerSection-label alignedLabel'>End Time</div>
          <DatePicker value={endTime} onChange={this.handleEndTimeChange} />
        </div>}
        {isEvent && <div styleName='footerSection'>
          <div styleName='footerSection-label alignedLabel'>Location</div>
          <input
            type='text'
            styleName='locationInput'
            placeholder='Where is your event'
            value={location || ''}
            onChange={this.handleLocationChange}
            ref={x => { this.locationInput = x }} />
        </div>}
        {isEvent && <div styleName='footerSection'>
          <div styleName='footerSection-label'>Invite People</div>
          <div styleName='footerSection-communities'>
            <MemberSelector
              initialMembers={eventInvitations || []}
              onChange={this.updateEventInvitations}
              readOnly={loading}
              ref={component => { this.eventSelector = component }}
            />
          </div>
        </div>}
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
