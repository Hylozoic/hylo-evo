export default function filterDeletedUsers (user) {
  return user.name && !user.name.includes('Deleted User')
}
