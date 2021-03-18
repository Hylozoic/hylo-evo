import {
  TOGGLE_GROUP_WIDGET_VISIBILITY,
  UPDATE_WIDGET_SETTINGS
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

export function updateWidgetSettings ({ id, data }) {
  return {
    type: UPDATE_WIDGET_SETTINGS,
    graphql: {
      query: `mutation ($id: ID, $data: WidgetSettingsInput) {
        updateWidgetSettings(id: $id, data: $data) {
          success
        }
      }`,
      variables: { id, data }
    }
  }
}