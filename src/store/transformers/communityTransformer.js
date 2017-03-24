export default function transform (entity) {
  // Functions taking the value to modify as a single argument.
  const transforms = {
    members: members => members.map(m => m.id)
  }

  const transformed = {
    ...entity
  }

  Object.keys(transforms).forEach(key => {
    if (entity[key] !== undefined) {
      transformed[key] = transforms[key](entity[key])
    }
  })

  return transformed
}
