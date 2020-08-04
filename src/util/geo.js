import WebMercatorViewport from '@math.gl/web-mercator'

export function locationObjectToViewport (priorViewport, locationObject) {
  const bbox = locationObject.bbox
  if (bbox) {
    const bounds = [[parseFloat(bbox[0].lng), parseFloat(bbox[0].lat)], [parseFloat(bbox[1].lng), parseFloat(bbox[1].lat)]]
    return new WebMercatorViewport(priorViewport).fitBounds(bounds)
  } else {
    return { ...priorViewport, longitude: parseFloat(locationObject.center.lng), latitude: parseFloat(locationObject.center.lat), zoom: 12 }
  }
}
