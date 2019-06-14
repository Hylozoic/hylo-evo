import React from 'react'
import { storiesOf } from '@storybook/react'
import { MemoryRouter } from 'react-router'
import TextInput from 'components/TextInput'

storiesOf('TextInput', module)
  .addDecorator(story => (
    <MemoryRouter>
      <>
        <br />
        {story()}
      </>
    </MemoryRouter>
  ))
  .add('Show', () =>
    <TextInput onChange={() => {}} value={'Here is some text'} />
  )
  .add('Loading', () =>
    <TextInput loading='true' onChange={() => {}} value={'Here is some other text, with a loading icon!'} />
  )
  .add('Without clear button', () =>
    <TextInput noClearButton='true' onChange={() => {}} value={'Here is some other text, without clear button.'} />
  )
  .add('With accessibility label', () =>
    <TextInput label='accessibility label' onChange={() => {}} value={'This one includes an aria-labelfor accessibility'} />
  )
