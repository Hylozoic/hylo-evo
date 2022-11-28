import React from 'react'

export default function HyloHTML ({
  html,
  element = 'div',
  ...props
}) {
  return (
    React.createElement(
      element,
      {
        ...props,
        dangerouslySetInnerHTML: { __html: html }
      }
    )
  )
}
