import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { DEFAULT_AVATAR } from 'store/models/Group'
import Icon from 'components/Icon'
import Loading from 'components/Loading'
import RoundImage from 'components/RoundImage'
import Widget from 'components/Widget'
import { groupDetailUrl, groupUrl } from 'util/navigation'

import './LandingPage.scss'

class LandingPage extends Component {
  static propTypes = {
    group: PropTypes.object
  }

  static defaultProps = {
    group: {}
  }

  componentDidMount () {
    this.props.fetchPosts()
  }

  render () {
    const { childGroups, group, isAboutOpen, isModerator, posts, routeParams, widgets } = this.props
    if (!group) return <Loading />

    return (
      <div>
        <div styleName='banner' style={{ backgroundImage: `url(${group.bannerUrl})` }}>
          <div styleName='right'>
            <Link styleName='about' to={isAboutOpen ? groupUrl(group.slug, 'explore') : groupDetailUrl(group.slug, { context: 'groups', view: 'explore', groupSlug: group.slug })}><Icon name='Info' />{this.props.t('About us')}</Link>
          </div>

          <div styleName='title'>
            <RoundImage url={group.avatarUrl || DEFAULT_AVATAR} large hasBorder={false} styleName='landing-page-avatar' />
            <div>
              <div styleName='name'>{group.name}</div>
              {group.location ? <div styleName='location'><Icon name='Location' />{group.location}</div> : ''}
            </div>
          </div>
          <div styleName='bg-fade' />
        </div>
        {widgets && widgets.map(widget => // so each widget already gets childGroups, posts and the group entity
          <Widget
            {...widget}
            childGroups={childGroups}
            key={widget.id}
            group={group}
            isModerator={isModerator}
            posts={posts}
            routeParams={routeParams}
          />
        )}
      </div>
    )
  }
}

export default withTranslation()(LandingPage)
