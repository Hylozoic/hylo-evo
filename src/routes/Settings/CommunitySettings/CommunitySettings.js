import React, { PropTypes, Component } from 'react'
import './CommunitySettings.scss'
import Button from 'components/Button'
import Loading from 'components/Loading'
import RoundImage from 'components/RoundImage'
const { string } = PropTypes

export default class CommunitySettings extends Component {
  static propTypes = {
    exampleProp: string
  }

  render () {
    const { communities, leaveCommunity } = this.props
    if (!communities) return <Loading />

    return <div>
      {communities.map(c =>
        <CommunityControl community={c} leaveCommunity={leaveCommunity} />)}
    </div>
  }
}

export function CommunityControl ({ community, leaveCommunity }) {
  const leave = () => {
    if (window.confirm(`Are you sure you want to leave ${community.name}?`)) {
      leaveCommunity(community.id)
    }
  }
  return <div styleName='community-control'>
    <RoundImage url={community.avatarUrl} medium styleName='avatar' />
    {community.name}
    <span onClick={leave} styleName='leave-button'>Leave</span>
  </div>
}
