import React from 'react'
import { storiesOf } from '@storybook/react'
import LocationInput from 'components/LocationInput/LocationInput'

storiesOf('LocationInput', module)
  .add('Empty', () => <LocationInput />)
  .add('with deefault location', () => <LocationInput defaultLocation='1530 Hayes St. San Francisco, CA' />)
