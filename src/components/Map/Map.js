import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import MapGL from 'react-map-gl'
import DeckGL from '@deck.gl/react'
import { mapbox } from 'config'

function Map (props) {
  let { center, children, layers, onViewportUpdate, zoom } = props

  const [viewport, setViewport] = useState({
    latitude: parseFloat(center.lat),
    longitude: parseFloat(center.lng),
    zoom: zoom,
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
  center: PropTypes.object,
  children: PropTypes.any,
  layers: PropTypes.array,
  onViewportUpdate: PropTypes.func,
  zoom: PropTypes.number
}

Map.defaultProps = {
  center: { lat: 35.442845, lng: 7.916598 },
  children: {},
  layers: [],
  onViewportUpdate: () => {},
  zoom: 0
}

export default Map
