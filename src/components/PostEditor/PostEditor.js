/* eslint-disable react/jsx-curly-brace-presence */
import PropTypes from 'prop-types'
import React from 'react'
import ReactTooltip from 'react-tooltip'
import { debounce, get, isEqual } from 'lodash/fp'
import cx from 'classnames'
import Moment from 'moment'
import { POST_PROP_TYPES, POST_TYPES } from 'store/models/Post'
import AttachmentManager from 'components/AttachmentManager'
import Icon from 'components/Icon'
import LocationInput from 'components/LocationInput'
import RoundImage from 'components/RoundImage'
import HyloTipTapEditor from 'components/HyloTipTapEditor'
import Button from 'components/Button'
import Switch from 'components/Switch'
import GroupsSelector from 'components/GroupsSelector'
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
export const MAX_POST_TOPICS = 3

export default class PostEditor extends React.Component {
  static propTypes = {
    context: PropTypes.string,
    clearLinkPreview: PropTypes.func,
    groupOptions: PropTypes.array,
    createPost: PropTypes.func,
    currentUser: PropTypes.object,
    currentGroup: PropTypes.object,
    detailsPlaceholder: PropTypes.string,
    editing: PropTypes.bool,
    goToPost: PropTypes.func,
    linkPreviewStatus: PropTypes.string,
    loading: PropTypes.bool,
    onClose: PropTypes.func,
    pollingFetchLinkPreview: PropTypes.func,
    post: PropTypes.shape(POST_PROP_TYPES),
    removeLinkPreview: PropTypes.func,
    setIsDirty: PropTypes.func,
    titlePlaceholderForPostType: PropTypes.object,
    updatePost: PropTypes.func,
    fetchLocation: PropTypes.func,
    ensureLocationIdIfCoordinate: PropTypes.func
  }

