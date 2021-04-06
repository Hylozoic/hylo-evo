import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { DEFAULT_AVATAR } from 'store/models/Group'
import GroupDetail from 'routes/GroupDetail'
import Icon from 'components/Icon'
import { isEmpty } from 'lodash/fp'
import Loading from 'components/Loading'
import RoundImage from 'components/RoundImage'
import Widget from 'components/Widget'

import './LandingPage.scss'

export default class LandingPage extends Component {
  static propTypes = {
    group: PropTypes.object,
    showAbout: PropTypes.func
  }

  static defaultProps = {
    group: {},
    showAbout: () => {}
  }

  componentDidMount () {
    this.fetchOrShowCached()
  }

  componentDidUpdate () {
  }

  fetchOrShowCached = () => {
    const { posts, fetchPosts } = this.props
    if (isEmpty(posts)) fetchPosts()
  }

  render () {
    const { group, posts, location, match, routeParams, showAbout, showDetails } = this.props
    if (!group) return <Loading />

    const canView = group.memberCount > 0
    const widgets = (group.widgets || []).filter(w => w.name !== 'Community map')
    const locationText = group && group.locationObject && (group.locationObject.fullText || `${group.locationObject.city}, ${group.locationObject.country}`)

    if (!canView) return (<GroupDetail location={location} match={match} groupId={group.id} />)

    return (
      <div>
        <div styleName='banner' style={{ backgroundImage: `url(${group.bannerUrl})` }}>
          { canView && (
            <div styleName='right'>
              <span styleName='about' onClick={showAbout}><Icon name='Info' />About us</span>
            </div>
          )}

          <div styleName='title'>
            <RoundImage url={group.avatarUrl || DEFAULT_AVATAR} large hasBorder={false} />
            <div>
              <div styleName='name'>{group.name}</div>
              <div styleName='location'><Icon name='Location' />{locationText}</div>
            </div>
          </div>
        </div>

        {widgets && widgets.map(widget =>
          <Widget
            {...widget}
            key={widget.id}
            group={group}
            posts={posts}
            routeParams={routeParams}
            showDetails={showDetails}
          />
        )}
      </div>
    )
  }
}
