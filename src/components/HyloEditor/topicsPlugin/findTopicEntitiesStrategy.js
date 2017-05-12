export default function (contentBlock, callback, contentState) {
  // let callback = (first, second) => {
  //   console.log(first, second)
  //   return cb(first, second)
  // }
  return contentBlock.findEntityRanges((character) => {
    const entityKey = character.getEntity()
    return (entityKey !== null && contentState.getEntity(entityKey).getType() === 'topic')
  }, callback)
}
