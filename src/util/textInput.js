/*
This file is copied from Hylo-Redux. All we're currently using is keyMap and getKeyCode.
*/
import { curry, has } from 'lodash'

export const keyMap = {
  BACKSPACE: 8,
  TAB: 9,
  ENTER: 13,
  ESC: 27,
  SPACE: 32,
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  DELETE: 46,
  HASH: 35,
  AT_SIGN: 64,
  COMMA: 188
}

export const isKey = (event, keyName) =>
  has(keyMap, keyName) && getKeyCode(event) === keyMap[keyName]

export const getKeyCode = event => event.which || event.keyCode

export const getCharacter = event => String.fromCharCode(getKeyCode(event))

// use like: <input type='text' onKeyDown={onKeyCode(keyMap.ENTER, callback)} />
const onKeyCode = curry((modifier, keyCode, callback, event) =>
  getKeyCode(event) === keyCode && (!modifier || event[modifier]) && callback(event))

const onKeyCodeWithoutMod = curry((modifier, keyCode, callback, event) =>
  getKeyCode(event) === keyCode && !event[modifier] && callback(event))

// use like: <input type='text' onKeyDown={onEnter(callback)} />
export const onEnter = onKeyCode(null, keyMap.ENTER)
export const onEnterNoShift = onKeyCodeWithoutMod('shiftKey', keyMap.ENTER)
export const onCmdEnter = onKeyCode('metaKey', keyMap.ENTER)
export const onCtrlEnter = onKeyCode('ctrlKey', keyMap.ENTER)
export const onCmdOrCtrlEnter = (callback, event) =>
  onCtrlEnter(callback, event) || onCmdEnter(callback, event)

export const preventSpaces = onKeyCode(null, keyMap.SPACE, e => e.preventDefault())
