import React from 'react'
import { storiesOf } from '@storybook/react'
import PostLabel from './PostLabel'

const markdown = `
Different labels for posts, possible types are:

- label
- discussion
- event
- offer
- project
- request
`

storiesOf('PostLabel', module)
  .add('label',
    () => (
      <PostLabel type={'label'} className={'label'} />
    ),
  {
    notes: { markdown }
  }
  )
  .add('discussion',
    () => (
      <PostLabel type={'discussion'} className={'discussion'} />
    ),
  {
    notes: { markdown }
  }
  )
  .add('event',
    () => (
      <PostLabel type={'event'} className={'event'} />
    ),
  {
    notes: { markdown }
  }
  )
  .add('offer',
    () => (
      <PostLabel type={'offer'} className={'offer'} />
    ),
  {
    notes: { markdown }
  }
  )
  .add('project',
    () => (
      <PostLabel type={'project'} className={'project'} />
    ),
  {
    notes: { markdown }
  }
  )
  .add('request',
    () => (
      <PostLabel type={'request'} className={'request'} />
    ),
  {
    notes: { markdown }
  }
  )
