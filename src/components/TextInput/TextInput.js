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
  const { theme = {}, onChange, value, inputRef, className, noClearButton, loading } = props
  // TODO: different styles based on props, e.g. validated, error, etc.
  const onKeyDown = props.onEnter ? onEnter(props.onEnter) : () => {}
  const otherProps = omit(['onEnter', 'className', 'inputRef', 'theme', 'noClearButton', 'loading'], props)
  const clear = () => onChange && onChange({target: {value: ''}})

  return <div styleName='wrapper' className={theme.wrapper || className}>
    <input styleName='input' {...{onKeyDown, ...otherProps}}
      ref={inputRef}
      className={theme.input} />
    {value && !noClearButton && <div styleName='clear' className={theme.clear} onClick={clear}>Clear</div>}
    {loading && <span styleName='loading' />}
  </div>
}
