import React, { Component } from 'react'
import StripeCheckout from 'react-stripe-checkout'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { get, throttle, isEmpty } from 'lodash/fp'
import { tagUrl } from 'util/navigation'
import { DETAIL_COLUMN_ID, position } from 'util/scrolling'
import { PostImage, PostBody, PostFooter, PostHeader, PostCommunities } from 'components/PostCard'
import ScrollListener from 'components/ScrollListener'
import Comments from './Comments'
import SocketSubscriber from 'components/SocketSubscriber'
import Button from 'components/Button'
import Loading from 'components/Loading'
import NotFound from 'components/NotFound'
import TextInput from 'components/TextInput'
import ProjectMembersDialog from 'components/ProjectMembersDialog'
import './PostDetail.scss'

// the height of the header plus the padding-top
const STICKY_HEADER_SCROLL_OFFSET = 78

export default class PostDetail extends Component {
  static propTypes = {
    post: PropTypes.object,
    routeParams: PropTypes.object,
    currentUser: PropTypes.object,
    fetchPost: PropTypes.func
  }

  state = {
    atHeader: false,
    headerWidth: 0,
    headerScrollOffset: 0,
    atActivity: false,
    activityWidth: 0,
    activityScrollOffset: 0,
    showMembersDialog: false
  }

  setHeaderStateFromDOM = () => {
    const container = document.getElementById(DETAIL_COLUMN_ID)
    if (!container) return
    this.setState({
      headerWidth: container.offsetWidth
    })
  }

  setActivityStateFromDOM = activity => {
    const element = ReactDOM.findDOMNode(activity)
    const container = document.getElementById(DETAIL_COLUMN_ID)
    if (!element || !container) return
    const offset = position(element, container).y - STICKY_HEADER_SCROLL_OFFSET
    this.setState({
      activityWidth: element.offsetWidth,
      activityScrollOffset: offset
    })
  }

  componentDidMount () {
    this.onPostIdChange()
  }

  componentDidUpdate (prevProps) {
    if (this.props.id && this.props.id !== prevProps.id) {
      this.onPostIdChange()
    }
  }

  onPostIdChange = () => {
    this.props.fetchPost()
  }

  handleScroll = throttle(100, event => {
    const { scrollTop } = event.target
    const {
      atHeader,
      atActivity,
      headerScrollOffset,
      activityScrollOffset
    } = this.state
    if (!atActivity && scrollTop >= activityScrollOffset) {
      this.setState({atActivity: true})
    } else if (atActivity && scrollTop < activityScrollOffset) {
      this.setState({atActivity: false})
    }

    if (!atHeader && scrollTop > headerScrollOffset) {
      this.setState({atHeader: true})
    } else if (atHeader && scrollTop <= headerScrollOffset) {
      this.setState({atHeader: false})
    }
  })

  toggleMembersDialog = () => this.setState(state => ({showMembersDialog: !state.showMembersDialog}))

