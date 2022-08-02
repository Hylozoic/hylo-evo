import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import Avatar from 'components/Avatar'
import './MentionList.scss'

export default forwardRef(({ items, command }, ref) => {
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

      if (event.key === ' ') {
        selectItem(selectedIndex)
        return true
      }

      return false
    }
  }))

  return (
    <div styleName='items'>
      {items.length > 0
        ? items.map((item, index) => (
          <button
            styleName={`item ${index === selectedIndex ? 'is-selected' : ''}`}
            key={index}
            onClick={() => selectItem(index)}
          >
            {item.avatarURL && (
              <Avatar avatarUrl={item.avatarUrl} small styleName='avatar' />
            )}
            {item.label}
          </button>
        ))
        : <div styleName='item'>No result</div>}
    </div>
  )
})
