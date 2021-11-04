import WebMercatorViewport from '@math.gl/web-mercator'
import CoordinateParser from 'coordinate-parser'

export function locationObjectToViewport (priorViewport, locationObject) {
  const bbox = locationObject.bbox
  if (bbox) {
    const bounds = [[parseFloat(bbox[0].lng), parseFloat(bbox[0].lat)], [parseFloat(bbox[1].lng), parseFloat(bbox[1].lat)]]
    return new WebMercatorViewport(priorViewport).fitBounds(bounds)
  } else {
    return { ...priorViewport, longitude: parseFloat(locationObject.center.lng), latitude: parseFloat(locationObject.center.lat), zoom: 12 }
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
