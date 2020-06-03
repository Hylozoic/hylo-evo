import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Dropdown from 'components/Dropdown'
import Icon from 'components/Icon'
import PostCard from 'components/PostCard'
import { SORT_OPTIONS } from '../MapExplorer.store'
import './MapDrawer.scss'

function MapDrawer (props) {
  let { onChangeSort, onSearch, posts, querystringParams, routeParams } = props

  const [search, setSearch] = useState('')
  const [sort, setSort] = useState(SORT_OPTIONS[0].id)

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

      <Dropdown styleName='sorter'
        toggleChildren={<span styleName='sorter-label'>
          {SORT_OPTIONS.find(o => o.id === sort).label}
          <Icon name='ArrowDown' />
        </span>}
        items={SORT_OPTIONS.map(({ id, label }) => ({
          label,
          onClick: () => { setSort(id); onChangeSort(id) }
        }))}
        alignRight
      />

      {postsHTML}
    </div>
  )
}

MapDrawer.propTypes = {
  posts: PropTypes.array,
  querystringParams: PropTypes.object,
  routeParams: PropTypes.object,
  onSearch: PropTypes.func,
  onChangeSort: PropTypes.func
}

MapDrawer.defaultProps = {
  posts: [],
  querystringParams: {},
  routeParams: {},
  onSearch: (input) => { console.log('Searching for: ' + input.value) },
  onChangeSort: (id) => { console.log('Changing sort to: ' + SORT_OPTIONS[id]) }
}

export default MapDrawer
