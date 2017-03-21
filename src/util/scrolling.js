import { has } from 'lodash/fp'

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

  return {x, y}
}
