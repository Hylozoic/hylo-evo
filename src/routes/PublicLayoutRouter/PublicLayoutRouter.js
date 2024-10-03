import cx from 'classnames'
import { Helmet } from 'react-helmet'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useParams, useLocation, useNavigate, Navigate, Route, Routes } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
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
import classes from './PublicLayoutRouter.module.scss'

export default function PublicLayoutRouter (props) {
  const routeParams = useParams()
  const location = useLocation()
  const isMapView = routeParams?.view === 'map'

  return (
    <Div100vh className={cx(classes.publicContainer, { [classes.mapView]: isMapView })}>
      <PublicPageHeader />
      <Routes>
        <Route path={`/${POST_DETAIL_MATCH}`} element={<PublicPostDetail />} />
        <Route path='/:context(groups)/:groupSlug' element={<PublicGroupDetail />} />
        <Route path='/:context(public)/:view(map)' element={<MapExplorerLayoutRouter />} />
        <Route path='/:context(public)/:view(groups)' element={<GroupExplorerLayoutRouter />} />
        <Route path={`${POST_DETAIL_MATCH}`} element={<Navigate to='/post/:postId' replace />} />
        <Route element={<Navigate to='/login' state={{ from: location }} replace />} />
      </Routes>
      <HyloCookieConsent />
    </Div100vh>
  )
}

export function PublicGroupDetail (props) {
  const dispatch = useDispatch()
  const routeParams = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [loading, setLoading] = useState(true)
  const groupSlug = routeParams?.groupSlug

  useEffect(() => {
    (async () => {
      setLoading(true)
      const result = await dispatch(checkIsPublicGroup(groupSlug))
      const isPublicGroup = result?.payload?.data?.group?.visibility === 2
      if (!isPublicGroup) {
        navigate('/login?returnToUrl=' + location.pathname + location.search, { replace: true })
      }

      setLoading(false)
    })()
  }, [dispatch, groupSlug, location.pathname, location.search, navigate])

  if (loading) {
    return <Loading />
  }

  return (
    <>
      <div className={cx(classes.centerColumn, classes.nonMapView)} id={CENTER_COLUMN_ID}>
        <GroupDetail {...props} />
      </div>
      <Route
        path={`${POST_DETAIL_MATCH}`}
        element={<PublicPostRouteRedirector />}
      />
    </>
  )
}

export function PublicPostRouteRedirector (props) {
  const dispatch = useDispatch()
  const routeParams = useParams()
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()
  const postId = routeParams?.postId

  useEffect(() => {
    (async () => {
      setLoading(true)

      const result = await dispatch(checkIsPostPublic(postId))
      const isPublicPost = result?.payload?.data?.post?.id
      if (!isPublicPost) {
        navigate('/login?returnToUrl=' + location.pathname + location.search, { replace: true })
      }

      setLoading(false)
    })()
  }, [dispatch, location.pathname, location.search, navigate, postId])

  if (loading) {
    return <Loading />
  }
  return (<Navigate to={`/post/${postId}`} replace />)
}

export function PublicPostDetail (props) {
  const dispatch = useDispatch()
  const routeParams = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [loading, setLoading] = useState(true)
  const postId = routeParams?.postId

  useEffect(() => {
    (async () => {
      setLoading(true)

      const result = await dispatch(checkIsPostPublic(postId))
      const isPublicPost = result?.payload?.data?.post?.id

      if (!isPublicPost) {
        navigate('/login?returnToUrl=' + location.pathname + location.search, { replace: true })
      }

      setLoading(false)
    })()
  }, [dispatch, postId])

  if (loading) {
    return <Loading />
  }

  return (
    <div className={cx(classes.centerColumn, classes.nonMapView)} id={DETAIL_COLUMN_ID}>
      <div>
        <PostDetail {...props} />
      </div>
    </div>
  )
}

export function MapExplorerLayoutRouter (props) {
  const navigate = useNavigate()

  return (
    <>
      <div className={cx(classes.centerColumn, classes.mapView)} id={CENTER_COLUMN_ID}>
        <MapExplorer {...props} navigate={navigate} />
      </div>
      <Route
        path={POST_DETAIL_MATCH}
        element={
          <div className={classes.detail} id={DETAIL_COLUMN_ID}>
            <PostDetail />
          </div>
        }
      />
      <Route
        path={GROUP_DETAIL_MATCH}
        element={
          <div className={classes.detail} id={DETAIL_COLUMN_ID}>
            <GroupDetail />
          </div>
        }
      />
    </>
  )
}

export function GroupExplorerLayoutRouter () {
  return (
    <>
      <div className={cx(classes.centerColumn, classes.nonMapView)} id={CENTER_COLUMN_ID}>
        <div>
          <GroupExplorer />
        </div>
      </div>
      <Route
        path={GROUP_DETAIL_MATCH}
        element={
          <div className={classes.detail} id={DETAIL_COLUMN_ID}>
            <GroupDetail />
          </div>
        }
      />
    </>
  )
}

export function PublicPageHeader () {
  const { t } = useTranslation()
  return (
    <div className={classes.background}>
      <Helmet>
        <title>{t('Public')} | Hylo</title>
        <meta name='description' content='Hylo: Public content' />
      </Helmet>
      <div className={classes.wrapper}>
        <div className={classes.header}>
          <a href='/'>
            <img className={classes.logo} src='/assets/navy-merkaba.svg' alt={t('Hylo logo')} />
          </a>
          <div className={classes.accessControls}>
            <a href='/login'>{t('Sign in')}</a>
            <a className={classes.signUp} href='/signup'>{t('Join Hylo')}</a>
          </div>
        </div>
      </div>
    </div>
  )
}
