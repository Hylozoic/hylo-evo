import React from 'react'
import FullPageModal from 'routes/FullPageModal'

export default function GroupDeleteConfirmation ({ goToAllGroups }) {
  return <FullPageModal
    content={<div style={{ textAlign: 'center' }}>
      Your group has been deleted.
    </div>}
    onClose={goToAllGroups}
  />
}
