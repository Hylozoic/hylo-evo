export const setQuerystringParam = (key, value, location) => {
  const querystringParams = new URLSearchParams(location.search)
  querystringParams.set(key, value)
  return querystringParams.toString()
}

export default setQuerystringParam
