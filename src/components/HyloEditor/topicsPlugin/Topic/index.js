import React from 'react'
import unionClassNames from 'union-class-names'

function TopicLink ({ topic, children, className }) {
  return <a
    href={topic.get('link')}
    className={className}
    spellCheck={false}
  >
    {children}
  </a>
}

function TopicText ({ children, className }) {
  return <span
    className={className}
    spellCheck={false}
  >
    {children}
  </span>
}

export default function Topic (props) {
  const {
    entityKey,
    theme = {},
    topicComponent,
    children,
    decoratedText,
    className,
    contentState,
    offsetKey
  } = props

  const combinedClassName = unionClassNames(theme.topic, className)
  const topic = contentState.getEntity(entityKey).getData()['topic']

  const Component = (
    topicComponent || (topic.has('link') ? TopicLink : TopicText)
  )

  return (
    <Component
      entityKey={entityKey}
      topic={topic}
      theme={theme}
      className={combinedClassName}
      decoratedText={decoratedText}
      data-offset-key={offsetKey}
    >
      {children}
    </Component>
  )
}
