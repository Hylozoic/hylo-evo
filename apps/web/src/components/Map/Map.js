import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import MapGL, { NavigationControl } from 'react-map-gl'
import DeckGL from '@deck.gl/react'
import { mapbox } from 'config/index'
import NativeTerritoriesLayer from './NativeTerritoriesLayers'

function Map ({
  afterViewportUpdate = () => {},
  baseLayerStyle = 'light-v11',
  children = {},
  hyloLayers,
  isAddingItemToMap,
  layers = [],
  mapRef,
  onMouseDown,
  onMouseUp,
  otherLayers,
  setViewport,
  viewport = {
    latitude: 35.442845,
    longitude: 7.916598,
    zoom: 0,
    bearing: 0,
    pitch: 0
  }
}) {
  const [isOverHyloFeature, setIsOverHyloFeature] = useState(false)

  const ref = mapRef || useRef(null)

  // XXX: Have to do this because onViewPortChange gets called before ref gets set
  //   and we need the ref to get the bounds in the parent component
  useEffect(() => {
    console.log('map.js viewport useEffect', viewport)
    afterViewportUpdate(viewport)
  }, [viewport])

  const [hoveredLayerFeatures, setHoveredLayerFeatures] = useState([])
  const [cursorLocation, setCursorLocation] = useState({ x: 0, y: 0 })

  const onMouseEnter = event => {
    const { features } = event
    console.log('mouse enter', event)
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
      style={{ width: '100%', height: '100%' }}
      attributionControl={false}
      interactiveLayerIds={otherLayers}
      mapboxAccessToken={mapbox.token}
      mapOptions={{ logoPosition: 'bottom-right' }}
      mapStyle={`mapbox://styles/mapbox/${baseLayerStyle}`}
      // onMouseEnter={onMouseEnter}
      // onMouseDown={onMouseDown}
      // onTouchStart={onMouseDown}
      // onMouseMove={onMouseMove}
      // onMouseLeave={() => { setHoveredLayerFeatures([]) }}
      // onMouseOut={() => { setHoveredLayerFeatures([]) }}
      // onMouseUp={onMouseUp}
      // onTouchEnd={onMouseUp}
      onMove={evt => { console.log('onMove', evt); setViewport(evt.viewState) }}
      onResize={dimensions => {
        // XXX: hack needed because onViewportChange doesn't fire when map width changes
        //      https://github.com/visgl/react-map-gl/issues/1157
        if (ref.current) {
          console.log('onResize', dimensions)
          const center = ref.current.getCenter()
          const bounds = ref.current.getBounds()
          setViewport({
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
      // onViewportChange={nextViewport => {
      //   const bounds = ref.current.getBounds()
      //   return onViewportUpdate(
      //     {
      //       ...nextViewport,
      //       mapBoundingBox: [bounds._sw.lng, bounds._sw.lat, bounds._ne.lng, bounds._ne.lat] // for use with maps that don't share their bounds in the site URL
      //     },
      //     ref.current
      //   )
      // }}
      ref={r => { ref.current = r && r.getMap(); return r }}
      reuseMaps
    >
      <NavigationControl style={{ position: 'absolute', top: 50, right: 15 }} />

      <NativeTerritoriesLayer
        cursorLocation={cursorLocation}
        hoveredLayerFeatures={hoveredLayerFeatures}
        visibility={otherLayers && otherLayers.includes('native_territories')}
      />

  {/*}
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
      </DeckGL> */}

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

export default Map
