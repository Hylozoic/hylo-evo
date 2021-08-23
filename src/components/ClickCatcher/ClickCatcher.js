import PropTypes from 'prop-types'
import React from 'react'
import { hyloUrlRegex } from 'util/navigation'

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

    const matches = [...node.getAttribute('href').matchAll(hyloUrlRegex)]
    if (matches[0] && matches[0].length === 2) {
      node.setAttribute('target', '_self')
      const urlPath = matches[0][1] === '' ? '/' : matches[0][1]
      node.setAttribute('href', urlPath)
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
