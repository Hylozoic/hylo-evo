export function convertMapboxToLocation (mapboxResult) {
  const neighborhoodObject = mapboxResult.context.find(c => c.id.includes('neighborhood'))
  const postcodeObject = mapboxResult.context.find(c => c.id.includes('postcode'))
  const placeObject = mapboxResult.context.find(c => c.id.includes('place'))
  const regionObject = mapboxResult.context.find(c => c.id.includes('region'))
  const countryObject = mapboxResult.context.find(c => c.id.includes('country'))

  return {
    accuracy: mapboxResult.properties.accuracy,
    addressNumber: mapboxResult.address,
    addressStreet: mapboxResult.text,
    bbox: mapboxResult.bbox ? [{ lng: mapboxResult.bbox[0], lat: mapboxResult.bbox[1] }, { lng: mapboxResult.bbox[2], lat: mapboxResult.bbox[3] }] : [],
    center: { lng: mapboxResult.center[0], lat: mapboxResult.center[1] },
    city: placeObject && placeObject.text,
    country: countryObject && countryObject.short_code,
    fullText: mapboxResult.place_name,
    // geometry: [Point]
    // locality
    neighborhood: neighborhoodObject && neighborhoodObject.text,
    region: regionObject && regionObject.text,
    postcode: postcodeObject && postcodeObject.text
    // wikidata: String
  }
}
