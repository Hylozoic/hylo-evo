import { attr, Model } from 'redux-orm'

class PlatformAgreement extends Model {
  toString () {
    return `PlatformAgreement (${this.id}): ${this.text}`
  }
}

export default PlatformAgreement

PlatformAgreement.modelName = 'PlatformAgreement'

PlatformAgreement.fields = {
  id: attr(),
  type: attr(),
  text: attr()
}
