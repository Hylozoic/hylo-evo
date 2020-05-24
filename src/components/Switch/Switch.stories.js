import React, { useState } from 'react'
import { storiesOf } from '@storybook/react'
import { MemoryRouter } from 'react-router'
import Switch from 'components/Switch'

storiesOf('Switch', module)
  .addDecorator(story => (
    <MemoryRouter>{story()}</MemoryRouter>
  ))
  .add('Basic', () => <SwitchDemo />)

function SwitchDemo () {
  const [switchBool, setSwitchFool] = useState(true)

  function handleToggleSwitch () {
    setSwitchFool(!switchBool)
  }
  return (<Switch value={switchBool} onClick={handleToggleSwitch} />)
}
