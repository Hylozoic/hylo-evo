import PropTypes from 'prop-types'
import React from 'react'
import { HYLO_URL_REGEX } from 'util/navigation'

export default function ClickCatcher ({ tag, handleMouseOver, navigate, ...props }) {
  if (!['div', 'span', 'p'].includes(tag)) {
    throw new Error(`invalid tag for ClickCatcher: ${tag}`)
  }

  const handleClick = event => {
    var node = event.target
    if (node.nodeName.toLowerCase() !== 'a') return

    if (node.getAttribute('data-user-id') || node.getAttribute('data-search')) {
      event.preventDefault()
      navigate(node.getAttribute('href'))
      return
    }

    if (node.getAttribute('target') !== '_blank') {
      node.setAttribute('target', '_blank')
    }

    const matches = [...node.getAttribute('href').matchAll(HYLO_URL_REGEX)]
    if (matches[0] && matches[0].length === 2) {
      event.preventDefault()
      node.setAttribute('target', '_self')
      const urlPath = matches[0][1] === '' ? '/' : matches[0][1]
      node.setAttribute('href', urlPath)
      navigate(node.getAttribute('href'))
    }
  }
  return React.createElement(tag, { ...props, onClick: handleClick })
}
ClickCatcher.propTypes = {
  tag: PropTypes.string.isRequired,
  navigate: PropTypes.func
}
ClickCatcher.defaultProps = {
  tag: 'span'
}
