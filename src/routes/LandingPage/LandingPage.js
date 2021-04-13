import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { DEFAULT_AVATAR } from 'store/models/Group'
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

  fetchOrShowCached = () => {
    const { posts, fetchPosts } = this.props
    if (isEmpty(posts)) fetchPosts()
  }

  render () {
    const { group, posts, routeParams, showAbout, showDetails, widgets } = this.props
    if (!group) return <Loading />

    return (
      <div>
        <div styleName='banner' style={{ backgroundImage: `url(${group.bannerUrl})` }}>
          <div styleName='right'>
            <span styleName='about' onClick={showAbout}><Icon name='Info' />About us</span>
          </div>

          <div styleName='title'>
            <RoundImage url={group.avatarUrl || DEFAULT_AVATAR} large hasBorder={false} />
            <div>
              <div styleName='name'>{group.name}</div>
              {group.location ? <div styleName='location'><Icon name='Location' />{group.location}</div> : ''}
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
