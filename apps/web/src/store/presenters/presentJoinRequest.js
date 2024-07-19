export default function presentJoinRequest (jr) {
  if (!jr) return null

  return {
    ...jr.ref,
    group: jr.group ? jr.group.ref : null
  }
}
