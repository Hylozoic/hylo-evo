export default function presentGroupInvite (invite) {
  if (!invite) return null

  return {
    ...invite.ref,
    creator: invite.creator ? invite.creator.ref : null,
    group: invite.group ? invite.group.ref : null
  }
}
