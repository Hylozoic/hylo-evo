const getQueryParamsObjectFromString = (queryParamString) => {
  let obj = {}
  const params = new URLSearchParams(queryParamString)
  for (const [key, value] of params) {
    obj[key] = value
  }
  return obj
}

export default getQueryParamsObjectFromString
