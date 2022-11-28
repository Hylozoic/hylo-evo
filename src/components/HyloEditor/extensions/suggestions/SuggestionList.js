import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import Avatar from 'components/Avatar'

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
    <div className='suggestion-list'>
      {items.length > 0
        ? items.map((item, index) => (
          <button
            className={`suggestion-list-item ${index === selectedIndex ? 'is-selected' : ''}`}
            key={index}
            onClick={() => selectItem(index)}
          >
            {item.avatarUrl && (
              <Avatar avatarUrl={item.avatarUrl} small className='suggestion-list-item-avatar' />
            )}
            {item.suggestionLabel}
          </button>
        ))
        : <button className='suggestion-list-item suggestion-list-item-no-result'>No result</button>}
    </div>
  )
})
