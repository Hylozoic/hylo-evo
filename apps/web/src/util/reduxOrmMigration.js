// * ReduxORM Migration utilities
// These are used to begin to slowly uncouple ReduxORM from components
// in anticipation of eventual replacement. It is also generally best
// practice to not have components assume not be tied to a prorietary data
// structure.

export function toRefArray (arrayOrModelInstance) {
  return arrayOrModelInstance.toRefArray
    ? arrayOrModelInstance.toRefArray()
    : arrayOrModelInstance
}

export function itemsToArray (maybeHasItems) {
  return maybeHasItems.items
    ? maybeHasItems.items
    : maybeHasItems
}
