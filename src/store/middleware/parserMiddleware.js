export default function parserMiddleware (store) {
  return next => action => {
    return next(action)
  }
}
