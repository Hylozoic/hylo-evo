import { getHost } from 'store/middleware/apiMiddleware'

export const MODULE_NAME = 'ExportData'
export const EXPORT_MEMBERS = `${MODULE_NAME}/EXPORT_MEMBERS`

export function requestMemberCSV (groupId) {
  window.location.assign(`${getHost()}/noo/export/group?groupId=${groupId}&datasets[]=members`)

  return {
    type: EXPORT_MEMBERS
  }
}
