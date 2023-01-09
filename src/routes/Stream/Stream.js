import cx from 'classnames'
import { get } from 'lodash/fp'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import StreamBanner from 'components/StreamBanner'
import Loading from 'components/Loading'
import NoPosts from 'components/NoPosts'
import PostListRow from 'components/PostListRow'
import PostCard from 'components/PostCard'
import PostGridItem from 'components/PostGridItem'
import PostBigGridItem from 'components/PostBigGridItem'
import ScrollListener from 'components/ScrollListener'
import ViewControls from 'components/StreamViewControls'
import TopicFeedHeader from 'components/TopicFeedHeader'
import { CENTER_COLUMN_ID } from 'util/scrolling'
import './Stream.scss'

const propHasChanged = (thisProps, prevProps) => sel => get(sel, thisProps) !== get(sel, prevProps)

const viewComponent = {
  cards: PostCard,
  list: PostListRow,
  grid: PostGridItem,
  bigGrid: PostBigGridItem
}

export default class Stream extends Component {
  static propTypes = {
    routeParams: PropTypes.object,
    selectedPostId: PropTypes.string,
    postTypeFilter: PropTypes.string,
    sortBy: PropTypes.string,
    viewMode: PropTypes.string,
    fetchPosts: PropTypes.func.isRequired,
    changeTab: PropTypes.func.isRequired,
    changeSort: PropTypes.func.isRequired,
    changeView: PropTypes.func.isRequired,
    changeSearch: PropTypes.func.isRequired
  }

  componentDidMount () {
    const { routeParams, fetchTopic } = this.props
    const { topicName } = routeParams

    if (topicName) fetchTopic()
    this.fetchPosts(0)
  }

  componentDidUpdate (prevProps) {
    if (!prevProps) return

    const { fetchTopic } = this.props

    const hasChanged = propHasChanged(this.props, prevProps)

    if (hasChanged('postTypeFilter') ||
      hasChanged('sortBy') ||
      hasChanged('childPostInclusion') ||
      hasChanged('context') ||
      hasChanged('group.id') ||
      hasChanged('search') ||
      hasChanged('customViewId') ||
      hasChanged('topic') ||
      hasChanged('view')) {
      this.fetchPosts(0)
    }

    if (hasChanged('topicName')) fetchTopic()
  }

  fetchPosts (offset) {
    const { pending, hasMore, fetchPosts } = this.props

    if (pending || hasMore === false) return

    fetchPosts(offset)
  }

  render () {
    const {
      customActivePostsOnly,
      changeChildPostInclusion,
      changeSearch,
      changeSort,
      changeTab,
      changeView,
      childPostInclusion,
      context,
      currentUser,
      currentUserHasMemberships,
      customPostTypes,
      customViewTopics,
      customViewType,
      followersTotal,
      groupTopic,
      group,
      newPost,
      routeParams,
      posts,
      postTypeFilter,
      pending,
      postsTotal,
      querystringParams,
      respondToEvent,
      search,
      selectedPostId,
      sortBy,
      topicLoading,
      toggleGroupTopicSubscribe,
      view,
      viewIcon,
      viewName,
      viewMode
    } = this.props

    const ViewComponent = viewComponent[viewMode]
    const { topicName, groupSlug } = routeParams

    if (topicLoading) return <Loading />

    return (
      <>
        <Helmet>
          <title>{group ? `Hylo: ${group.name}` : 'Hylo'}</title>
          <meta name='description' content={group ? `Posts from ${group.name}. ${group.description}` : 'Group Not Found'} />
        </Helmet>
        {topicName
          ? (
            <TopicFeedHeader
              isSubscribed={groupTopic && groupTopic.isSubscribed}
              toggleSubscribe={
                groupTopic
                  ? () => toggleGroupTopicSubscribe(groupTopic)
                  : null
              }
              groupSlug={groupSlug}
              topicName={topicName}
              postsTotal={postsTotal}
              followersTotal={followersTotal}
              type={postTypeFilter}
              currentUser={currentUser}
              bannerUrl={group && group.bannerUrl}
              newPost={newPost}
            />
          ) : (
            <StreamBanner
              customPostTypes={customPostTypes}
              customActivePostsOnly={customActivePostsOnly}
              customViewTopics={customViewTopics}
              customViewType={customViewType}
              context={context}
              currentUser={currentUser}
              currentUserHasMemberships={currentUserHasMemberships}
              group={group}
              newPost={newPost}
              querystringParams={querystringParams}
              routeParams={routeParams}
              type={postTypeFilter}
              icon={viewIcon}
              label={viewName}
            />
          )}
        <ViewControls
          routeParams={routeParams} view={view} customPostTypes={customPostTypes} customViewType={customViewType}
          postTypeFilter={postTypeFilter} sortBy={sortBy} viewMode={viewMode} searchValue={search}
          changeTab={changeTab} changeSort={changeSort} changeView={changeView} changeSearch={changeSearch}
          changeChildPostInclusion={changeChildPostInclusion} childPostInclusion={childPostInclusion}
        />
        <div styleName={cx('stream-items', { 'stream-grid': viewMode === 'grid', 'big-grid': viewMode === 'bigGrid' })}>
          {!pending && posts.length === 0 ? <NoPosts /> : ''}
          {posts.map(post => {
            const expanded = selectedPostId === post.id
            const groupSlugs = post.groups.map(group => group.slug)
            return (
              <ViewComponent
                styleName={cx({ 'card-item': viewMode === 'cards', expanded })}
                expanded={expanded}
                routeParams={routeParams}
                post={post}
                key={post.id}
                currentUser={currentUser}
                respondToEvent={respondToEvent}
                querystringParams={querystringParams}
                childPost={!groupSlugs.includes(groupSlug)}
              />
            )
          })}
        </div>
        <ScrollListener
          onBottom={() => this.fetchPosts(posts.length)}
          elementId={CENTER_COLUMN_ID}
        />
        {pending && <Loading />}
      </>
    )
  }
}
