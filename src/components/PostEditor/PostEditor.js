import PropTypes from 'prop-types'
import React from 'react'
import ReactTooltip from 'react-tooltip'
import { get, isEqual, throttle } from 'lodash/fp'
import cheerio from 'cheerio'
import cx from 'classnames'
import Moment from 'moment'
import { TOPIC_ENTITY_TYPE } from 'hylo-utils/constants'
import { POST_PROP_TYPES } from 'store/models/Post'
import AttachmentManager from 'components/AttachmentManager'
import contentStateToHTML from 'components/HyloEditor/contentStateToHTML'
import Icon from 'components/Icon'
import LocationInput from 'components/LocationInput'
import RoundImage from 'components/RoundImage'
import HyloEditor from 'components/HyloEditor'
import Button from 'components/Button'
import Switch from 'components/Switch'
import CommunitiesSelector from 'components/CommunitiesSelector'
import TopicSelector from 'components/TopicSelector'
import MemberSelector from 'components/MemberSelector'
import LinkPreview from './LinkPreview'
import DatePicker from 'components/DatePicker'
import UploadAttachmentButton from 'components/UploadAttachmentButton'
import SendAnnouncementModal from 'components/SendAnnouncementModal'
import PublicToggle from 'components/PublicToggle'
import styles from './PostEditor.scss'
import { PROJECT_CONTRIBUTIONS } from 'config/featureFlags'

export const MAX_TITLE_LENGTH = 50

export default class PostEditor extends React.Component {
  static propTypes = {
    clearLinkPreview: PropTypes.func,
    communityOptions: PropTypes.array,
    createPost: PropTypes.func,
    currentUser: PropTypes.object,
    currentCommunity: PropTypes.object,
    defaultTopics: PropTypes.array,
    detailsPlaceholder: PropTypes.string,
    editing: PropTypes.bool,
    fetchDefaultTopics: PropTypes.func,
    initialPromptForPostType: PropTypes.object,
    goToPost: PropTypes.func,
    linkPreviewStatus: PropTypes.string,
    loading: PropTypes.bool,
    onClose: PropTypes.func,
    pollingFetchLinkPreview: PropTypes.func,
    post: PropTypes.shape(POST_PROP_TYPES),
    removeLinkPreview: PropTypes.func,
    titlePlaceholderForPostType: PropTypes.object,
    updatePost: PropTypes.func
  }

  static defaultProps = {
    initialPromptForPostType: {
      project: <span styleName='postType postType-project'>CREATE PROJECT</span>,
      event: <span styleName='postType postType-event'>CREATE EVENT</span>,
      default: 'What are you looking to post?'
    },
    titlePlaceholderForPostType: {
      offer: 'What help can you offer?',
      request: 'What are you looking for help with?',
      resource: 'What resource is available?',
      project: 'What would you like to call your project?',
      event: 'What is your event called?',
      default: 'What’s on your mind?'
    },
    detailPlaceholderForPostType: {
      offer: 'Add a description',
      request: 'Add a description',
      resource: 'Describe the resource that is available',
      project: 'Add a description',
      event: 'Add a description',
      default: 'Add a description'
    },
    post: {
      type: 'discussion',
      title: '',
      details: '',
      communities: [],
      location: ''
    },
    editing: false,
    loading: false
  }

  buildStateFromProps = ({ editing, currentCommunity, post, topic, initialPrompt, announcementSelected, postTypeContext }) => {
    const defaultPostWithCommunitiesAndTopic = Object.assign({}, PostEditor.defaultProps.post, {
      type: postTypeContext || PostEditor.defaultProps.post.type,
      communities: currentCommunity ? [currentCommunity] : PostEditor.defaultProps.post.communities,
      topics: topic ? [topic] : [],
      detailsTopics: [],
      acceptContributions: false
    })
    const currentPost = post ? ({
      ...post,
      locationId: post.locationObject ? post.locationObject.id : null,
      startTime: Moment(post.startTime),
      endTime: Moment(post.endTime)
    }) : defaultPostWithCommunitiesAndTopic

    return {
      post: currentPost,
      initialPrompt: initialPrompt || this.initialPromptForPostType(currentPost.type),
      titlePlaceholder: this.titlePlaceholderForPostType(currentPost.type),
      detailPlaceholder: this.detailPlaceholderForPostType(currentPost.type),
      valid: editing === true, // if we're editing, than it's already valid upon entry.
      announcementSelected: announcementSelected,
      toggleAnnouncementModal: false,
      titleLengthError: false,
      dateError: false
    }
  }

