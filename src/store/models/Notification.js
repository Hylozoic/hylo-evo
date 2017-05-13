import { attr, fk, Model } from 'redux-orm'

const Notification = Model.createClass({
  toString () {
    return `Message: ${this.id}`
  }
})

export default Notification

Notification.modelName = 'Notification'

Notification.fields = {
  id: attr(),
  action: attr(),
  activity: fk('Activity'),
  meta: attr()
}
