import React, { useState } from 'react'
import { storiesOf } from '@storybook/react'
import { MemoryRouter } from 'react-router'
import Switch from 'components/Switch'
import SwitchStyled from 'components/SwitchStyled'

storiesOf('Switch', module)
  .addDecorator(story => (
    <MemoryRouter>{story()}</MemoryRouter>
  ))
  .add('Basic', () => <SwitchDemo />)
  .add('SwitchStyled', () => <SwitchStyledDemo />)

function SwitchDemo () {
  const [switchBool, setSwitchBool] = useState(true)

  function handleToggleSwitch () {
    setSwitchBool(!switchBool)
  }
  return (<Switch value={switchBool} onClick={handleToggleSwitch} />)
}

function SwitchStyledDemo () {
  const [switchBool, setSwitchBool] = useState(false)

  function handleToggleSwitch (checked, name) {
    console.log(checked, name)
    setSwitchBool(!switchBool)
  }
  return (<SwitchStyled checked={switchBool} name='demo' onChange={handleToggleSwitch} />)
}
