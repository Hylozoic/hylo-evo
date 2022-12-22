import { isEmpty } from 'lodash'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import useInView from 'react-cool-inview'
import { useDrag, useDrop } from 'react-dnd'
import { useDispatch, useSelector } from 'react-redux'
import update from 'immutability-helper'
import { FETCH_POSTS } from 'store/constants'
import Icon from 'components/Icon'
import Loading from 'components/Loading'
import RoundImage from 'components/RoundImage'
import useDebounce from 'hooks/useDebounce'
import { fetchPosts } from 'routes/Stream/Stream.store'
import isPendingFor from 'store/selectors/isPendingFor'

import './PostSelector.scss'

const PAGE_SIZE = 10

export default function PostSelector ({ collection, draggable, group, onRemovePost, onReorderPost, onSelectPost, posts }) {
  const dispatch = useDispatch()
  const [autocomplete, setAutocomplete] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [offset, setOffset] = useState('')
  const [selectedPosts, setSelectedPosts] = useState(posts || [])
  const [suggestionsOpen, setSuggestionsOpen] = useState(false)
  const searchBoxRef = useRef()
  const { t } = useTranslation()

  const debouncedAutcomplete = useDebounce(autocomplete, 300)

  useEffect(() => setSelectedPosts(posts || []), [posts])

  useEffect(() => {
    // TODO: tell people they need to type 2 characters to get results?
    if (!autocomplete?.length || autocomplete.length > 1) {
      dispatch(fetchPosts({
        collectionToFilterOut: collection?.id,
        context: 'groups',
        first: PAGE_SIZE,
        offset: 0,
        search: debouncedAutcomplete,
        slug: group.slug,
        sortBy: 'created'
      })).then(res => {
        setSuggestions(res.payload?.data?.group?.posts?.items || [])
      })
      setOffset(PAGE_SIZE)
    }
  }, [debouncedAutcomplete, collection])

  const { observe } = useInView({
    onEnter: async () => {
      const res = await dispatch(fetchPosts({
        collectionToFilterOut: collection?.id,
        context: 'groups',
        first: PAGE_SIZE,
        search: debouncedAutcomplete,
        offset: offset,
        slug: group.slug,
        sortBy: 'created'
      }))
      setSuggestions(suggestions.concat(res.payload?.data?.group?.posts?.items || []))
      setOffset(offset + PAGE_SIZE)
    }
  })

  const hideSuggestions = () => setSuggestionsOpen(false)

  useEffect(() => {
    if (suggestionsOpen) {
      // initiate the event handler
      window.addEventListener('click', hideSuggestions)

      // this will clean up the event every time the component is re-rendered
      return function cleanup () {
        window.removeEventListener('click', hideSuggestions)
      }
    }
  }, [suggestionsOpen])

  const handleInputChange = (input) => {
    setAutocomplete(input)
  }

  const handleDelete = (post, index) => () => {
    if (window.confirm(t('Remove post?'))) {
      setSelectedPosts((prevPosts) => {
        onRemovePost(post)
        return update(prevPosts, {
          $splice: [
            [index, 1]
          ]
        })
      })
    }
  }

  const handleSelectPost = (p, event) => {
    if (onSelectPost) {
      onSelectPost(p)
    }
    setSelectedPosts([...selectedPosts].concat(p))
    searchBoxRef.current.focus()
    event.preventDefault()
    event.stopPropagation()
  }

  const movePost = useCallback((dragIndex, hoverIndex) => {
    setSelectedPosts((prevPosts) => {
      onReorderPost(prevPosts[dragIndex], hoverIndex)
      return update(prevPosts, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, prevPosts[dragIndex]]
        ]
      })
    })
  }, [])

  const displaySuggestions = useMemo(() => {
    const selectedPostIds = selectedPosts.map(p => p.id)
    return suggestions.filter(s => !selectedPostIds.includes(s.id))
  }, [suggestions, selectedPosts])

  const pending = useSelector(state => isPendingFor(FETCH_POSTS, state))

  return (
    <div>
      <ul styleName='selectedPosts'>
        {selectedPosts.map((p, i) => (
          <SelectedPost
            draggable={draggable}
            handleDelete={handleDelete}
            index={i}
            key={p.id}
            movePost={movePost}
            post={p}
          />)
        )}
      </ul>
      <div styleName='search'>
        <div>
          <input
            ref={searchBoxRef}
            type='text'
            placeholder={t('Search for posts')}
            spellCheck={false}
            onChange={event => handleInputChange(event.target.value)}
            onFocus={() => setSuggestionsOpen(true)}
            onClick={(e) => { e.preventDefault(); e.stopPropagation() }}
          />
        </div>
        {suggestionsOpen && (pending || !isEmpty(displaySuggestions)) &&
          <div styleName='suggestionsWrapper'>
            {pending && <Loading />}
            <ul styleName='suggestions'>
              {displaySuggestions.map((s, idx) => (
                <Suggestion
                  key={s.id}
                  item={s}
                  onSelect={handleSelectPost}
                  observeRef={idx === suggestions.length - 1 ? observe : null}
                />
              ))}
            </ul>
          </div>
        }
      </div>
    </div>
  )
}

export function SelectedPost ({ draggable, post, index, movePost, handleDelete }) {
  const ref = useRef(null)
  const { t } = useTranslation()

  const [{ handlerId }, drop] = useDrop({ // eslint-disable-line no-unused-vars
    accept: 'post',
    collect (monitor) {
      return {
        handlerId: monitor.getHandlerId()
      }
    },
    hover (item, monitor) {
      if (!ref.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = index
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return
      }
      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect()
      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
      // Determine mouse position
      const clientOffset = monitor.getClientOffset()
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }
      // Time to actually perform the action
      movePost(dragIndex, hoverIndex)
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex
    }
  })
  const [{ isDragging }, drag] = useDrag({
    type: 'post',
    item: () => {
      return { id: post.id, index }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  })
  const opacity = isDragging ? 0 : 1
  if (draggable) {
    drag(drop(ref))
  }

  return <li key={post.id} ref={ref} style={{ opacity, cursor: draggable ? 'move' : 'default' }}>
    <RoundImage url={post.creator.avatarUrl} styleName='selectedPostAvatar' small />
    <span styleName='postTitle'>{post.title}</span>
    <Icon name='Trash' onClick={handleDelete(post, index)} styleName='removePost selectedPostIcon' dataTip={t('Remove Post')} />
    {draggable && <Icon name='Draggable' styleName='selectedPostIcon dragHandle' />}
  </li>
}

export function Suggestion ({ item, onSelect, observeRef }) {
  const { id, title, creator } = item
  return <li key={id || 'blank'} styleName='suggestion' ref={observeRef}>
    <a onClick={event => onSelect(item, event)} styleName='suggestionLink'>
      <RoundImage url={creator.avatarUrl} styleName='suggestionAvatar' small />
      <div styleName='suggestionName'>{title}</div>
    </a>
  </li>
}
