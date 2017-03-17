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
