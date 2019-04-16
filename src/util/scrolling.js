import { has } from 'lodash/fp'

const bottomScrollPosition = () =>
  document.body.scrollHeight - window.innerHeight

export const viewportTop = () =>
  has('pageYOffset', window)
    ? window.pageYOffset
    : document.documentElement.clientHeight
      ? document.documentElement.scrollTop
      : document.body.scrollTop

export function position (element, parent) {
  let x = 0
  let y = 0

  while (element && element !== parent) {
    x += element.offsetLeft + element.clientLeft
    y += element.offsetTop + element.clientTop
    element = element.offsetParent
  }

  return { x, y }
}

export const isAtBottom = (offset, element) =>
  (!element || element === window)
    ? viewportTop() >= bottomScrollPosition() - offset
    : element.scrollTop >= element.scrollHeight - element.offsetHeight - offset

export const CENTER_COLUMN_ID = 'center-column'
export const DETAIL_COLUMN_ID = 'detail-column'
