import { createSelector as ormCreateSelector } from 'redux-orm'
import orm from 'store/models'
import { get } from 'lodash/fp'
import { ID_FOR_NEW } from 'store/actions/uploadAttachment'

const getAttachmentsFromObject = ormCreateSelector(
  orm,
  (state, _) => get('orm', state),
  (_, props) => props,
  ({ Attachment }, { id = ID_FOR_NEW, type, attachmentType }) => Attachment
    .all()
    .filter(({ type: at, ...rest }) =>
      at === attachmentType &&
      rest[type.toLowerCase()] === id
    )
    .orderBy('position')
    .toModelArray()
    .map(a => a.url)
)

export default getAttachmentsFromObject
