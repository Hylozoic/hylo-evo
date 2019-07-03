import React from 'react'
import { storiesOf } from '@storybook/react'
import PostPeopleDialog from './PostPeopleDialog'

storiesOf('PostPeopleDialog', module)
.add('show', () => (
<PostPeopleDialog members={[]} 
/>
),
{ notes: 'A people list, declare the component and send an empty array called "members".' }
)