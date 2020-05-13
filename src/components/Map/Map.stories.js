import React from 'react'
import { storiesOf } from '@storybook/react'
import Map from 'components/Map'
import { createAskOfferH3Layer } from './layers/askOfferH3Layer'

let offersAndAsks = [
  { type: 'request', summary: 'Need help Sunday', coordinates: [37.3615593, -122.0553238], hex: '8b283470d921fff' },
  { type: 'request', summary: 'Need help Saturday', coordinates: [37.3715693, -122.0653638], hex: '8b283470da66fff' },
  { type: 'offer', summary: 'Canning workshop', coordinates: [37.715693, -122.3653638], hex: '8b2830824775fff' },
  { type: 'offer', summary: 'Sun-tanning workshop', coordinates: [37.815693, -122.253638], hex: '8b28308128cdfff' },
  { type: 'offer', summary: 'Sun-tanning workshop', coordinates: [37.915693, -122.314638], hex: '8b28308128cdfff' },
  { type: 'offer', summary: 'Sun-tanning workshop', coordinates: [37.345693, -122.187638], hex: '8b28308128cdfff' },
  { type: 'offer', summary: 'Sun-tanning workshop', coordinates: [37.815693, -122.253638], hex: '8b28308128cdfff' },
  { type: 'request', summary: 'Need help Sunday', coordinates: [37.7915593, -122.1853238], hex: '8b283470d921fff' },
  { type: 'request', summary: 'Need help Saturday', coordinates: [37.8255693, -122.1553638], hex: '8b283470da66fff' },
  { type: 'request', summary: 'Need help Sunday', coordinates: [37.8015593, -122.2853238], hex: '8b283470d921fff' },
  { type: 'request', summary: 'Need help Saturday', coordinates: [37.8255693, -122.2253638], hex: '8b283470da66fff' }
]

function createH3Layer (zoom = 11) {
  return [createAskOfferH3Layer(offersAndAsks, Math.round(zoom))]
}

storiesOf('Map', module)
  .add('Empty map', () => <Map />)
  .add('Update the parent', () => <Map shareViewportUpdate={(value) => console.log(value, 'value that is shared with the parent component')} />)
  .add('H3 layer demo', () => <Map layers={createH3Layer()} shareViewportUpdate={(value) => console.log(value)} />)
