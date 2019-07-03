import React from 'react'
import { storiesOf } from '@storybook/react'
import PostLabel from './PostLabel'

storiesOf('PostLabel', module)
.add('All', () => (
<PostLabel type={String} className={String}/>
),
{ notes: 'Proptypes for a String and class' }
)
