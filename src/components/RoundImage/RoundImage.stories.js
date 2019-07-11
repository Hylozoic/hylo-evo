import React from 'react'
import { storiesOf } from '@storybook/react'
import RoundImage from './RoundImage'

const notes = { notes: 'You can use the effect of round image just using whit the string "url". Additionally you can apply additional size effects with the bool "small", "medium", "large" and "overlaps"' }

storiesOf('RoundImage', module)
  .add('show',
    () => (
      <RoundImage url='https://www.pixelstalk.net/wp-content/uploads/2016/09/Black-Horse-Wallpapers-For-Laptops-620x388.jpg' />
    ),
    notes
  )
  .add('small',
    () => (
      <RoundImage small url='https://www.pixelstalk.net/wp-content/uploads/2016/09/Black-Horse-Wallpapers-For-Laptops-620x388.jpg' />
    ),
    notes
  )
  .add('medium',
    () => (
      <RoundImage medium url='https://www.pixelstalk.net/wp-content/uploads/2016/09/Black-Horse-Wallpapers-For-Laptops-620x388.jpg' />
    ),
    notes
  )
  .add('large',
    () => (
      <RoundImage large url='https://www.pixelstalk.net/wp-content/uploads/2016/09/Black-Horse-Wallpapers-For-Laptops-620x388.jpg' />
    ),
    notes
  )
  .add('overlaps',
    () => (
      <RoundImage overlaps url='https://www.pixelstalk.net/wp-content/uploads/2016/09/Black-Horse-Wallpapers-For-Laptops-620x388.jpg' />
    ),
    notes
  )
