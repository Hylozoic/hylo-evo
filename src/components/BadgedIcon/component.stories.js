import React from 'react'
import { storiesOf } from '@storybook/react'
import component from './component'

storiesOf('BadgedIcon', module)
.add('show', () => (
<component />
),
{ notes: 'Simple "All Feeds" icon' }
)
