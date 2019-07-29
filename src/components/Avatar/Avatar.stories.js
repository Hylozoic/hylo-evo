import React from 'react'
import { storiesOf } from '@storybook/react'
import { MemoryRouter } from 'react-router'
import Avatar from 'components/Avatar'

const notes = 'The Avatar component renders a consistent image from a url or base64 data, this example uses a URL. Set a link to more information about the avatar as shown in this example that links to the Github profile for Philip Beadle.'

storiesOf('Avatar', module)
  .addDecorator(story => (<MemoryRouter>{story()}</MemoryRouter>))
  .add('URL to source', () =>
    <Avatar avatarUrl='https://avatars3.githubusercontent.com/u/5264862?s=40&v=4' url='https://github.com/philipbeadle' />,
  {
    notes: notes
  })
  .add('Base64 source', () =>
    <Avatar avatarUrl=' data:image/png;base64,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' url='https://github.com/philipbeadle' />,
  {
    notes: notes
  })
