/* eslint-disable react/jsx-curly-brace-presence */
import PropTypes from 'prop-types'
import React from 'react'
import ReactTooltip from 'react-tooltip'
import { withTranslation } from 'react-i18next'
import { debounce, get, isEqual } from 'lodash/fp'
import cx from 'classnames'
import Moment from 'moment-timezone'
import { POST_PROP_TYPES, POST_TYPES, PROPOSAL_ADVICE, PROPOSAL_CONSENSUS, PROPOSAL_CONSENT, PROPOSAL_GRADIENT, PROPOSAL_MULTIPLE_CHOICE, PROPOSAL_POLL_SINGLE, PROPOSAL_SCHEDULING, PROPOSAL_TEMPLATES, PROPOSAL_TYPE_MAJORITY, PROPOSAL_TYPE_MULTI_UNRESTRICTED, PROPOSAL_TYPE_SINGLE, PROPOSAL_YESNO } from 'store/models/Post'
import AttachmentManager from 'components/AttachmentManager'
import Icon from 'components/Icon'
import LocationInput from 'components/LocationInput'
import RoundImage from 'components/RoundImage'
import HyloEditor from 'components/HyloEditor'
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
import AnonymousVoteToggle from './AnonymousVoteToggle/AnonymousVoteToggle'
import SliderInput from 'components/SliderInput/SliderInput'
import Dropdown from 'components/Dropdown/Dropdown'
import styles from './PostEditor.scss'
import { PROJECT_CONTRIBUTIONS } from 'config/featureFlags'
import { MAX_POST_TOPICS } from 'util/constants'
import { setQuerystringParam } from 'util/navigation'
import { sanitizeURL } from 'util/url'
import Tooltip from 'components/Tooltip'


