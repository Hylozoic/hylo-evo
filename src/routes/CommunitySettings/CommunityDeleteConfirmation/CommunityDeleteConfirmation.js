import React from 'react'
import FullPageModal from 'routes/FullPageModal'

export default function CommunityDeleteConfirmation ({ goToAllCommunities }) {
  return <FullPageModal
    content={<div style={{ textAlign: 'center' }}>
      Your community has been deleted.
    </div>}
    onClose={goToAllCommunities}
  />
}
