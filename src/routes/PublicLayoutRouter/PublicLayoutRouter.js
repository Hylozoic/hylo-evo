import cx from 'classnames'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useParams, useLocation, useHistory, Redirect, Route, Switch } from 'react-router-dom'
import Div100vh from 'react-div-100vh'
import { POST_DETAIL_MATCH, GROUP_DETAIL_MATCH } from 'util/navigation'
import { CENTER_COLUMN_ID, DETAIL_COLUMN_ID } from 'util/scrolling'
import HyloCookieConsent from 'components/HyloCookieConsent'
import GroupDetail from 'routes/GroupDetail'
import GroupExplorer from 'routes/GroupExplorer'
import Loading from 'components/Loading'
import MapExplorer from 'routes/MapExplorer'
import PostDetail from 'routes/PostDetail'
import './PublicLayoutRouter.scss'

export default function PublicRouter (props) {
  const routeParams = useParams()
  const location = useLocation()
  const isMapView = routeParams?.view === 'map'

  return (
    <Div100vh styleName={cx('public-container', { 'map-view': isMapView })}>
      <PublicPageHeader />
      <Switch>
        <Route path={`/${POST_DETAIL_MATCH}`} exact component={PublicPostDetail} />
        <Route path='/:context(public)/:view(map)' component={MapExplorerLayoutRouter} />
        <Route path='/:context(public)/:view(groups)' exact component={GroupExplorerLayoutRouter} />
        {/* Remove this once we show the public stream */}
        <Redirect exact from={`/public/${POST_DETAIL_MATCH}`} to='/post/:postId' />
        <Redirect to={{ pathname: '/public/map', state: { from: location } }} />
      </Switch>
      <HyloCookieConsent />
    </Div100vh>
  )
}

export function PublicPostDetail (props) {
  const dispatch = useDispatch()
  const routeParams = useParams()
  const history = useHistory()
  const [loading, setLoading] = useState(true)
  const postId = routeParams?.postId
  const checkPublicQuery =
    `query Post ($id: ID) {
      post (id: $id) {
        isPublic
      }
    }`

  const checkPublic = (id) => {
    return {
      type: 'IS_POST_PUBLIC',
      graphql: {
        query: checkPublicQuery,
        variables: { id }
      },
      meta: { extractModel: 'Person' }
    }
  }

  useEffect(() => {
    (async () => {
      setLoading(true)

      const result = await dispatch(checkPublic(postId))
      const isPublicPost = result?.payload?.data?.post?.isPublic

      if (!isPublicPost) {
        history.replace('/login')
      }

      setLoading(false)
    })()
  }, [dispatch, postId])

  if (loading) {
    return <Loading />
  }

  return (
    <div styleName='center-column' id={DETAIL_COLUMN_ID}>
      <PostDetail {...props} />
    </div>
  )
}

export function MapExplorerLayoutRouter (props) {
  return (
    <>
      <div styleName='center-column' id={CENTER_COLUMN_ID}>
        <MapExplorer {...props} />
      </div>
      <Route
        path={`(.*)/${POST_DETAIL_MATCH}`}
        render={routeProps => (
          <div styleName='detail' id={DETAIL_COLUMN_ID}>
            <PostDetail {...routeProps} />
          </div>
        )}
      />
      <Route
        path={`(.*)/${GROUP_DETAIL_MATCH}`}
        render={routeProps => (
          <div styleName='detail' id={DETAIL_COLUMN_ID}>
            <GroupDetail {...routeProps} />
          </div>
        )}
      />
    </>
  )
}

export function GroupExplorerLayoutRouter () {
  return (
    <>
      <div styleName='center-column' id={CENTER_COLUMN_ID}>
        <GroupExplorer />
      </div>
      <Route
        path={`(.*)/${GROUP_DETAIL_MATCH}`}
        render={routeProps => (
          <div styleName='detail' id={DETAIL_COLUMN_ID}>
            <GroupDetail {...routeProps} />
          </div>
        )}
      />
    </>
  )
}

export function PublicPageHeader () {
  return (
    <div styleName='background'>
      <div styleName='header'>
        <a href='/'>
          <img styleName='logo' src='/assets/navy-merkaba.svg' alt='Hylo logo' />
        </a>
        <div styleName='access-controls'>
          <a href='/login'>Sign in</a>
          <a styleName='sign-up' href='/signup'>Join Hylo</a>
        </div>
      </div>
    </div>
  )
}
