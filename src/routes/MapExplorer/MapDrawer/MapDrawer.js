import React from 'react'
import PropTypes from 'prop-types'
import PostCard from 'components/PostCard'
import './MapDrawer.scss'

function MapDrawer (props) {
  let { posts, querystringParams, routeParams } = props

  const postsHTML = posts.map(post =>
    <PostCard
      routeParams={routeParams}
      querystringParams={querystringParams}
      post={post}
      styleName='postCard'
      expanded={false}
      key={post.id} />
  )

  return (
    <div styleName='container'>
      <h1>{posts.length} Results in this area</h1>
      {postsHTML}
    </div>
  )
}

MapDrawer.propTypes = {
  posts: PropTypes.array,
  querystringParams: PropTypes.object,
  routeParams: PropTypes.object
}

MapDrawer.defaultProps = {
  posts: [],
  querystringParams: {},
  routeParams: {}
}

export default MapDrawer
