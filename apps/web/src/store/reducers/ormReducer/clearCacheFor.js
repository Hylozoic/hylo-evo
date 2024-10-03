export default function clearCacheFor (ormModel, id) {
  const modelInstance = ormModel.withId(id)
  // this line is to clear the selector memoization
  modelInstance && modelInstance.update({ _invalidate: (modelInstance._invalidate || 0) + 1 })
}
