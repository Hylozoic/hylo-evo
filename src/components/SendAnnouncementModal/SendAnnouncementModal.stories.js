import React from 'react'
import { storiesOf } from '@storybook/react'
import SendAnnouncementModal from './SendAnnouncementModal'

storiesOf('SendAnnouncementModal', module)
  .add('show',
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
    { notes: 'Modal for send announcement for one or more communities' }
  )
  .add('One communitie',
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
    { notes: 'Case for one communitie' }
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
