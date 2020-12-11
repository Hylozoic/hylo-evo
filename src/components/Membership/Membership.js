import React from 'react'
import { communityUrl } from 'util/navigation'
import { DEFAULT_AVATAR } from 'store/models/Community'
import { Link } from 'react-router-dom'
import Button from 'components/Button'
import RoundImage from 'components/RoundImage'
import './Membership.scss'

export default function Membership ({ membership, index, archive }) {
  const { community, hasModeratorRole } = membership

  const leave = () => {
    if (window.confirm(`Are you sure you want to leave ${community.name}?`)) {
      archive(community.id)
    }
  }

  return (
    <div styleName={`membership ${index % 2 === 0 ? 'even' : 'odd'}`}>
      <div styleName='role'>{hasModeratorRole ? 'Moderator' : 'Member'}</div> of
      <Button styleName='community' small color={'green-white'}>
        <Link to={communityUrl(community.slug)}>
          <RoundImage url={community.avatarUrl || DEFAULT_AVATAR} small /> {community.name}
        </Link>
      </Button>
      { archive && <span onClick={leave} styleName='leave-button'>Leave</span> }
    </div>
  )
}
