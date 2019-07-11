import React from 'react'
import { storiesOf } from '@storybook/react'
import SendAnnouncementModal from './SendAnnouncementModal'

storiesOf('SendAnnouncementModal', module)
  .add('basic',
    () => (
      <SendAnnouncementModal
        communities={
          [
            { id: 1 },
            { id: 2 }
          ]
        }
        myModeratedCommunities={
          [
            { id: 1 },
            { id: 2 }
          ]
        }
        communityCount={0}
      />
    ),
    { notes: 'Modal to send announcement to one or more communities' }
  )
  .add('One community',
    () => (
      <SendAnnouncementModal
        communities={
          [
            { id: 1 },
            { id: 2 }
          ]
        }
        myModeratedCommunities={
          [
            { id: 1 },
            { id: 2 }
          ]
        }
        communityCount={1}
      />
    ),
    { notes: 'Case for one community' }
  )
  .add('Two communities',
    () => (
      <SendAnnouncementModal
        communities={
          [
            { id: 1 },
            { id: 2 }
          ]
        }
        myModeratedCommunities={
          [
            { id: 1 },
            { id: 2 }
          ]
        }
        communityCount={2}
      />
    ),
    { notes: 'Case for two or more communities' }
  )
