import CoordinateParser from 'coordinate-parser'

export function convertMapboxToLocation (mapboxResult) {
  const context = mapboxResult.context
  const neighborhoodObject = context && context.find(c => c.id.includes('neighborhood'))
  const postcodeObject = context && context.find(c => c.id.includes('postcode'))
  const placeObject = context && context.find(c => c.id.includes('place'))
  const regionObject = context && context.find(c => c.id.includes('region'))
  const countryObject = context && context.find(c => c.id.includes('country'))

  const city = placeObject ? placeObject.text : mapboxResult.place_type[0] === 'place' ? mapboxResult.text : ''

  let addressNumber = ''
  let addressStreet = ''
  if (mapboxResult.properties.address) {
    // For Points of Interest and landmarks Mapbox annoyingly stores the address in a single string inside properties
    addressNumber = mapboxResult.properties.address.split(' ')[0]
    addressStreet = mapboxResult.properties.address.split(' ')[1]
  } else if (mapboxResult.place_type[0] === 'address') {
    addressStreet = mapboxResult.text
    addressNumber = mapboxResult.address
  }

  return {
    accuracy: mapboxResult.properties.accuracy,
    addressNumber,
    addressStreet,
    bbox: mapboxResult.bbox ? [{ lng: mapboxResult.bbox[0], lat: mapboxResult.bbox[1] }, { lng: mapboxResult.bbox[2], lat: mapboxResult.bbox[3] }] : null,
    center: { lng: mapboxResult.center[0], lat: mapboxResult.center[1] },
    city,
    country: countryObject && countryObject.text,
    country_code: countryObject && countryObject.short_code,
    fullText: mapboxResult.place_name,
    // geometry: [Point]
    // locality
    mapboxId: mapboxResult.id,
    neighborhood: neighborhoodObject && neighborhoodObject.text,
    region: regionObject && regionObject.text,
    postcode: postcodeObject && postcodeObject.text
    // wikidata: String
  }
}

export function parseCoordinate (coordinate) {
  let error
  let parsedCoordinate
  try {
    parsedCoordinate = new CoordinateParser(coordinate)
  } catch (err) {
    error = err
    return { coordinate: null, error }
  }
  return { coordinate: { lng: parsedCoordinate.getLongitude(), lat: parsedCoordinate.getLatitude(), string: coordinate }, error }
}

export function convertCoordinateToLocation (coordinate) {
  let city = ''
  let addressNumber = ''
  let addressStreet = ''
  return {
    accuracy: null,
    addressNumber,
    addressStreet,
    bbox: null,
    center: { lng: coordinate.lng, lat: coordinate.lat },
    city,
    country: '',
    fullText: coordinate.string,
    // geometry: [Point]
    // locality
    mapboxId: null,
    neighborhood: null,
    region: null,
    postcode: null
    // wikidata: String
  }
}