  static defaultProps = {
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
      groups: [],
      location: ''
    },
    postTypes: Object.keys(POST_TYPES),
    editing: false,
    loading: false
  }

  buildStateFromProps = ({
    context,
    editing,
    currentGroup,
    post,
    topic,
    announcementSelected,
    postType
  }) => {
    const defaultPostWithGroupsAndTopic = Object.assign(
      {},
      PostEditor.defaultProps.post,
      {
        type: postType || PostEditor.defaultProps.post.type,
        groups: currentGroup
          ? [currentGroup]
          : PostEditor.defaultProps.post.groups,
        topics: topic ? [topic] : [],
        acceptContributions: false,
        isPublic: context === 'public'
      }
    )
    const currentPost = post
      ? {
        ...post,
        locationId: post.locationObject ? post.locationObject.id : null,
        startTime: Moment(post.startTime),
        endTime: Moment(post.endTime)
      }
      : defaultPostWithGroupsAndTopic

    return {
      post: currentPost,
      titlePlaceholder: this.titlePlaceholderForPostType(currentPost.type),
      detailPlaceholder: this.detailPlaceholderForPostType(currentPost.type),
      valid: editing === true, // if we're editing, than it's already valid upon entry.
      announcementSelected: announcementSelected,
      toggleAnnouncementModal: false,
      showPostTypeMenu: false,
      titleLengthError: false,
      dateError: false,
      allowAddTopic: true
    }
  }

  constructor (props) {
    super(props)

    this.state = this.buildStateFromProps(props)
    this.titleInputRef = React.createRef()
    this.editorRef = React.createRef()
    this.groupsSelectorRef = React.createRef()
  }

  componentDidMount () {
    setTimeout(() => { this.titleInputRef.current && this.titleInputRef.current.focus() }, 100)
  }

  componentDidUpdate (prevProps) {
    const { linkPreview } = this.props

    if (get('post.id', this.props) !== get('post.id', prevProps) ||
        get('post.details', this.props) !== get('post.details', prevProps)) {
      this.reset(this.props)
      this.editorRef.current.focus()
    } else if (linkPreview !== prevProps.linkPreview) {
      this.onUpdate()
    }
  }

  componentWillUnmount () {
    this.props.clearLinkPreview()
  }

  onUpdate () {
    this.setState({
      post: { ...this.state.post, linkPreview: this.props.linkPreview }
    })
  }

  reset = (props) => {
    this.editorRef.current.reset()
    this.groupsSelectorRef.current.reset()
    this.setState(this.buildStateFromProps(props))
  }

  focus = () => this.editorRef.current.focus()

  handlePostTypeSelection = (event) => {
    const type = event.target.textContent.toLowerCase()
    const { changeQueryString, location } = this.props
    this.setIsDirty(true)
    changeQueryString({
      pathname: location.pathname,
      search: `?newPostType=${type}`
    })

    const showPostTypeMenu = this.state.showPostTypeMenu
    this.setState({
      post: { ...this.state.post, type },
      titlePlaceholder: this.titlePlaceholderForPostType(type),
      detailPlaceholder: this.detailPlaceholderForPostType(type),
      valid: this.isValid({ type }),
      showPostTypeMenu: !showPostTypeMenu
    })
  }

  titlePlaceholderForPostType (type) {
    const { titlePlaceholderForPostType } = this.props
    return (
      titlePlaceholderForPostType[type] ||
      titlePlaceholderForPostType.default
    )
  }

  detailPlaceholderForPostType (type) {
    const { detailPlaceholderForPostType } = this.props
    return (
      detailPlaceholderForPostType[type] ||
      detailPlaceholderForPostType.default
    )
  }

  postTypeButtonProps = (forPostType) => {
    const { loading } = this.props
    const { type } = this.state.post
    const active = type === forPostType
    const className = cx(
      styles.postType,
      styles[`postType-${forPostType}`],
      {
        [styles.active]: active,
        [styles.selectable]: !loading && !active
      }
    )
    const label = active
      ? (
        <span styleName='initial-prompt'>
          <span>{forPostType}</span>{' '}
          <Icon styleName={`icon icon-${forPostType}`} name='ArrowDown' />
        </span>
      ) : forPostType
    return {
      borderRadius: '5px',
      label,
      onClick: active ? this.togglePostTypeMenu : this.handlePostTypeSelection,
      disabled: loading,
      color: '',
      className,
      key: forPostType
    }
  }

  handleTitleChange = (event) => {
    const title = event.target.value
    title.length >= MAX_TITLE_LENGTH
      ? this.setState({ titleLengthError: true })
      : this.setState({ titleLengthError: false })
    if (title !== this.state.post.title) {
      this.setIsDirty(true)
    }
    this.setState({
      post: { ...this.state.post, title },
      valid: this.isValid({ title })
    })
  }

  handleDetailsChange = () => {
    this.setLinkPreview()
    this.setIsDirty(true)
  }

  handleToggleContributions = () => {
    const {
      post,
      post: { acceptContributions }
    } = this.state
    this.setState({
      post: { ...post, acceptContributions: !acceptContributions }
    })
  }

  handleStartTimeChange = (startTime) => {
    this.validateTimeChange(startTime, this.state.post.endTime)

    this.setState({
      post: { ...this.state.post, startTime },
      valid: this.isValid({ startTime })
    })
  }

  handleEndTimeChange = (endTime) => {
    this.validateTimeChange(this.state.post.startTime, endTime)

    this.setState({
      post: { ...this.state.post, endTime },
      valid: this.isValid({ endTime })
    })
  }

  validateTimeChange = (startTime, endTime) => {
    if (endTime) {
      startTime < endTime
        ? this.setState({ dateError: false })
        : this.setState({ dateError: true })
    }
  }

  handleLocationChange = (locationObject) => {
    this.setState({
      post: {
        ...this.state.post,
        location: locationObject.fullText,
        locationId: locationObject.id
      },
      valid: this.isValid({ locationId: locationObject.id })
    })
  }

  // Note: Checks for linkPreview every 1/2 second
  // Currently if the link preview is removed, another link preview
  // will not be generated unless the editor content is cleared
  // entirely, and another link is added.
  // TODO: Probably better to throttle this like updateTopic
  //       Also, get editor content in the function or send in?
  setLinkPreview = debounce(500, () => {
    const contentText = this.editorRef.current.getText()
    const {
      pollingFetchLinkPreview,
      linkPreviewStatus,
      clearLinkPreview
    } = this.props
    const { linkPreview } = this.state.post
    // Keep this around a litte longer for debugging:
    // console.log('!!! this.editorRef.current.getText(), linkPreviewStatus, linkPreview:', this.editorRef.current.getText(), linkPreviewStatus, linkPreview)

    if (this.editorRef.current.isEmpty() && linkPreviewStatus) return clearLinkPreview()

    if (linkPreview) return

    if (linkPreviewStatus === 'invalid' || linkPreviewStatus === 'removed') {
      return
    }

    pollingFetchLinkPreview(contentText)
  })

  handleTopicSelectorOnChange = topics => {
    this.setState({
      post: { ...this.state.post, topics },
      allowAddTopic: false
    })
    this.setIsDirty(true)
  }

  handleAddTopic = topic => {
    const { post, allowAddTopic } = this.state

    if (!allowAddTopic || post?.topics?.length >= MAX_POST_TOPICS) return

    this.setState({ post: { ...post, topics: [...post.topics, topic] } })
    this.setIsDirty(true)
  }

  handleRemoveLinkPreview = () => {
    this.props.removeLinkPreview()
    this.setState({
      post: { ...this.state.post, linkPreview: null }
    })
  }

  handleSetSelectedGroups = (groups) => {
    const hasChanged = !isEqual(this.state.post.groups, groups)

    this.setState({
      post: { ...this.state.post, groups },
      valid: this.isValid({ groups })
    })

    if (hasChanged) {
      this.setIsDirty(true)
    }
  }

  togglePublic = () => {
    const { isPublic } = this.state.post
    this.setState({
      post: { ...this.state.post, isPublic: !isPublic }
    })
  }

  handleUpdateProjectMembers = (members) => {
    this.setState({
      post: { ...this.state.post, members }
    })
  }

  handleUpdateEventInvitations = (eventInvitations) => {
    this.setState({
      post: { ...this.state.post, eventInvitations }
    })
  }

  isValid = (postUpdates = {}) => {
    const { type, title, groups, startTime, endTime } = Object.assign(
      {},
      this.state.post,
      postUpdates
    )
    const { isEvent } = this.props

    return !!(
      this.editorRef.current &&
      groups &&
      type.length > 0 &&
      title.length > 0 &&
      groups.length > 0 &&
      title.length <= MAX_TITLE_LENGTH &&
      (!isEvent || (endTime && startTime < endTime))
    )
  }

  setIsDirty = isDirty => this.props.setIsDirty && this.props.setIsDirty(isDirty)

  handleCancel = () => {
    if (this.props.onCancel) {
      this.props.onCancel()

      return true
    }
  }

  save = async () => {
    const {
      editing,
      createPost,
      updatePost,
      onClose,
      goToPost,
      setAnnouncement,
      announcementSelected,
      imageAttachments,
      fileAttachments,
      fetchLocation,
      ensureLocationIdIfCoordinate
    } = this.props
    const {
      id,
      type,
      title,
      groups,
      linkPreview,
      members,
      topics,
      acceptContributions,
      eventInvitations,
      startTime,
      endTime,
      locationId,
      isPublic
    } = this.state.post
    const details = this.editorRef.current.getHTML()
    const topicNames = topics?.map((t) => t.name)
    const memberIds = members && members.map((m) => m.id)
    const eventInviteeIds =
      eventInvitations && eventInvitations.map((m) => m.id)
    const imageUrls =
      imageAttachments && imageAttachments.map((attachment) => attachment.url)
    const fileUrls =
      fileAttachments && fileAttachments.map((attachment) => attachment.url)
    const location = this.state.post.location || this.props.selectedLocation
    const actualLocationId = await ensureLocationIdIfCoordinate({
      fetchLocation,
      location,
      locationId
    })
    const postToSave = {
      id,
      type,
      title,
      details,
      groups,
      linkPreview,
      imageUrls,
      fileUrls,
      topicNames,
      sendAnnouncement: announcementSelected,
      memberIds,
      acceptContributions,
      eventInviteeIds,
      startTime,
      endTime,
      location,
      locationId: actualLocationId,
      isPublic
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

  togglePostTypeMenu = () => {
    const { showPostTypeMenu } = this.state
    this.setState({
      ...this.state,
      showPostTypeMenu: !showPostTypeMenu
    })
  }

  render () {
    const {
      titlePlaceholder,
      detailPlaceholder,
      titleLengthError,
      dateError,
      valid,
      post,
      showAnnouncementModal,
      showPostTypeMenu
    } = this.state
    const {
      id,
      type,
      title,
      details,
      groups,
      linkPreview,
      topics,
      members,
      acceptContributions,
      eventInvitations,
      startTime,
      endTime
    } = post
    const {
      currentGroup,
      currentUser,
      groupOptions,
      loading,
      setAnnouncement,
      announcementSelected,
      canModerate,
      myModeratedGroups,
      isProject,
      isEvent,
      showFiles,
      showImages,
      addAttachment,
      postTypes
    } = this.props
    // Note: Providing `groupIds` to HyloTipTapEditor would cause
    // mentions to only be posisble to people in the groups being posted
    // to. This could be combined with logic about the selected groups
    // visibilities and the public status to "do the right thing"
    // const groupIds = groups && groups.map(g => g.id)
    const hasStripeAccount = get('hasStripeAccount', currentUser)
    const hasLocation = [
      'discussion',
      'event',
      'offer',
      'request',
      'resource',
      'project'
    ].includes(type)
    const canHaveTimes = type !== 'discussion'
    const location = post.location || this.props.selectedLocation
    // Center location autocomplete either on post's current location,
    // or current group's location, or current user's location
    const locationObject =
      post.locationObject ||
      get('0.locationObject', groups) ||
      get('locationObject', currentUser)

    return (
      <div styleName={showAnnouncementModal ? 'hide' : 'wrapper'}>
        <div styleName='header'>
          <div styleName='initial'>
            <div>
              <Button noDefaultStyles {...this.postTypeButtonProps(type)} />
              {showPostTypeMenu && (
                <div styleName='postTypeMenu'>
                  {postTypes
                    .filter((postType) => postType !== type)
                    .map((postType) => (
                      <Button noDefaultStyles {...this.postTypeButtonProps(postType)} key={postType} />
                    ))}
                </div>
              )}
            </div>
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
              ref={this.titleInputRef}
              maxLength={MAX_TITLE_LENGTH}
            />
            {titleLengthError && (
              <span styleName='title-error'>{`Title can't have more than ${MAX_TITLE_LENGTH} characters`}</span>
            )}
            <HyloTipTapEditor
              styleName='editor'
              placeholder={detailPlaceholder}
              onChange={this.handleDetailsChange}
              onEscape={this.handleCancel}
              onAddTopic={this.handleAddTopic}
              contentHTML={details}
              // groupIds={groupIds}
              readOnly={loading}
              ref={this.editorRef}
            />
          </div>
        </div>
        {linkPreview && (
          <LinkPreview
            linkPreview={linkPreview}
            onClose={this.handleRemoveLinkPreview}
          />
        )}
        <AttachmentManager
          type='post'
          id={id}
          attachmentType='image'
          showAddButton
          showLabel
          showLoading
        />
        <AttachmentManager
          type='post'
          id={id}
          attachmentType='file'
          showAddButton
          showLabel
          showLoading
        />
        <div styleName='footer'>
          {isProject && (
            <div styleName='footerSection'>
              <div styleName='footerSection-label'>Project Members</div>
              <div styleName='footerSection-groups'>
                <MemberSelector
                  initialMembers={members || []}
                  onChange={this.handleUpdateProjectMembers.updateProjectMembers}
                  forGroups={groups}
                  readOnly={loading}
                />
              </div>
            </div>
          )}
          <div styleName='footerSection'>
            <div styleName='footerSection-label'>Topics</div>
            <div styleName='footerSection-topics'>
              <TopicSelector
                forGroups={post?.groups || [currentGroup]}
                selectedTopics={topics}
                onChange={this.handleTopicSelectorOnChange}
              />
            </div>
          </div>
          <div styleName='footerSection'>
            <div styleName='footerSection-label'>Post in</div>
            <div styleName='footerSection-groups'>
              <GroupsSelector
                options={groupOptions}
                selected={groups}
                onChange={this.handleSetSelectedGroups}
                readOnly={loading}
                ref={this.groupsSelectorRef}
              />
            </div>
          </div>
          <PublicToggle
            togglePublic={this.togglePublic}
            isPublic={!!post.isPublic}
          />
          {canHaveTimes && dateError && (
            <span styleName='title-error'>
              {'End Time must be after Start Time'}
            </span>
          )}
          {canHaveTimes && (
            <div styleName='footerSection'>
              <div styleName='footerSection-label'>Timeframe</div>
              <div styleName='datePickerModule'>
                <DatePicker
                  value={startTime}
                  placeholder={'Select Start'}
                  onChange={this.handleStartTimeChange}
                />
                <div styleName='footerSection-helper'>To</div>
                <DatePicker
                  value={endTime}
                  placeholder={'Select End'}
                  onChange={this.handleEndTimeChange}
                />
              </div>
            </div>
          )}
          {hasLocation && (
            <div styleName='footerSection'>
              <div styleName='footerSection-label alignedLabel'>Location</div>
              <LocationInput
                saveLocationToDB
                locationObject={locationObject}
                location={location}
                onChange={this.handleLocationChange}
                placeholder={`Where is your ${type} located?`}
              />
            </div>
          )}
          {isEvent && (
            <div styleName='footerSection'>
              <div styleName='footerSection-label'>Invite People</div>
              <div styleName='footerSection-groups'>
                <MemberSelector
                  initialMembers={eventInvitations || []}
                  onChange={this.handleUpdateEventInvitations}
                  forGroups={groups}
                  readOnly={loading}
                />
              </div>
            </div>
          )}
          {isProject && currentUser.hasFeature(PROJECT_CONTRIBUTIONS) && (
            <div styleName='footerSection'>
              <div styleName='footerSection-label'>Accept Contributions</div>
              {hasStripeAccount && (
                <div
                  styleName={cx('footerSection-groups', 'accept-contributions')}
                >
                  <Switch
                    value={acceptContributions}
                    onClick={this.handleToggleContributions}
                    styleName='accept-contributions-switch'
                  />
                  {!acceptContributions && (
                    <div styleName='accept-contributions-help'>
                      If you turn 'Accept Contributions' on, people will be able
                      to send money to your Stripe connected account to support
                      this project.
                    </div>
                  )}
                </div>
              )}
              {!hasStripeAccount && (
                <div
                  styleName={cx(
                    'footerSection-groups',
                    'accept-contributions-help'
                  )}
                >
                  To accept financial contributions for this project, you have
                  to connect a Stripe account. Go to{' '}
                  <a href='/settings/payment'>Settings</a> to set it up.
                  (Remember to save your changes before leaving this form)
                </div>
              )}
            </div>
          )}
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
            groupCount={get('groups', post).length}
            myModeratedGroups={myModeratedGroups}
            groups={post.groups}
          />
        </div>
      </div>
    )
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
  groupCount,
  myModeratedGroups,
  groups
}) {
  return (
    <div styleName='actionsBar'>
      <div styleName='actions'>
        <UploadAttachmentButton
          type='post'
          id={id}
          attachmentType='image'
          onSuccess={(attachment) => addAttachment('post', id, attachment)}
          allowMultiple
          disable={showImages}
        >
          <Icon
            name='AddImage'
            styleName={cx('action-icon', { 'highlight-icon': showImages })}
          />
        </UploadAttachmentButton>
        <UploadAttachmentButton
          type='post'
          id={id}
          attachmentType='file'
          onSuccess={(attachment) => addAttachment('post', id, attachment)}
          allowMultiple
          disable={showFiles}
        >
          <Icon
            name='Paperclip'
            styleName={cx('action-icon', { 'highlight-icon': showFiles })}
          />
        </UploadAttachmentButton>
        {canModerate && (
          <span data-tip='Send Announcement' data-for='announcement-tt'>
            <Icon
              name='Announcement'
              onClick={() => setAnnouncement(!announcementSelected)}
              styleName={cx('action-icon', {
                'highlight-icon': announcementSelected
              })}
            />
            <ReactTooltip
              effect={'solid'}
              delayShow={550}
              id='announcement-tt'
            />
          </span>
        )}
        {showAnnouncementModal && (
          <SendAnnouncementModal
            closeModal={toggleAnnouncementModal}
            save={save}
            groupCount={groupCount}
            myModeratedGroups={myModeratedGroups}
            groups={groups}
          />
        )}
      </div>
      <Button
        onClick={announcementSelected ? toggleAnnouncementModal : save}
        disabled={!valid || loading}
        styleName='postButton'
        label={submitButtonLabel}
        color='green'
      />
    </div>
  )
}
