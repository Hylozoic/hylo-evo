import { attr, Model } from 'redux-orm'

class Location extends Model {
  toString () {
    return `Location: ${this.full_text}`
  }
}

export default Location

Location.modelName = 'Location'

Location.fields = {
  id: attr(),
  accuracy: attr(),
  addressNumber: attr(),
  addressStreet: attr(),
  bbox: attr(),
  center: attr(),
  city: attr(),
  country: attr(),
  createdAt: attr(),
  fullText: attr(),
  geometry: attr(),
  locality: attr(),
  neighborhood: attr(),
  region: attr(),
  postcode: attr(),
  updatedAt: attr(),
  wikidata: attr()
}
