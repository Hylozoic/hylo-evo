import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { DEFAULT_AVATAR } from 'store/models/Community'
import CommunityDetail from 'routes/CommunityDetail'
import Icon from 'components/Icon'
import Loading from 'components/Loading'
import RoundImage from 'components/RoundImage'

import './LandingPage.scss'

export default class LandingPage extends Component {
  static propTypes = {
    community: PropTypes.object,
    showAbout: PropTypes.func
  }

  static defaultProps = {
    community: {},
    showAbout: () => {}
  }

  componentDidMount () {
  }

  componentDidUpdate () {
  }

  render () {
    const { community, location, match, showAbout } = this.props

    if (!community) return <Loading />

    const canView = community.memberCount > 0
    const widgets = community.widgets.filter(w => w.isVisible).sort((a, b) => a.order - b.order)
    const locationText = community.locationObject.fullText || `${community.locationObject.city}, ${community.locationObject.country}`

    if (!canView) return (<CommunityDetail canClose={false} location={location} match={match} communityId={community.id} />)

    return (
      <div>
        <div styleName='banner' style={{ backgroundImage: `url(${community.bannerUrl})` }}>
          { canView && (
            <div styleName='right'>
              <span styleName='about' onClick={showAbout}><Icon name='Info' />About us</span>
            </div>
          )}

          <div styleName='title'>
            <RoundImage url={community.avatarUrl || DEFAULT_AVATAR} large hasBorder={false} />
            <div>
              <div styleName='name'>{community.name}</div>
              <div styleName='location'><Icon name='Location' />{locationText}</div>
            </div>
          </div>
        </div>

        { community.memberCount > 0 && widgets && widgets.map(props => (<Widget {...props} />)) }
      </div>
    )
  }
}

export const Widget = ({ name }) => (<div styleName='widget'>{name}</div>)
