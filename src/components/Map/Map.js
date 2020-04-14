import React, { useState } from 'react'
import PropTypes from 'prop-types'
import MapGL from 'react-map-gl'
import DeckGL from '@deck.gl/react'

let MAPBOX_TOKEN = 'pk.eyJ1IjoidG9rdWdhd2EiLCJhIjoiY2s4ejYwcm1mMDA1MDNsbW8zamV1ejhmaSJ9.PvrcmUHyffocIUy7k-teUw'

function Map (props) {
  let layers = props.layers
  const [viewport, setViewport] = useState({
    latitude: 37.8,
    longitude: -122.4,
    zoom: 14,
    bearing: 0,
    pitch: 0
  })

  return (
    <MapGL
      {...viewport}
      width='100vw'
      height='100vh'
      mapStyle='mapbox://styles/mapbox/dark-v9'
      onViewportChange={nextViewport => setViewport(nextViewport)}
      mapboxApiAccessToken={MAPBOX_TOKEN}
    >
      <DeckGL viewState={viewport} layers={layers} />

    </MapGL>
  )
}

Map.propTypes = {
  layers: PropTypes.array
}

export default Map
