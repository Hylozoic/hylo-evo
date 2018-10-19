import PropTypes from 'prop-types'
import React from 'react'
import { find, filter, get, sortBy, times } from 'lodash/fp'
import './PostFooter.scss'
import Icon from 'components/Icon'
import RoundImageRow from 'components/RoundImageRow'
import cx from 'classnames'
import ReactTooltip from 'react-tooltip'
import ModalDialog from 'components/ModalDialog'
import TextInput from 'components/TextInput'
import Member from 'components/Member'

const { string, array, number, func, object } = PropTypes

export default class PostFooter extends React.PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      showMembersDialog: false
    }
  }

  toggleMembersDialog = () => this.setState({showMembersDialog: !this.state.showMembersDialog})

  render () {
    const {
      id,
      currentUser,
      commenters,
      commentersTotal,
      votesTotal,
      myVote,
      vote,
      type,
      members,
      slug
    } = this.props
    let imageUrls, caption

    if (type !== 'project') {
      imageUrls = (commenters).map(p => p.avatarUrl)
      caption = commentCaption(commenters, commentersTotal, get('id', currentUser))
    } else {
      imageUrls = (members || []).map(p => p.avatarUrl)
      caption = commentCaption(members || [], members && members.length, get('id', currentUser), 'No project members', 'are members')
    }

    return <div styleName='footer'>
      <RoundImageRow imageUrls={imageUrls} styleName='people' onClick={this.toggleMembersDialog} />
      <span styleName='caption' onClick={this.toggleMembersDialog}>
        {caption}
      </span>
      {this.state.showMembersDialog && <ProjectMembersDialog
        onClose={this.toggleMembersDialog}
        members={members}
        slug={slug}
      />}
      <a onClick={vote} styleName={cx('vote-button', {voted: myVote})}
        data-tip-disable={myVote} data-tip='Upvote this post so more people see it.' data-for='postfooter-tt'>
        <Icon name='ArrowUp' styleName='arrowIcon' />
        {votesTotal}
      </a>
      <ReactTooltip
        effect={'solid'}
        delayShow={550}
        id='postfooter-tt' />
    </div>
  }
}

PostFooter.propTypes = {
  id: string,
  commenters: array,
  commentersTotal: number,
  votesTotal: number,
  vote: func,
  currentUser: object
}

export class ProjectMembersDialog extends React.PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      searchString: '',
      members: this.props.members
    }
  }
  
  search = ({ target }) => {
    const searchString = target.value
    const membersFilter = (m) => m.name.toLowerCase().includes(searchString.toLowerCase())

    this.setState({
      searchString,
      members: filter(membersFilter, this.props.members)}
    )
  }
  
  render () {
    const { members, searchString } = this.state
    const { onClose, slug } = this.props
    const loading = false

    return <ModalDialog key='members-dialog'
      closeModal={onClose}
      modalTitle='Project Members'
      notificationIconName='Star'
      showCancelButton={false}
      showSubmitButton={false}
      useNotificationFormat={false}>
        <div>
          <TextInput
            aria-label='members-search'
            autoFocus
            label='members-search'
            name='members-search'
            onChange={this.search}
            loading={loading}
            value={searchString}
            placeholder='Find a member'
          />
        </div>
        <div>
          {twoByTwo(members).map(pair => <div styleName='member-row' key={pair[0].id}>
            {pair.map(m => <Member
              member={m}
              slug={slug}
              subject={'project'}
              key={m.id}
            />)}
          </div>)}
        </div>
    </ModalDialog>
  }
}

export const commentCaption = (
  commenters,
  commentersTotal,
  meId,
  emptyMessage = 'Be the first to comment',
  meVerb = 'commented'
) => {
  commenters = find(c => c.id === meId, commenters) && commenters.length === 2
    ? sortBy(c => c.id !== meId, commenters) // me first
    : sortBy(c => c.id === meId, commenters) // me last
  var names = ''
  const firstName = person => person.id === meId ? 'You' : person.name.split(' ')[0]
  if (commenters.length === 0) {
    return emptyMessage
  } else if (commenters.length === 1) {
    names = firstName(commenters[0])
  } else if (commenters.length === 2) {
    names = `${firstName(commenters[0])} and ${firstName(commenters[1])}`
  } else {
    names = `${firstName(commenters[0])}, ${firstName(commenters[1])} and ${commentersTotal - 2} other${commentersTotal - 2 > 1 ? 's' : ''}`
  }
  return `${names} ${meVerb}`
}

export function twoByTwo (list) {
  return times(i => list.slice(i * 2, i * 2 + 2), (list.length + 1) / 2)
}
