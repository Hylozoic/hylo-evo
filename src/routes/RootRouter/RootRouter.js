import mixpanel from 'mixpanel-browser'
import React, { useState, useEffect, Suspense } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Route, Switch } from 'react-router'
import config, { isProduction, isTest } from 'config'
import Loading from 'components/Loading'
import checkLogin from 'store/actions/checkLogin'
import { getAuthorized } from 'store/selectors/getAuthState'
import { POST_DETAIL_MATCH } from 'util/navigation'

const AuthLayoutRouter = React.lazy(() => import('routes/AuthLayoutRouter'))
const PublicLayoutRouter = React.lazy(() => import('routes/PublicLayoutRouter'))
const NonAuthLayoutRouter = React.lazy(() => import('routes/NonAuthLayoutRouter'))

if (!isTest) {
  mixpanel.init(config.mixpanel.token, { debug: !isProduction })
}

export default function RootRouter () {
  const dispatch = useDispatch()
  const isAuthorized = useSelector(getAuthorized)
  const [loading, setLoading] = useState(true)

  // This should be the only place we check for a session from the API.
  // Routes will not be available until this check is complete.
  useEffect(() => {
    (async function () {
      setLoading(true)
      await dispatch(checkLogin())
      setLoading(false)
    }())
  }, [dispatch, checkLogin, setLoading])

  if (loading) {
    return (
      <Loading type='fullscreen' />
    )
  }

  if (isAuthorized) {
    return (
      <Suspense fallback={<Loading type='fullscreen' />}>
        <Route component={AuthLayoutRouter} />
      </Suspense>
    )
  }

  if (!isAuthorized) {
    return (
      <Switch>
        <Suspense fallback={<Loading type='fullscreen' />}>
          <Route path='/post/:id' component={PublicLayoutRouter} />
          <Route path='/public/groups' exact component={NonAuthLayoutRouter} />
          <Route path='/public' component={PublicLayoutRouter} />
          <Route path={'(.*)' + POST_DETAIL_MATCH} component={CheckPublicPost} />
          <Route component={NonAuthLayoutRouter} />
        </Suspense>
      </Switch>
    )
  }
}

// Move into `PublicLayoutRouter`
function CheckPublicPost (props) {
  const postId = props.match.params.postId
  const query =
    `query Post ($id: ID) {
      post (id: $id) {
        isPublic
      }
    }`

  const fetchPost = (id) => {
    return {
      type: 'IS_POST_PUBLIC',
      graphql: {
        query,
        variables: { id }
      },
      meta: { extractModel: 'Person' }
    }
  }

  const dispatch = useDispatch()

  useEffect(() => {
    (async () => {
      const result = await dispatch(fetchPost(postId))
      const isPublicPost = result?.payload?.data?.post?.isPublic
      props.history.replace(isPublicPost ? '/post/' + postId : '/login')
    })()
  }, [dispatch, postId])

  return <Loading />
}
