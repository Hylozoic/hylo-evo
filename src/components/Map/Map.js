import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import MapGL from 'react-map-gl'
import DeckGL from '@deck.gl/react'
import { mapbox } from 'config'

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
      mapboxApiAccessToken={mapbox.public_token}
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
