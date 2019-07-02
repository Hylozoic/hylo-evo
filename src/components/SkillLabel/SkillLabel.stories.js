import React from 'react'
import { storiesOf } from '@storybook/react'
import SkillLabel from './component'

storiesOf('SkillLabel', module)
.add('normal', () => (
  <SkillLabel
    label='skill 1'
  />
),
{notes: 'Skill modo normal'}
)
.add('Active', () => (
  <SkillLabel
    label='skill 1' 
    active
  />
),
{notes: 'Skill modo activo'}
)