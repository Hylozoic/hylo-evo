const getRouteParam = (key, state, props, warn = true) => {
  if (warn && !props.match) console.warn(`getRouteParam('${key}') missing props.match`)
  return props?.match?.params?.[key]
}

export default getRouteParam
