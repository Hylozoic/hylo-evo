import { DndContext, DragOverlay } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import update from 'immutability-helper'
import { isEmpty } from 'lodash'
import React, { forwardRef, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import useInView from 'react-cool-inview'
import { useDispatch, useSelector } from 'react-redux'
import Icon from 'components/Icon'
import Loading from 'components/Loading'
import RoundImage from 'components/RoundImage'
import useDebounce from 'hooks/useDebounce'
import fetchPosts from 'store/actions/fetchPosts'
import { FETCH_POSTS } from 'store/constants'
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
  const [dragIndex, setDragIndex] = useState(null)
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

  const handleDragStart = (event) => {
    setDragIndex(event.active.data.current.sortable.index)
  }

  const handleDragEnd = (event) => {
    const { active, over } = event

    if (active.id !== over.id) {
      const activeIndex = active.data.current.sortable.index
      const overIndex = over.data.current.sortable.index
      onReorderPost(selectedPosts[activeIndex], over.data.current.sortable.index)
      setSelectedPosts((prevPosts) => {
        return update(prevPosts, {
          $splice: [
            [activeIndex, 1],
            [overIndex, 0, prevPosts[activeIndex]]
          ]
        })
      })
    }
    setDragIndex(null)
  }

  const displaySuggestions = useMemo(() => {
    const selectedPostIds = selectedPosts.map(p => p.id)
    return suggestions.filter(s => !selectedPostIds.includes(s.id))
  }, [suggestions, selectedPosts])

  const pending = useSelector(state => isPendingFor(FETCH_POSTS, state))

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <SortableContext items={selectedPosts} strategy={verticalListSortingStrategy}>
        <div>
          <div styleName='selectedPosts'>
            {selectedPosts.map((p, i) => (
              <SelectedPostDraggable
                draggable={draggable}
                dragging={i === dragIndex}
                handleDelete={handleDelete}
                index={i}
                key={p.id}
                post={p}
              />)
            )}
          </div>
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
      </SortableContext>

      <DragOverlay>
        {dragIndex !== null
          ? (
            <SelectedPost
              draggable
              group={group}
              handleDelete={() => { }}
              index={dragIndex}
              post={selectedPosts[dragIndex]}
            />)
          : null}
      </DragOverlay>
    </DndContext>
  )
}

function SelectedPostDraggable ({ draggable, dragging, index, handleDelete, post }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({
    id: post.id,
    disabled: !draggable,
    transition: {
      duration: 150, // milliseconds
      easing: 'cubic-bezier(0.25, 1, 0.5, 1)'
    }
  })

  const style = {
    transform: CSS.Transform.toString(transform && { ...transform, scaleY: 1 }),
    transition,
    opacity: dragging ? 0 : 1,
    cursor: 'move'
  }

  return (
    <SelectedPost
      ref={setNodeRef}
      {...{ post, attributes, index, handleDelete, draggable, listeners, style }}
    />
  )
}

const SelectedPost = forwardRef(({ children, ...props }, ref) => {
  const { t } = useTranslation()
  const { attributes, draggable, index, handleDelete, listeners, post, style } = props

  return (
    <div styleName='selectedPost' ref={ref} style={style} {...attributes} {...listeners}>
      <RoundImage url={post.creator.avatarUrl} styleName='selectedPostAvatar' small />
      <span styleName='postTitle'>{post.title}</span>
      <Icon name='Trash' onClick={handleDelete(post, index)} styleName='removePost selectedPostIcon' dataTip={t('Remove Post')} />
      {draggable && <Icon name='Draggable' styleName='selectedPostIcon dragHandle' />}
    </div>
  )
})

function Suggestion ({ item, onSelect, observeRef }) {
  const { id, title, creator } = item
  return (
    <li key={id || 'blank'} styleName='suggestion' ref={observeRef}>
      <a onClick={event => onSelect(item, event)} styleName='suggestionLink'>
        <RoundImage url={creator.avatarUrl} styleName='suggestionAvatar' small />
        <div styleName='suggestionName'>{title}</div>
      </a>
    </li>
  )
}
