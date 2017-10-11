/*
Reducers in this folder are different from the usual: they have the signature
`(session, action)`, and they are expected to operate only by calling the
redux-orm API on models in the session. Their return values are ignored.
*/

export { handleNotificationActions } from './notifications'
