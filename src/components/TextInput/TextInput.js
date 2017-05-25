import React from 'react'
import './TextInput.scss'
import { onEnter } from 'util/textInput'
import { omit } from 'lodash/fp'

export default function TextInput (props) {
  const { className, onChange, value } = props
  // TODO: different styles based on props, e.g. validated, error, etc.
  const onKeyDown = props.onEnter ? onEnter(props.onEnter) : () => {}
  const otherProps = omit(['onEnter', 'className'], props)
  const clear = () => onChange && onChange({target: {value: ''}})

  return <div styleName='wrapper' className={className}>
    <input styleName='input' {...{onKeyDown, ...otherProps}} />
    {value && <div styleName='clear' onClick={clear}>Clear</div>}
  </div>
}
