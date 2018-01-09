/*
Reducers in this folder are different from the usual: they have the signature
`(session, action)`, and they are expected to operate only by calling the
redux-orm API on models in the session. Their return values are ignored.
*/

export { handleNotificationActions } from './notifications'

export {
  ormSessionReducer as postHeaderReducer
} from 'components/PostCard/PostHeader/PostHeader.store'

export {
  ormSessionReducer as inviteSettingsTabReducer
} from 'routes/CommunitySettings/InviteSettingsTab/InviteSettingsTab.store'

export {
  ormSessionReducer as socketListenerReducer
} from 'components/SocketListener/SocketListener.store'

export {
  ormSessionReducer as primaryLayoutReducer
} from 'routes/PrimaryLayout/PrimaryLayout.store'

export {
  ormSessionReducer as membersReducer
} from 'routes/Members/Members.store'

export {
  ormSessionReducer as NetworkSettingsReducer
} from 'routes/NetworkSettings/NetworkSettings.store'
