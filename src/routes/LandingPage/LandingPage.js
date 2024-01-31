import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import GroupBanner from 'components/GroupBanner'
import Loading from 'components/Loading'
import Widget from 'components/Widget'

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
    const { childGroups, group, isModerator, posts, routeParams, widgets } = this.props
    if (!group) return <Loading />

    return (
      <div>
        <GroupBanner
          context='group'
          group={group}
          routeParams={routeParams}
        />

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
