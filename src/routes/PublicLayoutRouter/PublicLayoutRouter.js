import cx from 'classnames'
import { Helmet } from 'react-helmet'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useParams, useLocation, useHistory, Redirect, Route, Switch } from 'react-router-dom'
import Div100vh from 'react-div-100vh'
import { POST_DETAIL_MATCH, GROUP_DETAIL_MATCH } from 'util/navigation'
import { CENTER_COLUMN_ID, DETAIL_COLUMN_ID } from 'util/scrolling'
import checkIsPostPublic from 'store/actions/checkIsPostPublic'
import checkIsPublicGroup from 'store/actions/checkIsPublicGroup'
import HyloCookieConsent from 'components/HyloCookieConsent'
import GroupDetail from 'routes/GroupDetail'
import GroupExplorer from 'routes/GroupExplorer'
import Loading from 'components/Loading'
import MapExplorer from 'routes/MapExplorer'
import PostDetail from 'routes/PostDetail'
import './PublicLayoutRouter.scss'

export default function PublicLayoutRouter (props) {
  const routeParams = useParams()
  const location = useLocation()
  const isMapView = routeParams?.view === 'map'

  return (
    <Div100vh styleName={cx('public-container', { 'map-view': isMapView })}>
      <PublicPageHeader />
      <Switch>
        <Route path={`/${POST_DETAIL_MATCH}`} exact component={PublicPostDetail} />
        <Route path='/:context(groups)/:groupSlug' exact component={PublicGroupDetail} />
        <Route path='/:context(public)/:view(map)' component={MapExplorerLayoutRouter} />
        <Route path='/:context(public)/:view(groups)' component={GroupExplorerLayoutRouter} />
        <Redirect from={`(.*)/${POST_DETAIL_MATCH}`} to='/post/:postId' />
        <Redirect to={{ pathname: '/public/map', state: { from: location } }} />
      </Switch>
      <HyloCookieConsent />
    </Div100vh>
  )
}

export function PublicGroupDetail (props) {
  const dispatch = useDispatch()
  const routeParams = useParams()
  const history = useHistory()
  const [loading, setLoading] = useState(true)
  const groupSlug = routeParams?.groupSlug

  useEffect(() => {
    (async () => {
      setLoading(true)

      const result = await dispatch(checkIsPublicGroup(groupSlug))
      const isPublicGroup = result?.payload?.data?.group?.visibility === 2
      if (!isPublicGroup) {
        history.replace('/login')
      }

      setLoading(false)
    })()
  }, [dispatch, groupSlug])

  if (loading) {
    return <Loading />
  }

  return (
    <div styleName='center-column non-map-view' id={CENTER_COLUMN_ID}>
      <GroupDetail {...props} />
    </div>
  )
}

export function PublicPostDetail (props) {
  const dispatch = useDispatch()
  const routeParams = useParams()
  const history = useHistory()
  const [loading, setLoading] = useState(true)
  const postId = routeParams?.postId

  useEffect(() => {
    (async () => {
      setLoading(true)

      const result = await dispatch(checkIsPostPublic(postId))
      const isPublicPost = result?.payload?.data?.post?.id

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
    <div styleName='center-column non-map-view' id={DETAIL_COLUMN_ID}>
      <div />
      <PostDetail {...props} />
      <div />
    </div>
  )
}

export function MapExplorerLayoutRouter (props) {
  return (
    <>
      <div />
      <div styleName='center-column map-view' id={CENTER_COLUMN_ID}>
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
      <div styleName='center-column non-map-view' id={CENTER_COLUMN_ID}>
        <div>
          <GroupExplorer />
        </div>
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
      <Helmet>
        <title>Hylo: Public</title>
        <meta name='description' content='Hylo: Public content' />
      </Helmet>
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
