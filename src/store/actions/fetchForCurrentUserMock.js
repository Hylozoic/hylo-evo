import { get } from 'lodash/fp'
import { FETCH_FOR_CURRENT_USER } from 'store/constants'
import { MOCK_ME } from 'store/models/Me'

export default function fetchforCurrentUserMock (meMock) {
  const meMockExtended = {
    ...MOCK_ME,
    ...meMock
  }

  return {
    type: FETCH_FOR_CURRENT_USER,
    payload: {
      data: {
        me: meMockExtended
      }
    },
    meta: {
      extractModel: [
        {
          getRoot: get('me'),
          modelName: 'Me',
          append: true
        }
      ]
    }
  }
}
