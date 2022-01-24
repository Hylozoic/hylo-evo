import gql from 'graphql-tag'
import {
  UPDATE_WIDGET
} from 'store/constants'

export function updateWidget (id, changes) {
  return {
    type: UPDATE_WIDGET,
    graphql: {
      query: gql`
        mutation UpdateWidget($id: ID, $changes: GroupWidgetInput) {
          updateWidget(id: $id, changes: $changes) {
            id
            isVisible
            settings {
              text
              title
            }
            group {
              id
            }
          }
        }
      `,
      variables: { id, changes }
    },
    meta: {
      extractModel: 'Widget'
    }
  }
}