  constructor (props) {
    super(props)

    this.state = this.buildStateFromProps(props)
    this.titleInput = React.createRef()
    this.editor = React.createRef()
    this.communitiesSelector = React.createRef()
    this.topicSelector = React.createRef()
  }

  componentDidMount () {
    this.props.fetchDefaultTopics()

    setTimeout(() => {
      this.titleInput.current.focus()
    }, 100)
  }

  componentDidUpdate (prevProps) {
    const linkPreview = this.props.linkPreview
    if (get('post.id', this.props) !== get('post.id', prevProps)) {
      this.reset(this.props)
      this.editor.current.focus()
    } else if (linkPreview !== prevProps.linkPreview) {
      this.setState({
        post: { ...this.state.post, linkPreview }
      })
    }
  }

  componentWillUnmount () {
    this.props.clearLinkPreview()
  }

  reset = (props) => {
    this.editor.current.reset()
    this.communitiesSelector.current.reset()
    this.setState(this.buildStateFromProps(props))
  }

  focus = () => this.editor.current && this.editor.current.focus()

  handlePostTypeSelection = event => {
    const type = event.target.textContent.toLowerCase()
    this.setState({
      post: { ...this.state.post, type },
      titlePlaceholder: this.titlePlaceholderForPostType(type),
      detailPlaceholder: this.detailPlaceholderForPostType(type),
      valid: this.isValid({ type })
    })
  }

  titlePlaceholderForPostType (type) {
    const { titlePlaceholderForPostType } = this.props
    return titlePlaceholderForPostType[type] || titlePlaceholderForPostType['default']
  }

