import React from 'react'
import { storiesOf } from '@storybook/react'
import KeyControlledList from './KeyControlledList'

storiesOf('KeyControlledList', module)
  .add('show', () => (
  <KeyControlledList 
    onChange={
      (element, node, event)=>{ 
        console.log('element: ',element)
        console.log('node: ',node)
        console.log('event: ',event)
      }
    }
    children={
      [
        'hola',
        'chao',
        'aja'
      ]
    }
    selectedIndex={1}
    tabChooses
    spaceChooses
  />
))