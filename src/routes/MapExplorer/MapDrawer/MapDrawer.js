import React, { useState } from 'react'
import PropTypes from 'prop-types'
import PostCard from 'components/PostCard'
import './MapDrawer.scss'

function MapDrawer (props) {
  let { onSearch, posts, querystringParams, routeParams } = props

  const [search, setSearch] = useState('')

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
      <h1>{posts.length} result{posts.length === 1 ? '' : 's'} in this area</h1>
      <input
        type='text'
        onChange={e => { setSearch(e.target.value); onSearch(e.target) }}
        placeholder='Search among these results'
        value={search}
      />
      {postsHTML}
    </div>
  )
}

MapDrawer.propTypes = {
  posts: PropTypes.array,
  querystringParams: PropTypes.object,
  routeParams: PropTypes.object,
  onSearch: PropTypes.function
}

MapDrawer.defaultProps = {
  posts: [],
  querystringParams: {},
  routeParams: {},
  onSearch: (input) => { console.log('Searching for: ' + input.value) }
}

export default MapDrawer
