import React from 'react'
import { useHistory } from 'react-router-dom'
import { personUrl, topicUrl } from 'util/navigation'

export const HYLO_URL_REGEX = /http[s]?:\/\/(?:www\.)?hylo\.com(.*)/gi // https://regex101.com/r/0GZMny/1

export default function ClickCatcher ({ handleMouseOver, groupSlug, ...props }) {
  const history = useHistory()

  return React.createElement('span', { ...props, onClick: handleClick(history.push, groupSlug) })
}

export const handleClick = (push, groupSlug) => event => {
  const element = event.target

  switch (element?.nodeName.toLowerCase()) {
    case 'a': {
      // Legacy mention
      if (element.getAttribute('data-user-id') || element.getAttribute('data-search')) {
        event.preventDefault()
        push(element.getAttribute('href'))

        return
      }

      // Ordinary link handling
      if (element.getAttribute('target') !== '_blank') {
        element.setAttribute('target', '_blank')
      }

      const matches = [...element.getAttribute('href').matchAll(HYLO_URL_REGEX)]

      if (matches[0] && matches[0].length === 2) {
        event.preventDefault()
        const urlPath = matches[0][1] === '' ? '/' : matches[0][1]

        element.setAttribute('target', '_self')
        element.setAttribute('href', urlPath)
        push(element.getAttribute('href'))
      }

      return
    }

    case 'span': {
      switch (element.getAttribute('data-type')) {
        case 'mention': {
          event.preventDefault()
          return push(personUrl(element.getAttribute('data-id'), groupSlug))
        }

        case 'topic': {
          event.preventDefault()
          return push(topicUrl(element.getAttribute('data-id'), { groupSlug }))
        }
      }
    }
  }
}
