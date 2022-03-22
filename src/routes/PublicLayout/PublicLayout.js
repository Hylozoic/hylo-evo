import cx from 'classnames'
import { some } from 'lodash/fp'
import React from 'react'
import Div100vh from 'react-div-100vh'
import { useLocation } from 'react-router'
import { matchPath, Redirect, Route, Switch } from 'react-router-dom'
import HyloCookieConsent from 'components/HyloCookieConsent'
import TopicSupportComingSoon from 'components/TopicSupportComingSoon'
import GroupDetail from 'routes/GroupDetail'
import MapExplorer from 'routes/MapExplorer'
import PostDetail from 'routes/PostDetail'
import { OPTIONAL_POST_MATCH, OPTIONAL_GROUP_MATCH, POST_DETAIL_MATCH, GROUP_DETAIL_MATCH } from 'util/navigation'
import { DETAIL_COLUMN_ID } from 'util/scrolling'
import './PublicLayout.scss'

export default function PublicLayout () {
  const location = useLocation()
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
        <Switch>
          <Route path={`/:context(public)/:view(map)/${OPTIONAL_POST_MATCH}`} exact component={MapExplorer} />
          <Route path={`/:context(public)/:view(map)/${OPTIONAL_GROUP_MATCH}`} exact component={MapExplorer} />
          <Route path='/:context(public)/:topicName' exact component={TopicSupportComingSoon} />
          <Redirect from={`/public/${OPTIONAL_POST_MATCH}`} exact to='/public/map' key='streamToMap' />
        </Switch>
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