  detailPlaceholderForPostType (type) {
    const { detailPlaceholderForPostType } = this.props
    return detailPlaceholderForPostType[type] || detailPlaceholderForPostType['default']
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
    title.length >= MAX_TITLE_LENGTH ? this.setState({ titleLengthError: true }) : this.setState({ titleLengthError: false })
    this.setState({
      post: { ...this.state.post, title },
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

  toggleContributions = () => {
    const { post, post: { acceptContributions } } = this.state
    this.setState({
      post: { ...post, acceptContributions: !acceptContributions }
    })
  }

  handleStartTimeChange = startTime => {
    this.validateTimeChange(startTime, this.state.post.endTime)

    this.setState({
      post: { ...this.state.post, startTime },
      valid: this.isValid({ startTime })
    })
  }

  handleEndTimeChange = endTime => {
    this.validateTimeChange(this.state.post.startTime, endTime)

    this.setState({
      post: { ...this.state.post, endTime },
      valid: this.isValid({ endTime })
    })
  }

  validateTimeChange = (startTime, endTime) => {
    if (endTime) {
      startTime < endTime ? this.setState({ dateError: false }) : this.setState({ dateError: true })
    }
  }

  handleLocationChange = locationObject => {
    this.setState({
      post: { ...this.state.post, location: locationObject.fullText, locationId: locationObject.id },
      valid: this.isValid({ locationId: locationObject.id })
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
    const $ = cheerio.load(html, null, false)
    var topicNames = []
    $(`a[data-entity-type=${TOPIC_ENTITY_TYPE}]`).map((i, el) =>
      topicNames.push($(el).text().replace('#', '')))
    const hasChanged = !isEqual(this.state.detailsTopics, topicNames)
    if (hasChanged) {
      this.setState({
        detailsTopics: topicNames.map(tn => ({ label: tn, name: tn, id: tn }))
      })
    }
  })

  removeLinkPreview = () => {
    this.props.removeLinkPreview()
    this.setState({
      post: { ...this.state.post, linkPreview: null }
    })
  }

  setSelectedCommunities = communities => {
    this.setState({
      post: { ...this.state.post, communities },
      valid: this.isValid({ communities })
    })
  }

  togglePublic = () => {
    const { isPublic } = this.state.post
    this.setState({
      post: { ...this.state.post, isPublic: !isPublic }
    })
  }

  updateProjectMembers = members => {
    this.setState({
      post: { ...this.state.post, members }
    })
  }

  updateEventInvitations = eventInvitations => {
    this.setState({
      post: { ...this.state.post, eventInvitations }
    })
  }

  isValid = (postUpdates = {}) => {
    const { type, title, communities, startTime, endTime } = Object.assign({}, this.state.post, postUpdates)
    const { isEvent } = this.props

    return !!(this.editor.current &&
      communities &&
      type.length > 0 &&
      title.length > 0 &&
      communities.length > 0 &&
      title.length <= MAX_TITLE_LENGTH &&
      (!isEvent || (endTime && (startTime < endTime)))
    )
  }

  save = () => {
    const {
      editing, createPost, createProject, updatePost, onClose,
      goToPost, setAnnouncement, announcementSelected, isProject,
      imageAttachments, fileAttachments
    } = this.props
    const {
      id, type, title, communities, linkPreview, members,
      acceptContributions, eventInvitations, startTime,
      endTime, location, locationId, isPublic
    } = this.state.post
    const details = this.editor.current.getContentHTML()
    const topicNames = this.topicSelector.current.getSelected().map(t => t.name)
    const memberIds = members && members.map(m => m.id)
    const eventInviteeIds = eventInvitations && eventInvitations.map(m => m.id)
    const imageUrls = imageAttachments && imageAttachments.map(attachment => attachment.url)
    const fileUrls = fileAttachments && fileAttachments.map(attachment => attachment.url)

    const postToSave = {
      id, type, title, details, communities, linkPreview, imageUrls, fileUrls, topicNames, sendAnnouncement: announcementSelected, memberIds, acceptContributions, eventInviteeIds, startTime, endTime, location, locationId, isPublic
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
    const {
      initialPrompt, titlePlaceholder, detailPlaceholder, titleLengthError,
      dateError, valid, post, detailsTopics = [], showAnnouncementModal
    } = this.state
    const {
      id, type, title, details, communities, linkPreview, topics, members,
      acceptContributions, eventInvitations, startTime, endTime, location,
      locationObject
    } = post
    const {
      onClose, currentCommunity, currentUser, communityOptions, defaultTopics, loading, setAnnouncement,
      announcementSelected, canModerate, myModeratedCommunities, isProject,
      isEvent, showFiles, showImages, addAttachment
    } = this.props

    const hasStripeAccount = get('hasStripeAccount', currentUser)
    const hasLocation = ['event', 'offer', 'request', 'resource'].includes(type)
    const showPostTypes = !isProject && !isEvent
    const canHaveTimes = type !== 'discussion'
    // Center location autocomplete either on post's current location, or current community's location, or current user's location
    const curLocation = locationObject || get('0.locationObject', communities) || get('locationObject', currentUser)

    return <div styleName={showAnnouncementModal ? 'hide' : 'wrapper'}>
      <div styleName='header'>
        <div styleName='initial'>
          <div styleName='initial-prompt'>{initialPrompt}</div>
          <a styleName='initial-closeButton' onClick={onClose}><Icon name='Ex' /></a>
        </div>
        {showPostTypes && <div styleName='postTypes'>
          <Button {...this.postTypeButtonProps('discussion')} />
          <Button {...this.postTypeButtonProps('request')} />
          <Button {...this.postTypeButtonProps('offer')} />
          <Button {...this.postTypeButtonProps('resource')} />
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
            ref={this.titleInput}
            maxLength={MAX_TITLE_LENGTH} />
          {titleLengthError && <span styleName='title-error'>{`Title can't have more than ${MAX_TITLE_LENGTH} characters`}</span>}
          <HyloEditor
            styleName='editor'
            placeholder={detailPlaceholder}
            onChange={this.handleDetailsChange}
            contentHTML={details}
            readOnly={loading}
            parentComponent={'PostEditor'}
            ref={this.editor}
          />
        </div>
      </div>
      {linkPreview &&
        <LinkPreview linkPreview={linkPreview} onClose={this.removeLinkPreview} />}
      <AttachmentManager type='post' id={id} attachmentType='image' showAddButton showLabel showLoading />
      <AttachmentManager type='post' id={id} attachmentType='file' showAddButton showLabel showLoading />
      <div styleName='footer'>
        {isProject && <div styleName='footerSection'>
          <div styleName='footerSection-label'>Project Members</div>
          <div styleName='footerSection-communities'>
            <MemberSelector
              initialMembers={members || []}
              onChange={this.updateProjectMembers}
              forCommunities={communities}
              readOnly={loading}
            />
          </div>
        </div>}
        <div styleName='footerSection'>
          <div styleName='footerSection-label'>Topics</div>
          <div styleName='footerSection-topics'>
            <TopicSelector
              currentCommunity={currentCommunity}
              selectedTopics={topics}
              defaultTopics={defaultTopics}
              detailsTopics={detailsTopics}
              ref={this.topicSelector} />
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
              ref={this.communitiesSelector}
            />
          </div>
        </div>
        <PublicToggle togglePublic={this.togglePublic} isPublic={!!post.isPublic} />
        {canHaveTimes && dateError && <span styleName='title-error'>{'End Time must be after Start Time'}</span>}
        {canHaveTimes && <div styleName='footerSection'>
          <div styleName='footerSection-label'>Timeframe</div>
          <div styleName='datePickerModule'>
            <DatePicker value={startTime} placeholder={'Select Start'} onChange={this.handleStartTimeChange} />
            <div styleName='footerSection-helper'>To</div>
            <DatePicker value={endTime} placeholder={'Select End'} onChange={this.handleEndTimeChange} />
          </div>
        </div>}
        {hasLocation && <div styleName='footerSection'>
          <div styleName='footerSection-label alignedLabel'>Location</div>
          <LocationInput
            saveLocationToDB
            locationObject={curLocation}
            location={location}
            onChange={this.handleLocationChange}
            placeholder={`Where is your ${type} located?`}
          />
        </div>}
        {isEvent && <div styleName='footerSection'>
          <div styleName='footerSection-label'>Invite People</div>
          <div styleName='footerSection-communities'>
            <MemberSelector
              initialMembers={eventInvitations || []}
              onChange={this.updateEventInvitations}
              forCommunities={communities}
              readOnly={loading}
            />
          </div>
        </div>}
        {isProject && currentUser.hasFeature(PROJECT_CONTRIBUTIONS) && <div styleName='footerSection'>
          <div styleName='footerSection-label'>Accept Contributions</div>
          {hasStripeAccount && <div styleName={cx('footerSection-communities', 'accept-contributions')}>
            <Switch value={acceptContributions} onClick={this.toggleContributions} styleName='accept-contributions-switch' />
            {!acceptContributions && <div styleName='accept-contributions-help'>If you turn "Accept Contributions" on, people will be able to send money to your Stripe connected account to support this project.</div>}
          </div>}
          {!hasStripeAccount && <div styleName={cx('footerSection-communities', 'accept-contributions-help')}>
            To accept financial contributions for this project, you have to connect a Stripe account. Go to <a href='/settings/payment'>Settings</a> to set it up. (Remember to save your changes before leaving this form)
          </div>}
        </div>}
        <ActionsBar
          id={id}
          addAttachment={addAttachment}
          showImages={showImages}
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

export function ActionsBar ({
  id,
  addAttachment,
  showImages,
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
      <UploadAttachmentButton
        type='post'
        id={id}
        attachmentType='image'
        onSuccess={attachment => addAttachment('post', id, attachment)}
        allowMultiple
        disable={showImages}>
        <Icon
          name='AddImage'
          styleName={cx('action-icon', { 'highlight-icon': showImages })}
        />
      </UploadAttachmentButton>
      <UploadAttachmentButton
        type='post'
        id={id}
        attachmentType='file'
        onSuccess={attachment => addAttachment('post', id, attachment)}
        allowMultiple
        disable={showFiles}>
        <Icon
          name='Paperclip'
          styleName={cx('action-icon', { 'highlight-icon': showFiles })}
        />
      </UploadAttachmentButton>
      {canModerate && <span data-tip='Send Announcement' data-for='announcement-tt'>
        <Icon
          name='Announcement'
          onClick={() => setAnnouncement(!announcementSelected)}
          styleName={cx('action-icon', { 'highlight-icon': announcementSelected })}
        />
        <ReactTooltip
          effect={'solid'}
          delayShow={550}
          id='announcement-tt'
        />
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
