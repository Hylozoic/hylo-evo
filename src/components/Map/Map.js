import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import MapGL from 'react-map-gl'
import DeckGL from '@deck.gl/react'
import { mapbox } from 'config'

function Map (props) {
  let { children, layers, shareViewportUpdate } = props

  const [viewport, setViewport] = useState({
    latitude: 37.8,
    longitude: -122.3,
    zoom: props.zoom,
    bearing: 0,
    pitch: 0
  })

  const mapRef = useRef();

  useEffect(() => {
    shareViewportUpdate(viewport, mapRef.current)
  }, [viewport])

  //const onLoad = () => console.log('mapRef.current is ready for use', mapRef.current);

  return (
    <MapGL
      {...viewport}
      width='100vw'
      height='100vh'
      mapStyle='mapbox://styles/mapbox/light-v9'
      onViewportChange={nextViewport => setViewport(nextViewport)}
      mapboxApiAccessToken={mapbox.public_token}
      ref={ref => mapRef.current = ref && ref.getMap()}
    >
      <DeckGL viewState={viewport} layers={layers} >
        { children }
      </DeckGL>

    </MapGL>
  )
}

Map.propTypes = {
  children: PropTypes.any,
  layers: PropTypes.array,
  shareViewportUpdate: PropTypes.func,
  zoom: PropTypes.number
}

Map.defaultProps = {
  children: {},
  layers: [],
  shareViewportUpdate: () => {},
  zoom: 10
}

export default Map
