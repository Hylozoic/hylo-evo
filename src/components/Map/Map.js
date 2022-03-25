import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import MapGL from 'react-map-gl'
import DeckGL from '@deck.gl/react'
import { mapbox } from 'config'

function Map (props) {
  const { children, layers, afterViewportUpdate, isAddingItemToMap, onViewportUpdate, viewport, onMouseDown, onMouseUp } = props
  const [isHovering, setIsHovering] = useState(false)

  const mapRef = useRef()

  // XXX: Have to do this because onViewPortChange gets called before ref gets set
  //   and we need the ref to get the bounds in the parent component
  useEffect(() => {
    afterViewportUpdate(viewport, mapRef.current)
  }, [viewport])

  return (
    <MapGL
      {...viewport}
      width='100%'
      height='100%'
      mapOptions={{ logoPosition: 'bottom-right' }}
      attributionControl={false}
      mapStyle='mapbox://styles/mapbox/light-v9'
      onViewportChange={nextViewport => onViewportUpdate(nextViewport, mapRef.current)}
      onResize={dimensions => {
        // XXX: hack needed because onViewportChange doesn't fire when map width changes
        //      https://github.com/visgl/react-map-gl/issues/1157
        if (mapRef.current) {
          const center = mapRef.current.getCenter()
          onViewportUpdate({
            bearing: mapRef.current.getBearing(),
            height: dimensions.height,
            latitude: center.lat,
            longitude: center.lng,
            pitch: mapRef.current.getPitch(),
            width: dimensions.width,
            zoom: mapRef.current.getZoom()
          })
        }
      }}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      mapboxApiAccessToken={mapbox.token}
      ref={ref => { mapRef.current = ref && ref.getMap(); return ref }}
    >
      <DeckGL
        viewState={viewport}
        layers={layers}
        onHover={({ object }) => setIsHovering(Boolean(object))}
        getCursor={() => isHovering ? 'pointer' : isAddingItemToMap ? 'url(/assets/create-post-pin.png) 12 31, pointer' : 'grab'}
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
  children: {},
  layers: [],
  onViewportUpdate: () => {},
  viewport: {
    latitude: 35.442845,
    longitude: 7.916598,
    zoom: 0,
    bearing: 0,
    pitch: 0
  }
}

export default Map
