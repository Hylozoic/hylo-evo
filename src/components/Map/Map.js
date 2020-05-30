import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import MapGL from 'react-map-gl'
import DeckGL from '@deck.gl/react'
import { mapbox } from 'config'

function Map (props) {
  let { children, layers, onViewportUpdate } = props

  const [viewport, setViewport] = useState({
    latitude: 37.8,
    longitude: -122.3,
    zoom: props.zoom,
    bearing: 0,
    pitch: 0
  })

  const [isHovering, setIsHovering] = useState(false)

  const mapRef = useRef()

  useEffect(() => {
    onViewportUpdate(viewport, mapRef.current)
  }, [viewport])

  return (
    <MapGL
      {...viewport}
      width='100%'
      height='100vh'
      mapStyle='mapbox://styles/mapbox/light-v9'
      onViewportChange={nextViewport => setViewport(nextViewport)}
      mapboxApiAccessToken={mapbox.token}
      ref={ref => { mapRef.current = ref && ref.getMap(); return ref }}
    >
      <DeckGL
        viewState={viewport}
        layers={layers}
        onHover={({ object }) => setIsHovering(Boolean(object))}
        getCursor={() => isHovering ? 'pointer' : 'grab'}
      >
        { children }
      </DeckGL>

    </MapGL>
  )
}

Map.propTypes = {
  children: PropTypes.any,
  layers: PropTypes.array,
  onViewportUpdate: PropTypes.func,
  zoom: PropTypes.number
}

Map.defaultProps = {
  children: {},
  layers: [],
  onViewportUpdate: () => {},
  zoom: 10
}

export default Map
