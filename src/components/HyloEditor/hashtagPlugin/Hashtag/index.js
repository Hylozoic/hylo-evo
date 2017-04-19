import React from 'react'
import unionClassNames from 'union-class-names'

function HashtagLink ({ hashtag, children, className }) {
  return <a
    href={hashtag.get('link')}
    className={className}
    spellCheck={false}
  >
    {children}
  </a>
}

function HashtagText ({ children, className }) {
  return <span
    className={className}
    spellCheck={false}
  >
    {children}
  </span>
}

export default function Hashtag (props) {
  const {
    entityKey,
    theme = {},
    hashtagComponent,
    children,
    decoratedText,
    className,
    contentState,
    offsetKey
  } = props

  const combinedClassName = unionClassNames(theme.hashtag, className)
  const hashtag = contentState.getEntity(entityKey).getData()['HASHTAG']

  const Component = (
    hashtagComponent || (hashtag.has('link') ? HashtagLink : HashtagText)
  )

  return (
    <Component
      entityKey={entityKey}
      hashtag={hashtag}
      theme={theme}
      className={combinedClassName}
      decoratedText={decoratedText}
      data-offset-key={offsetKey}
    >
      {children}
    </Component>
  )
}
