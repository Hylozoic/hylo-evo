import React from 'react'
import './TextInput.scss'
import { onEnter } from 'util/textInput'
import { omit } from 'lodash/fp'

// pass inputRef to this from a parent, with the same kind of callback you would
// pass to ref, if you want to have a reference to the input field, e.g. for
// focus.
//
// https://facebook.github.io/react/docs/refs-and-the-dom.html#exposing-dom-refs-to-parent-components
//
export default function TextInput (props) {
  const { className, onChange, value, inputRef } = props
  // TODO: different styles based on props, e.g. validated, error, etc.
  const onKeyDown = props.onEnter ? onEnter(props.onEnter) : () => {}
  const otherProps = omit(['onEnter', 'className', 'inputRef'], props)
  const clear = () => onChange && onChange({target: {value: ''}})

  return <div styleName='wrapper' className={className}>
    <input styleName='input' {...{onKeyDown, ...otherProps}}
      ref={inputRef} />
    {value && <div styleName='clear' onClick={clear}>Clear</div>}
  </div>
}
