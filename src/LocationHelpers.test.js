import { convertMapboxToLocation } from './LocationHelpers'

it('works correctly', () => {
  let mapboxObject = {
   id: 'address.00010029611884',
   type: 'Feature',
   place_type: [ 'address' ],
   relevance: 1,
   address: '188',
   text: 'Baker Rd',
   place_name: '188 Baker Rd, Amherst, Massachusetts 01002, United States',
   center: [ -72.53047, 42.36446 ],
   properties: { accuracy: 'approximate' },
   geometry: { type: 'Point', coordinates: [ -72.53047, 42.36446 ] },
   context: [
     { id: 'neighborhood.5739529914326360', text: 'Mill Valley' },
     { id: 'postcode.7358402101996970', text: '01002' },
     {
       id: 'place.10809335274128600',
       wikidata: 'Q49164',
       text: 'Amherst'
     },
     {
       id: 'district.7178974375898140',
       wikidata: 'Q54161',
       text: 'Hampshire County'
     },
     {
       id: 'region.8307399429561540',
       short_code: 'US-MA',
       wikidata: 'Q771',
       text: 'Massachusetts'
     },
     {
       id: 'country.14135384517372290',
       wikidata: 'Q30',
       short_code: 'us',
       text: 'United States'
     }
   ]
 }

  let expected = {
    accuracy: 'approximate',
    addressNumber: '188',
    addressStreet: 'Baker Rd',
    bbox: null,
    //bbox: mapboxResult.bbox ? [{ lng: mapboxResult.bbox[0], lat: mapboxResult.bbox[1] }, { lng: mapboxResult.bbox[2], lat: mapboxResult.bbox[3] }] : null,
    center: { lng: -72.53047, lat: 42.36446 },
    city: 'Amherst',
    country: 'us',
    fullText: '188 Baker Rd, Amherst, Massachusetts 01002, United States',
    // geometry: [Point]
    // locality
    mapboxId: 'address.00010029611884',
    neighborhood: 'Mill Valley',
    region: 'Massachusetts',
    postcode: '01002'
    // wikidata: String
  }

  expect(convertMapboxToLocation(mapboxObject)).toEqual(expected)
})
