const { parseCoordinate, convertCoordinateToLocation } = require('./geo')

describe('parseCoordinate', () => {
  it('returns a valid result for a valid coordinate', () => {
    const validInput = '40.123° N 74.123° W'

    const returnedResult = parseCoordinate(validInput)
    expect(returnedResult.error).toBeUndefined()
    expect(returnedResult.coordinate.lng).toBe(-74.123)
    expect(returnedResult.coordinate.lat).toBe(40.123)
    expect(returnedResult.coordinate.string).toBe('40.123° N 74.123° W')
  })

  it('returns a valid error result for a non-coordinate input', () => {
    const invalidInput = 'on I do like to be beside the seaside'

    const returnedResult = parseCoordinate(invalidInput)
    expect(returnedResult.coordinate).toBeNull()
  })
})

describe('convertCoordinateToLocation', () => {
  it('returns a valid output', () => {
    const validInput = {
      string: '40.123° N 74.123° W',
      lng: -74.123,
      lat: 40.123
    }

    const expectedResult = {
      accuracy: null,
      addressNumber: '',
      addressStreet: '',
      bbox: null,
      center: { lng: -74.123, lat: 40.123 },
      city: '',
      country: '',
      fullText: '40.123° N 74.123° W',
      mapboxId: null,
      neighborhood: null,
      region: null,
      postcode: null
    }

    const returnedResult = convertCoordinateToLocation(validInput)

    expect(returnedResult.center).toEqual(expectedResult.center)
    expect(returnedResult.fullText).toBe(expectedResult.fullText)
  })
})
