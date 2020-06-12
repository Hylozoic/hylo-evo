import { get } from 'lodash/fp'

export const MODULE_NAME = 'LocationInput'
export const FETCH_LOCATION = `${MODULE_NAME}/FETCH_LOCATION`

export function fetchLocation (data) {
  return {
    type: FETCH_LOCATION,
    graphql: {
      query: `mutation (
        $accuracy: String,
        $addressNumber: String,
        $addressStreet: String,
        $bbox: [PointInput],
        $center: PointInput,
        $city: String,
        $country: String,
        $fullText: String,
        $geometry: [PointInput],
        $locality: String,
        $neighborhood: String,
        $region: String,
        $postcode: String,
        $wikidata: String
      ) {
        findOrCreateLocation(data: {
          accuracy: $accuracy,
          addressNumber: $addressNumber,
          addressStreet: $addressStreet,
          bbox: $bbox,
          center: $center
          city: $city
          country: $country,
          fullText: $fullText,
          geometry: $geometry,
          locality: $locality,
          neighborhood: $neighborhood,
          region: $region,
          postcode: $postcode,
          wikidata: $wikidata
        }) {
          id
          accuracy
          addressNumber
          addressStreet
          bbox {
            lat
            lng
          }
          center {
            lat
            lng
          }
          city
          country
          fullText
          locality
          neighborhood
          region
          postcode
        }
      }`,
      variables: { ...data }
    },
    meta: {
      extractModel: {
        modelName: 'Location',
        getRoot: get('findOrCreateLocation')
      }
    }
  }
}

export function pollingFetchLocation (dispatch, locationData, callback) {
  const poll = (url, delay) => {
    if (delay > 4) return
    dispatch(fetchLocation(locationData)).then(value => {
      if (!value) return
      const locationReceived = value.meta.extractModel.getRoot(value.payload.data)
      if (!locationReceived) {
        setTimeout(() => poll(url, delay * 2), delay * 1000)
      } else {
        callback(locationReceived)
      }
    })
  }
  poll(locationData, 0.5)
}
