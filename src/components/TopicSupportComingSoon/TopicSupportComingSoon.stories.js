import React from 'react'
import { storiesOf } from '@storybook/react'
import TopicSupportComingSoon from './index'
import { BrowserRouter } from 'react-router-dom'


storiesOf('TopicSupportComingSoon', module)
  .add('show', () => (
  <BrowserRouter>
    <TopicSupportComingSoon />
  </BrowserRouter>
),
{notes: 'aviso de Soporte de tema próximamente'}
)