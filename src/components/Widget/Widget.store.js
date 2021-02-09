import {
  TOGGLE_GROUP_WIDGET_VISIBILITY,
} from 'store/constants'

export function toggleWidgetVisibility ({ id, isVisible }) {
  return {
    type: TOGGLE_GROUP_WIDGET_VISIBILITY,
    graphql: {
      query: `mutation ($id: ID, $isVisible: Boolean) {
        toggleGroupWidgetVisibility(id: $id, isVisible: $isVisible) {
          success
        }
      }`,
      variables: { id, isVisible }
    }
  }
}