const emojiOptions = ['', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟', '✅✅', '👍', '👎', '⁉️', '‼️', '❓', '❗', '🚫', '➡️', '🛑', '✅', '🛑🛑', '🌈', '🔴', '🔵', '🟤', '🟣', '🟢', '🟡', '🟠', '⚫', '⚪', '🤷🤷', '📆', '🤔', '❤️', '👏', '🎉', '🔥', '🤣', '😢', '😡', '🤷', '💃🕺', '⛔', '🙏', '👀', '🙌', '💯', '🔗', '🚀', '💃', '🕺', '💯',]
export const MAX_TITLE_LENGTH = 80

class PostEditor extends React.Component {
  static propTypes = {
    context: PropTypes.string,
    clearLinkPreview: PropTypes.func,
    groupOptions: PropTypes.array,
    createPost: PropTypes.func,
    currentUser: PropTypes.object,
    currentGroup: PropTypes.object,
    editing: PropTypes.bool,
    goToPost: PropTypes.func,
    linkPreviewStatus: PropTypes.string,
    loading: PropTypes.bool,
    onClose: PropTypes.func,
    pollingFetchLinkPreview: PropTypes.func,
    post: PropTypes.shape(POST_PROP_TYPES),
    removeLinkPreview: PropTypes.func,
    setIsDirty: PropTypes.func,
    updatePost: PropTypes.func,
    fetchLocation: PropTypes.func,
    ensureLocationIdIfCoordinate: PropTypes.func
  }

  static defaultProps = {
    post: {
      type: 'discussion',
      title: '',
      details: '',
      groups: [],
      location: '',
      timezone: Moment.tz.guess()
    },
    postTypes: Object.keys(POST_TYPES).filter(t => t !== 'chat'),
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
    postType,
    t
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
        isPublic: context === 'public',
        isAnonymousVote: false,
        isStrictProposal: false,
        proposalOptions: [],
        proposalType: PROPOSAL_TYPE_SINGLE
      }
    )
    const currentPost = post
      ? {
          ...post,
          locationId: post.locationObject ? post.locationObject.id : null,
          startTime: Moment(post.startTime),
          endTime: Moment(post.endTime),
          proposalOptions: post.proposalOptions?.items || []
        }
      : defaultPostWithGroupsAndTopic

    return {
      post: currentPost,
      titlePlaceholder: this.titlePlaceholderForPostType(currentPost.type),
      detailPlaceholder: this.detailPlaceholderForPostType(currentPost.type),
      valid: editing === true || !!currentPost.title, // valid upon entry if editing or duplicating
      announcementSelected: announcementSelected,
      toggleAnnouncementModal: false,
      showPostTypeMenu: false,
      titleLengthError: currentPost.title?.length >= MAX_TITLE_LENGTH,
      dateError: false,
      allowAddTopic: true
    }
  }

  constructor (props) {
    super(props)
    const { t } = this.props
    // Dynamic strings that need to be invoked somewhere
    t('Quick topic-based chats')
    t('Talk about whats important with others')
    t('What can people help you with?')
    t('What do you have for others?')
    t('Let people know about available resources')
    t('Create a project that people can help with')
    t('Invite people to your event')
    t('Suggest a proposal for others to vote on')

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
      this.onUpdateLinkPreview()
    }
  }

  componentWillUnmount () {
    this.props.clearLinkPreview()
  }

  onUpdateLinkPreview () {
    this.setState({
      post: { ...this.state.post, linkPreview: this.props.linkPreview }
    })
  }

  reset = (props) => {
    this.editorRef.current.clearContent()
    this.groupsSelectorRef.current.reset()
    this.setState(this.buildStateFromProps(props))
  }

  focus = () => this.editorRef.current.focus()

  handlePostTypeSelection = (type) => (event) => {
    const { changeQueryString, location } = this.props
    this.setIsDirty(true)
    changeQueryString({
      pathname: location.pathname,
      search: setQuerystringParam('newPostType', type, location)
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
    const { t } = this.props

    const titlePlaceHolders = {
      offer: t('Add a title'),
      request: t('Add a title'),
      resource: t('Add a title'),
      project: t('Add a title'),
      event: t('Add a title'),
      proposal: t('Add a title'),
      default: t('Add a title')
    }

    return (
      titlePlaceHolders[type] ||
      titlePlaceHolders.default
    )
  }

  detailPlaceholderForPostType (type) {
    const { t } = this.props
    // XXX: right now we can't change these for post types otherwise changing post type will reset the HyloEditor content and lose content
    const detailPlaceHolders = {
      offer: t('Add a description'),
      request: t('Add a description'),
      resource: t('Add a description'),
      project: t('Add a description'),
      event: t('Add a description'),
      proposal: t('Add a description'),
      default: t('Add a description')
    }
    return (
      detailPlaceHolders[type] ||
      detailPlaceHolders.default
    )
  }

  postTypeButtonProps = (forPostType) => {
    const { loading, t } = this.props
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
          <span>{t(forPostType)}</span>{' '}
          <Icon styleName={`icon icon-${forPostType}`} name='ArrowDown' />
        </span>
      ) : t(forPostType)
    return {
      borderRadius: '5px',
      label,
      onClick: active ? this.togglePostTypeMenu : this.handlePostTypeSelection(forPostType),
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

  handledonationsLinkChange = (evt) => {
    const donationsLink = evt.target.value
    this.setState({
      post: { ...this.state.post, donationsLink },
      valid: this.isValid({ donationsLink })
    })
  }

  handleProjectManagementLinkChange = (evt) => {
    const projectManagementLink = evt.target.value
    this.setState({
      post: { ...this.state.post, projectManagementLink },
      valid: this.isValid({ projectManagementLink })
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

  // Checks for linkPreview every 1/2 second
  handleAddLinkPreview = debounce(500, (url, force) => {
    const { pollingFetchLinkPreview } = this.props
    const { linkPreview } = this.state.post

    if (linkPreview && !force) return

    pollingFetchLinkPreview(url)
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

  handleFeatureLinkPreview = featured => {
    this.setState({
      post: { ...this.state.post, linkPreviewFeatured: featured }
    })
  }

  handleRemoveLinkPreview = () => {
    this.props.removeLinkPreview()
    this.setState({
      post: { ...this.state.post, linkPreview: null, linkPreviewFeatured: false }
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

  toggleAnonymousVote = () => {
    const { isAnonymousVote } = this.state.post
    this.setState({
      post: { ...this.state.post, isAnonymousVote: !isAnonymousVote }
    })
  }

  toggleStrictProposal = () => {
    const { isStrictProposal } = this.state.post
    this.setState({
      post: { ...this.state.post, isStrictProposal: !isStrictProposal }
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
    const { type, title, groups, startTime, endTime, donationsLink, projectManagementLink, proposalOptions } = Object.assign(
      {},
      this.state.post,
      postUpdates
    )
    const { isEvent, isProject, isProposal } = this.props

    return !!(
      this.editorRef.current &&
      groups &&
      type.length > 0 &&
      title.length > 0 &&
      groups.length > 0 &&
      title.length <= MAX_TITLE_LENGTH &&
      (!isEvent || (endTime && startTime < endTime)) &&
      (!isProject || sanitizeURL(donationsLink) || !donationsLink) &&
      (!isProject || sanitizeURL(projectManagementLink) || !projectManagementLink) &&
      (!isProposal || proposalOptions.length > 0)
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
      acceptContributions,
      donationsLink,
      endTime,
      eventInvitations,
      groups,
      id,
      isAnonymousVote,
      isPublic,
      isStrictProposal,
      linkPreview,
      linkPreviewFeatured,
      locationId,
      members,
      projectManagementLink,
      proposalOptions,
      proposalType,
      quorum,
      startTime,
      timezone,
      title,
      topics,
      type
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
      acceptContributions,
      details,
      donationsLink: sanitizeURL(donationsLink),
      endTime,
      eventInviteeIds,
      fileUrls,
      groups,
      imageUrls,
      isAnonymousVote,
      isPublic,
      isStrictProposal,
      linkPreview,
      linkPreviewFeatured,
      location,
      locationId: actualLocationId,
      memberIds,
      projectManagementLink: sanitizeURL(projectManagementLink),
      proposalOptions,
      proposalType,
      quorum,
      sendAnnouncement: announcementSelected,
      startTime,
      timezone,
      title,
      topicNames,
      type
    }
    const saveFunc = editing ? updatePost : createPost
    setAnnouncement(false)
    saveFunc(postToSave).then(editing ? onClose : goToPost)
  }

  buttonLabel = () => {
    const { postPending, editing, t } = this.props
    if (postPending) return t('Posting...')
    if (editing) return t('Save')
    return t('Post')
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

  handleSetQuorum = (quorum) => {
    this.setState({
      post: { ...this.state.post, quorum }
    })
  }

  handleSetProposalType = (proposalType) => {
    this.setState({
      post: { ...this.state.post, proposalType }
    })
  }

  handleUseTemplate = (template) => {
    const templateData = PROPOSAL_TEMPLATES[template]
    this.setState({
      post: {
        ...this.state.post,
        proposalOptions: templateData.form.proposalOptions,
        title: this.state.post.title.length > 0 ? this.state.post.title : templateData.form.title,
        quorum: templateData.form.quorum,
        proposalType: templateData.form.proposalType
      },
      valid: this.isValid({ proposalOptions: templateData.form.proposalOptions })
    })
  }

  handleAddOption = () => {
    const { post } = this.state
    const proposalOptions = post.proposalOptions || []
    const newOptions = [...proposalOptions, { text: '', emoji: '', color: '' }]
    this.setState({
      post: { ...post, proposalOptions: newOptions },
      valid: this.isValid({ proposalOptions: newOptions })
    })
  }

  canModerate = () => {
    const { myModeratedGroups = [] } = this.props
    const { post } = this.state
    const { groups = [] } = post
    const myModeratedGroupsSlugs = myModeratedGroups.map(group => group.slug)
    for (let index = 0; index < groups.length; index++) {
      if (!myModeratedGroupsSlugs.includes(groups[index].slug)) return false
    }
    return true
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
      linkPreviewFeatured,
      topics,
      members,
      acceptContributions,
      eventInvitations,
      startTime,
      endTime,
      donationsLink,
      projectManagementLink,
      proposalOptions,
      proposalType
    } = post
    const {
      currentGroup,
      currentUser,
      groupOptions,
      loading,
      setAnnouncement,
      announcementSelected,
      myModeratedGroups,
      isProject,
      isEvent,
      isProposal,
      showFiles,
      showImages,
      addAttachment,
      postTypes,
      fetchLinkPreviewPending,
      t
    } = this.props
    const hasStripeAccount = get('hasStripeAccount', currentUser)
    const hasLocation = [
      'discussion',
      'event',
      'offer',
      'request',
      'resource',
      'project',
      'proposal'
    ].includes(type)
    const canHaveTimes = type !== 'discussion'
    const location = post.location || this.props.selectedLocation
    // Center location autocomplete either on post's current location,
    // or current group's location, or current user's location
    const locationObject =
      post.locationObject ||
      get('0.locationObject', groups) ||
      get('locationObject', currentUser)

    const donationsLinkPlaceholder = t('Add a donation link (must be valid URL)')
    const projectManagementLinkPlaceholder = t('Add a project management link (must be valid URL)')

    return (
      <div styleName={showAnnouncementModal ? 'hide' : 'wrapper'}>
        <div styleName='header'>
          <div styleName='initial'>
            <div>
              {type && <Button noDefaultStyles {...this.postTypeButtonProps(type)} />}
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
              <span styleName='title-error'>{t('Title limited to {{maxTitleLength}} characters', { maxTitleLength: MAX_TITLE_LENGTH })}</span>
            )}
            <HyloEditor
              styleName='editor'
              placeholder={detailPlaceholder}
              onUpdate={this.handleDetailsChange}
              // Disable edit cancel through escape due to event bubbling issues
              // onEscape={this.handleCancel}
              onAddTopic={this.handleAddTopic}
              onAddLink={this.handleAddLinkPreview}
              contentHTML={details}
              showMenu
              readOnly={loading}
              ref={this.editorRef}
            />
          </div>
        </div>
        {(linkPreview || fetchLinkPreviewPending) && (
          <LinkPreview
            loading={fetchLinkPreviewPending}
            linkPreview={linkPreview}
            featured={linkPreviewFeatured}
            onFeatured={this.handleFeatureLinkPreview}
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
              <div styleName='footerSection-label'>{t('Project Members')}</div>
              <div styleName='footerSection-groups'>
                <MemberSelector
                  initialMembers={members || []}
                  onChange={this.handleUpdateProjectMembers}
                  forGroups={groups}
                  readOnly={loading}
                />
              </div>
            </div>
          )}
          <div styleName='footerSection'>
            <div styleName='footerSection-label'>{t('Topics')}</div>
            <div styleName='footerSection-topics'>
              <TopicSelector
                forGroups={post?.groups || [currentGroup]}
                selectedTopics={topics}
                onChange={this.handleTopicSelectorOnChange}
              />
            </div>
          </div>
          <div styleName='footerSection'>
            <div styleName='footerSection-label'>{t('Post in')}</div>
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
          {isProposal && proposalOptions.length === 0 && (
            <div styleName='footerSection'>
              <div styleName='footerSection-label'>{t('Proposal template')}</div>

              <div styleName='inputContainer'>
                <Dropdown
                  styleName='dropdown'
                  toggleChildren={
                    <span styleName='dropdown-label'>
                      {t('Select pre-set')}
                      <Icon name='ArrowDown' blue />
                    </span>
                  }
                  items={[
                    { label: t(PROPOSAL_YESNO), onClick: () => this.handleUseTemplate(PROPOSAL_YESNO) },
                    { label: t(PROPOSAL_POLL_SINGLE), onClick: () => this.handleUseTemplate(PROPOSAL_POLL_SINGLE) },
                    { label: t(PROPOSAL_ADVICE), onClick: () => this.handleUseTemplate(PROPOSAL_ADVICE) },
                    { label: t(PROPOSAL_CONSENT), onClick: () => this.handleUseTemplate(PROPOSAL_CONSENT) },
                    { label: t(PROPOSAL_CONSENSUS), onClick: () => this.handleUseTemplate(PROPOSAL_CONSENSUS) },
                    { label: t(PROPOSAL_SCHEDULING), onClick: () => this.handleUseTemplate(PROPOSAL_SCHEDULING) },
                    { label: t(PROPOSAL_MULTIPLE_CHOICE), onClick: () => this.handleUseTemplate(PROPOSAL_MULTIPLE_CHOICE) },
                    { label: t(PROPOSAL_GRADIENT), onClick: () => this.handleUseTemplate(PROPOSAL_GRADIENT) }
                  ]}
                />
              </div>
            </div>
          )}
          {isProposal && proposalOptions && (
            <div styleName='footerSection'>
              <div styleName='footerSection-label'>{t('Proposal options')}</div>

              <div styleName='optionsContainer'>
                {proposalOptions.map((option, index) => (
                  <div styleName='proposalOption' key={index}>
                    {/* emojiPicker dropdown */}
                    <Dropdown
                      styleName='option-dropdown'
                      toggleChildren={
                        <span styleName='option-dropdown-label dropdown-label'>
                          {option.emoji || t('Emoji')}
                          <Icon name='ArrowDown' blue styleName={'option-dropdown-icon'} />
                        </span>
                      }
                    >
                      <div styleName='emoji-grid'>
                        {emojiOptions.map((emoji, i) => (
                          <div
                            key={i}
                            styleName='emoji-option'
                            onClick={() => {
                              const newOptions = [...proposalOptions]
                              newOptions[index].emoji = emoji
                              this.setState({
                                post: { ...post, proposalOptions: newOptions }
                              })
                            }}
                          >
                            {emoji}
                          </div>
                        ))}
                      </div>
                    </Dropdown>
                    <input
                      type='text'
                      styleName='optionTextInput'
                      placeholder={t('Describe option')}
                      value={option.text}
                      onChange={(evt) => {
                        const newOptions = [...proposalOptions]
                        newOptions[index].text = evt.target.value
                        this.setState({
                          post: { ...post, proposalOptions: newOptions }
                        })
                      }}
                      disabled={loading}
                    />
                    <Icon
                      name='Ex'
                      styleName='icon'
                      onClick={() => {
                        proposalOptions.splice(index, 1)
                        const newOptions = [...proposalOptions]
                        this.setState({
                          post: { ...post, proposalOptions: newOptions },
                          valid: this.isValid({ proposalOptions: newOptions })
                        })
                      }}
                    />
                  </div>
                ))}
                <div styleName='proposalOption' onClick={() => this.handleAddOption()}>
                  <Icon name='Plus' styleName='icon-plus' blue />
                  <span styleName='optionText'>{t('Add an option to vote on...')}</span>
                </div>
                {!isEqual(proposalOptions, this.props.post.proposalOptions?.items) && (
                  <div styleName='proposalOption warning' onClick={() => this.handleAddOption()}>
                    <Icon name='Hand' styleName='icon-plus' />
                    <span styleName='optionText'>{t('If you save changes to options, all votes will be discarded')}</span>
                  </div>
                )}
                {proposalOptions.length === 0 && (
                  <div styleName='proposalOption warning' onClick={() => this.handleAddOption()}>
                    <Icon name='Hand' styleName='icon-plus' />
                    <span styleName='optionText'>{t('Proposals require at least one option')}</span>
                  </div>
                )}
              </div>
            </div>
          )}
          {isProposal && (
            <div styleName='footerSection'>
              <div styleName='footerSection-label'>{t('Proposal type')}</div>

              <div styleName='inputContainer'>
                <Dropdown
                  styleName='dropdown'
                  toggleChildren={
                    <span styleName='dropdown-label'>
                      {proposalType ? t(`${proposalType}`) : t('Select pre-set')}
                      <Icon name='ArrowDown' blue />
                    </span>
                  }
                  items={[
                    { label: t('Single Vote per person'), onClick: () => this.handleSetProposalType(PROPOSAL_TYPE_SINGLE) },
                    { label: t('Multi-vote, unrestricted'), onClick: () => this.handleSetProposalType(PROPOSAL_TYPE_MULTI_UNRESTRICTED) },
                    { label: t('Majority'), onClick: () => this.handleSetProposalType(PROPOSAL_TYPE_MAJORITY) }
                  ]}
                />
              </div>
            </div>
          )}
          {isProposal && (
            <div styleName='footerSection'>
              <div styleName='footerSection-label'>{t('Quorum')}</div>
              <SliderInput percentage={post.quorum} setPercentage={this.handleSetQuorum} />
            </div>
          )}
          {isProposal && (
            <AnonymousVoteToggle
              isAnonymousVote={!!post.isAnonymousVote}
              toggleAnonymousVote={this.toggleAnonymousVote}
            />
          )}
          {/* {isProposal && (
            <StrictProposalToggle
              isStrictProposal={!!post.isStrictProposal}
              toggleStrictProposal={this.toggleStrictProposal}
            />
          )} */}
          <PublicToggle
            togglePublic={this.togglePublic}
            isPublic={!!post.isPublic}
          />
          {canHaveTimes && (
            <div styleName='footerSection'>
              <div styleName='footerSection-label'>{isProposal ? t('Voting window') : t('Timeframe')}</div>
              <div styleName='datePickerModule'>
                <DatePicker
                  value={startTime}
                  placeholder={t('Select Start')}
                  onChange={this.handleStartTimeChange}
                />
                <div styleName='footerSection-helper'>{t('To')}</div>
                <DatePicker
                  value={endTime}
                  placeholder={t('Select End')}
                  onChange={this.handleEndTimeChange}
                />
              </div>
            </div>
          )}
          {canHaveTimes && dateError && (
            <span styleName='datepicker-error'>
              {t('End Time must be after Start Time')}
            </span>
          )}
          {hasLocation && (
            <div styleName='footerSection'>
              <div styleName='footerSection-label alignedLabel'>{t('Location')}</div>
              <LocationInput
                saveLocationToDB
                locationObject={locationObject}
                location={location}
                onChange={this.handleLocationChange}
                placeholder={t('Where is your {{type}} located?', { type })}
              />
            </div>
          )}
          {isEvent && (
            <div styleName='footerSection'>
              <div styleName='footerSection-label'>{t('Invite People')}</div>
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
              <div styleName='footerSection-label'>{t('Accept Contributions')}</div>
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
                      {t(`If you turn 'Accept Contributions' on, people will be able
                      to send money to your Stripe connected account to support
                      this project.`)}
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
                  {t(`To accept financial contributions for this project, you have
                  to connect a Stripe account. Go to`)}
                  <a href='/settings/payment'>{t('Settings')}</a>{' '}{t('to set it up.')}
                  {t('(Remember to save your changes before leaving this form)')}
                </div>
              )}
            </div>
          )}
          {isProject && (
            <div styleName='footerSection'>
              <div styleName={cx('footerSection-label', { warning: !!donationsLink && !sanitizeURL(donationsLink) })}>{t('Donation Link')}</div>
              <div styleName='footerSection-groups'>
                <input
                  type='text'
                  styleName='textInput'
                  placeholder={donationsLinkPlaceholder}
                  value={donationsLink || ''}
                  onChange={this.handledonationsLinkChange}
                  disabled={loading}
                />
              </div>
            </div>
          )}
          {isProject && (
            <div styleName='footerSection'>
              <div styleName={cx('footerSection-label', { warning: !!projectManagementLink && !sanitizeURL(projectManagementLink) })}>{t('Project Management')}</div>
              <div styleName='footerSection-groups'>
                <input
                  type='text'
                  styleName='textInput'
                  placeholder={projectManagementLinkPlaceholder}
                  value={projectManagementLink || ''}
                  onChange={this.handleProjectManagementLinkChange}
                  disabled={loading}
                />
              </div>
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
            save={() => {
              if (isProposal && !isEqual(proposalOptions, this.props.post.proposalOptions?.items)) {
                if (window.confirm(t('Changing proposal options will reset the votes. Are you sure you want to continue?'))) {
                  this.save()
                }
              } else {
                this.save()
              }
            }}
            setAnnouncement={setAnnouncement}
            announcementSelected={announcementSelected}
            canModerate={this.canModerate()}
            toggleAnnouncementModal={this.toggleAnnouncementModal}
            showAnnouncementModal={showAnnouncementModal}
            groupCount={get('groups', post).length}
            myModeratedGroups={myModeratedGroups}
            groups={post.groups}
            t={t}
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
  submitButtonTooltip,
  save,
  setAnnouncement,
  announcementSelected,
  toggleAnnouncementModal,
  showAnnouncementModal,
  groupCount,
  canModerate,
  myModeratedGroups,
  groups,
  t
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
        dataTip={!valid ? t('You need a title and at least one group to post') : ''}
        dataFor='submit-tt'
      />
      <Tooltip
        delay={150}
        position='bottom'
        offset={{ top: 0 }}
        id='submit-tt'
      />
    </div>
  )
}

export default withTranslation()(PostEditor)
