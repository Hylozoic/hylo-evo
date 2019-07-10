import React from 'react'
import { storiesOf } from '@storybook/react'
import PostLabel from './PostLabel'

storiesOf('PostLabel', module)
  .add('label',
    () => (
      <PostLabel type={'label'} className={'label'} />
    )
  )
  .add('discussion',
    () => (
      <PostLabel type={'discussion'} className={'discussion'} />
    )
  )
  .add('event',
    () => (
      <PostLabel type={'event'} className={'event'} />
    )
  )
  .add('offer',
    () => (
      <PostLabel type={'offer'} className={'offer'} />
    )
  )
  .add('project',
    () => (
      <PostLabel type={'project'} className={'project'} />
    )
  )
  .add('request',
    () => (
      <PostLabel type={'request'} className={'request'} />
    )
  )
