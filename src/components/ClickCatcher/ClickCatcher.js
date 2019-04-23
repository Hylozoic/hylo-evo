import PropTypes from 'prop-types'
import React from 'react'

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