  render () {
    const {
      routeParams,
      post,
      voteOnPost,
      isProjectMember,
      joinProject,
      leaveProject,
      pending,
      processStripeToken
    } = this.props
    const { atHeader, atActivity, headerWidth, activityWidth } = this.state

    if (!post && !pending) return <NotFound />
    if (pending) return <Loading />

    const isProject = get('type', post) === 'project'
    const { acceptContributions, totalContributions } = post || {}
    const scrollToBottom = () => {
      const detail = document.getElementById(DETAIL_COLUMN_ID)
      detail.scrollTop = detail.scrollHeight
    }
    const headerStyle = {
      width: headerWidth + 'px'
    }
    const activityStyle = {
      width: activityWidth + 'px',
      marginTop: STICKY_HEADER_SCROLL_OFFSET + 'px'
    }
    const hasMembers = post.members.length > 0
    let { showMembersDialog } = this.state
    showMembersDialog = hasMembers && showMembersDialog
    const toggleMembersDialog = hasMembers && this.toggleMembersDialog ? this.toggleMembersDialog : undefined
    const postFooter = <PostFooter
      {...post}
      voteOnPost={voteOnPost}
      onClick={toggleMembersDialog} />

    return <div styleName='post' ref={this.setHeaderStateFromDOM}>
      <ScrollListener elementId={DETAIL_COLUMN_ID} onScroll={this.handleScroll} />
      <PostHeader styleName='header' topicsOnNewline {...post} routeParams={routeParams} />
      {atHeader && <div styleName='header-sticky' style={headerStyle}>
        <PostHeader styleName='header' topicsOnNewline {...post} routeParams={routeParams} />
      </div>}
      <PostImage postId={post.id} styleName='image' linked />
      <PostTags tags={post.tags} />
      <PostBody
        styleName='body'
        expanded
        slug={routeParams.slug}
        {...post} />
      {isProject && <div styleName='join-project-button-container'>
        <JoinProjectButton
          joinProject={joinProject}
          leaveProject={leaveProject}
          leaving={isProjectMember} />
      </div>}
      {isProject && acceptContributions &&
        <ProjectContributions
          postId={post.id}
          totalContributions={totalContributions}
          processStripeToken={processStripeToken} />}
      <PostCommunities
        communities={post.communities}
        slug={routeParams.slug}
        showBottomBorder />
      <div styleName='activity-header' ref={this.setActivityStateFromDOM}>ACTIVITY</div>
      {postFooter}
      {showMembersDialog && <ProjectMembersDialog
        members={post.members}
        onClose={toggleMembersDialog} />}
      {atActivity && <div styleName='activity-sticky' style={activityStyle}>
        <div styleName='activity-header'>ACTIVITY</div>
        {postFooter}
      </div>}
      <Comments postId={post.id} slug={routeParams.slug} scrollToBottom={scrollToBottom} />
      <SocketSubscriber type='post' id={post.id} />
    </div>
  }
}

export function PostTags ({ tags, slug }) {
  if (isEmpty(tags)) return null

  return <div styleName='tags'>
    {tags.map(tag => <Link styleName='tag' to={tagUrl(tag, slug)} key={tag}>
      #{tag}
    </Link>)}
  </div>
}

export function JoinProjectButton ({ leaving, joinProject, leaveProject }) {
  const buttonText = leaving ? 'Leave Project' : 'Join Project'
  const onClick = () => leaving ? leaveProject() : joinProject()

  return <Button
    color='green'
    key='join-project-button'
    narrow
    onClick={onClick}
    styleName='join-project-button'>
    {buttonText}
  </Button>
}

export class ProjectContributions extends Component {
  state = {
    expanded: false,
    contributionAmount: ''
  }

  toggleExpanded = () => {
    this.setState({
      expanded: !this.state.expanded,
      received: false
    })
  }

  setAmount = (event) => {
    this.setState({
      contributionAmount: event.target.value.replace('$', '')
    })
  }

  render () {
    const { postId, totalContributions, processStripeToken } = this.props
    const { expanded, contributionAmount, received, error } = this.state

    const onToken = token => {
      this.setState({
        expanded: false,
        received: false,
        error: false
      })
      processStripeToken(postId, token.id, contributionAmount)
      .then(({ error }) => {
        this.setAmount({target: {value: '0'}})
        if (error) {
          this.setState({error: true})
        } else {
          this.setState({received: true})
        }
      })
    }

    const contributionAmountNumber = Number(contributionAmount)
    const valid = !isNaN(contributionAmountNumber) &&
      contributionAmount > 0

    return <div styleName='project-contributions'>
      {received && <div styleName='success-notification'>Thanks for your contribution!</div>}
      {error && <div styleName='error-notification'>There was a problem processing your payment. Please check your card details and try again.</div>}
      {!expanded && !received && <Button
        color='green'
        onClick={this.toggleExpanded}
        label='Contribute'
        small
        narrow />}
      {expanded && <div>
        <div styleName='amount-row'>
          <span styleName='amount-label'>Amount</span>
          <TextInput
            onChange={this.setAmount}
            inputRef={input => { this.amountInput = input }}
            value={'$' + contributionAmount}
            noClearButton />
        </div>
        <StripeCheckout
          disabled={!valid}
          name='Contributing Via Stripe'
          token={onToken}
          stripeKey={process.env.STRIPE_PUBLISHABLE_KEY}
          amount={Number(contributionAmount)} />
        <Button
          styleName='cancel-button'
          color='gray'
          onClick={this.toggleExpanded}
          label='Cancel'
          small
          narrow />
      </div>}
      <div styleName='project-contributions-total'>Contributions so far: ${totalContributions}</div>
    </div>
  }
}