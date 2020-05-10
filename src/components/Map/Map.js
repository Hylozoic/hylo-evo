import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import MapGL from 'react-map-gl'
import DeckGL from '@deck.gl/react'

let MAPBOX_TOKEN = 'pk.eyJ1IjoidG9rdWdhd2EiLCJhIjoiY2s4ejYwcm1mMDA1MDNsbW8zamV1ejhmaSJ9.PvrcmUHyffocIUy7k-teUw'

function Map (props) {
  let { layers, shareViewportUpdate} = props
  const [viewport, setViewport] = useState({
    latitude: 37.8,
    longitude: -122.3,
    zoom: 10,
    bearing: 0,
    pitch: 0
  })

  useEffect(() => {
    shareViewportUpdate(viewport)
  }, [viewport])

  return (
    <MapGL
      {...viewport}
      width='100%'
      height='100%'
      mapStyle='mapbox://styles/mapbox/light-v9'
      onViewportChange={nextViewport => setViewport(nextViewport)}
      mapboxApiAccessToken={MAPBOX_TOKEN}
    >
      <DeckGL viewState={viewport} layers={layers} />

    </MapGL>
  )
}

Map.propTypes = {
  layers: PropTypes.array,
  shareViewportUpdate: PropTypes.func
}

Map.defaultProps = {
  layers: [],
  shareViewportUpdate: () => {}
}

export default Map
