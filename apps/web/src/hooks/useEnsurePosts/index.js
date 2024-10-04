import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { createSelector } from 'reselect'
import useRouterParams from 'hooks/useRouterParams'
import fetchPosts from 'store/actions/fetchPosts'
import { FETCH_POSTS_FOR_WIDGETS } from 'store/constants'
import presentPost from 'store/presenters/presentPost'
import { getPosts } from 'store/selectors/getPosts'
import isPendingFor from 'store/selectors/isPendingFor'

const selectAndPresentPosts = createSelector(
  (state, fetchPostsParam) => getPosts(state, fetchPostsParam),
  (posts) => posts.map(p => presentPost(p, null))
)

export default function useEnsurePosts ({ context, sortBy, currentUser }) {
  const routerParams = useRouterParams()
  const groupSlug = routerParams.groupSlug || routerParams.detailGroupSlug
  const fetchPostsParam = {
    slug: groupSlug,
    context,
    sortBy
  }
  const posts = useSelector(state => selectAndPresentPosts(state, fetchPostsParam))
  const pending = useSelector(state => isPendingFor(FETCH_POSTS_FOR_WIDGETS, state))
  const dispatch = useDispatch()

  /*
    Using this for groupDetail posts
    where will this show up
    - public map (but associated with a group)
    - group explorer
    - contexts where the viewer is within the group, and outside of it

    In each of these contexts, the posts will be associated with a group
  */

  useEffect(() => {
    if (!pending && (!posts || !posts.length > 0)) {
      dispatch(fetchPosts({ slug: groupSlug, sortBy, context }))
    }
  }, [groupSlug])

  if (!currentUser) return { posts: [], pending: false }

  return { posts, pending }
}
