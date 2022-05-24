import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import MapGL from 'react-map-gl'
import DeckGL from '@deck.gl/react'
import { mapbox } from 'config'
import NativeTerritoriesLayer from './NativeTerritoriesLayers'

function Map (props) {
  const {
    afterViewportUpdate = () => {},
    baseLayerStyle = 'light-v10',
    children,
    hyloLayers,
    isAddingItemToMap,
    mapRef,
    onMouseDown,
    onMouseUp,
    onViewportUpdate = () => {},
    otherLayers,
    viewport
  } = props

  const [isOverHyloFeature, setIsOverHyloFeature] = useState(false)

  const ref = mapRef || React.createRef()

  // XXX: Have to do this because onViewPortChange gets called before ref gets set
  //   and we need the ref to get the bounds in the parent component
  useEffect(() => {
    afterViewportUpdate(viewport)
  }, [viewport])

  const [hoveredLayerFeatures, setHoveredLayerFeatures] = useState([])
  const [cursorLocation, setCursorLocation] = useState({ x: 0, y: 0 })

  const onHover = event => {
    const { features } = event
    setHoveredLayerFeatures(features)
  }

  const onMouseMove = event => {
    const {
      srcEvent: { offsetX, offsetY }
    } = event

    if (event.target.id === 'deckgl-overlay') {
      setCursorLocation({ x: offsetX, y: offsetY })
    }
  }

  return (

    <MapGL
      {...viewport}
      height='100%'
      width='100%'
      attributionControl={false}
      interactiveLayerIds={otherLayers}
      mapboxApiAccessToken={mapbox.token}
      mapOptions={{ logoPosition: 'bottom-right' }}
      mapStyle={`mapbox://styles/mapbox/${baseLayerStyle}`}
      onHover={onHover}
      onMouseDown={onMouseDown}
      onTouchStart={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseLeave={() => { setHoveredLayerFeatures([]) }}
      onMouseOut={() => { setHoveredLayerFeatures([]) }}
      onMouseUp={onMouseUp}
      onTouchEnd={onMouseUp}
      onResize={dimensions => {
        // XXX: hack needed because onViewportChange doesn't fire when map width changes
        //      https://github.com/visgl/react-map-gl/issues/1157
        if (ref.current) {
          const center = ref.current.getCenter()
          const bounds = ref.current.getBounds()
          onViewportUpdate({
            bearing: ref.current.getBearing(),
            height: dimensions.height,
            latitude: center.lat,
            longitude: center.lng,
            pitch: ref.current.getPitch(),
            width: dimensions.width,
            zoom: ref.current.getZoom(),
            mapBoundingBox: [bounds._sw.lng, bounds._sw.lat, bounds._ne.lng, bounds._ne.lat] // for use with maps that don't share their bounds in the site URL
          })
        }
      }}
      onViewportChange={nextViewport => {
        const bounds = ref.current.getBounds()
        return onViewportUpdate(
          {
            ...nextViewport,
            mapBoundingBox: [bounds._sw.lng, bounds._sw.lat, bounds._ne.lng, bounds._ne.lat] // for use with maps that don't share their bounds in the site URL
          },
          ref.current
        )
      }}
      ref={r => { ref.current = r && r.getMap(); return r }}
      reuseMaps
    >
      <NativeTerritoriesLayer
        cursorLocation={cursorLocation}
        hoveredLayerFeatures={hoveredLayerFeatures}
        visibility={otherLayers && otherLayers.includes('native_territories')}
      />

      <DeckGL
        viewState={viewport}
        layers={hyloLayers}
        onHover={({ object }) => {
          setIsOverHyloFeature(Boolean(object))
          // if hovering over DeckGL object then turn off hover state of MapGL
          if (object) {
            setHoveredLayerFeatures([])
          }
        }}
        getCursor={() => isOverHyloFeature ? 'pointer' : isAddingItemToMap ? 'url(/assets/create-post-pin.png) 12 31, pointer' : 'grab'}
      >
        {children}
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
