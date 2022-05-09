export const OAUTH_CONFIRM = 'OAuth/CONSENT_CONFIRM'
export const OAUTH_CANCEL = 'OAuth/CANCEL'

export function confirm (uid) {
  return {
    type: OAUTH_CONFIRM,
    payload: {
      api: { method: 'post', path: `/noo/oidc/${uid}/confirm` }
    }
  }
}

export function cancel (uid) {
  return {
    type: OAUTH_CANCEL,
    payload: {
      api: { method: 'post', path: `/noo/oidc/${uid}/abort` }
    }
  }
}
