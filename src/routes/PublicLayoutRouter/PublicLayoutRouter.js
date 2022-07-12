import cx from 'classnames'
import { some } from 'lodash/fp'
import React from 'react'
import Div100vh from 'react-div-100vh'
import { matchPath, Redirect, Route, Switch } from 'react-router-dom'
import HyloCookieConsent from 'components/HyloCookieConsent'
import TopicSupportComingSoon from 'components/TopicSupportComingSoon'
import GroupDetail from 'routes/GroupDetail'
import GroupExplorer from 'routes/GroupExplorer'
import MapExplorer from 'routes/MapExplorer'
import PostDetail from 'routes/PostDetail'
import { OPTIONAL_POST_MATCH, POST_DETAIL_MATCH, GROUP_DETAIL_MATCH } from 'util/navigation'
import { CENTER_COLUMN_ID, DETAIL_COLUMN_ID } from 'util/scrolling'
import './PublicLayoutRouter.scss'

export default function PublicLayoutRouter (props) {
  const { location } = props
  const hasDetail = some(
    ({ path }) => matchPath(location.pathname, { path, exact: true }),
    detailRoutes
  )

  return (
    <Div100vh styleName='publicContainer'>
      <div styleName='background'>
        <div styleName='topRow'>
          <a href='/'>
            <img styleName='logo' src='/assets/hylo.svg' alt='Hylo logo' />
          </a>
        </div>
        <Div100vh id={CENTER_COLUMN_ID}>
          <Switch>
            <Route path={`/${POST_DETAIL_MATCH}`} component={PostDetail} />
            <Route path='/:context(public)/:view(map)' component={MapExplorer} />
            <Route path='/:context(public)/groups' exact component={GroupExplorer} />
            <Route path='/:context(public)/:topicName' exact component={TopicSupportComingSoon} />
            {/* Remove this once we show the public stream */}
            <Redirect exact from='/public/post/:id' to='/post/:id' />
            <Redirect
              exact
              from={`/public/${OPTIONAL_POST_MATCH}`}
              to={{ pathname: '/public/map', state: { from: location } }}
              key='streamToMap'
            />
          </Switch>
        </Div100vh>
        <div styleName={cx('detail', { hidden: !hasDetail })} id={DETAIL_COLUMN_ID}>
          <Switch>
            {detailRoutes.map(({ path, component }) => (
              <Route path={path} component={component} key={path} />)
            )}
          </Switch>
        </div>
      </div>
      <HyloCookieConsent />
    </Div100vh>
  )
}

const detailRoutes = [
  { path: `/:context(|public)/${POST_DETAIL_MATCH}`, component: PostDetail },
  { path: `/:context(|public)/:view(map)/${POST_DETAIL_MATCH}`, component: PostDetail },
  { path: `/:context(|public)/:view(map)/${GROUP_DETAIL_MATCH}`, component: GroupDetail }
]
