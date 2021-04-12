import {
  UPDATE_WIDGET
} from 'store/constants'

export function updateWidget (id, changes) {
  return {
    type: UPDATE_WIDGET,
    graphql: {
      query: `mutation ($id: ID, $changes: GroupWidgetInput) {
        updateWidget(id: $id, changes: $changes) {
          isVisible
          settings {
            text
            title
          }
        }
      }`,
      variables: { id, changes },
      meta: {
        extractModel: 'Widget'
      }
    }
  }
}
