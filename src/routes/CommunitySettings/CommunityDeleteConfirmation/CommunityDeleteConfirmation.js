import React from 'react'
import FullPageModal from 'routes/FullPageModal'

export default function CommunityDeleteConfirmation ({ goToAllCommunities }) {
  return <FullPageModal
    content={<div>
      Your community has been deleted.
    </div>}
    onClose={goToAllCommunities}
  />
}
