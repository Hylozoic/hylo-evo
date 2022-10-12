import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import Avatar from 'components/Avatar'
import './SuggestionList.scss'

export default forwardRef(({ items, command, ...everything }, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0)

  const selectItem = index => {
    const item = items[index]

    if (item) {
      command(item)
    }
  }

  const upHandler = () => {
    setSelectedIndex((selectedIndex + items.length - 1) % items.length)
  }

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % items.length)
  }

  const enterHandler = () => {
    selectItem(selectedIndex)
  }

  useEffect(() => setSelectedIndex(0), [items])

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }) => {
      if (event.key === 'ArrowUp') {
        upHandler()
        return true
      }

      if (event.key === 'ArrowDown') {
        downHandler()
        return true
      }

      if (event.key === 'Enter') {
        enterHandler()
        return true
      }

      return false
    }
  }))

  return (
    <div styleName='items' className='suggestion-list-items'>
      {items.length > 0
        ? items.map((item, index) => (
          <button
            styleName={`item ${index === selectedIndex ? 'is-selected' : ''}`}
            className='suggestion-list-item'
            key={index}
            onClick={() => selectItem(index)}
          >
            {item.avatarUrl && (
              <Avatar avatarUrl={item.avatarUrl} small styleName='avatar' />
            )}
            {item.suggestionLabel}
          </button>
        ))
        : <div styleName='item' className='suggestion-list-items'>No result</div>}
    </div>
  )
})
