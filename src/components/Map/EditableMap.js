import React, { useCallback, useEffect, useRef, useState } from 'react'
import MapGL from 'react-map-gl'
import { Editor, DrawPolygonMode, EditingMode } from 'react-map-gl-draw'
import { mapbox } from 'config'

import { getFeatureStyle, getEditHandleStyle } from './EditableMapStyles'

export default function EditableMap (props) {
  const { locationObject, polygon, savePolygon } = props
  const centerAt = locationObject?.center
  const showLocationOnMap = !polygon && centerAt
  const [viewport, setViewport] = useState(null)
  const [mode, setMode] = useState(null)
  const [selectedFeatureIndex, setSelectedFeatureIndex] = useState(null)
  const editorRef = useRef(null)
  const existingPolygon = polygon ? [{
    geometry: polygon,
    properties: { },
    type: 'Feature'
  }] : [{
    geometry: { },
    properties: { },
    type: 'Feature'
  }]

  useEffect(() => {
    const defaultLocation = showLocationOnMap ? {
      latitude: parseFloat(centerAt.lat),
      longitude: parseFloat(centerAt.lng),
      zoom: 12
    } : {
      longitude: -122.2712,
      latitude: 37.8044,
      zoom: 12
    }
    setViewport(defaultLocation)
  }, [locationObject])

  const onSelect = useCallback(options => {
    setSelectedFeatureIndex(options && options.selectedFeatureIndex)
  }, [])

  const onDelete = useCallback(() => {
    if (selectedFeatureIndex !== null && selectedFeatureIndex >= 0) {
      editorRef.current.deleteFeatures(selectedFeatureIndex)
    }
  }, [selectedFeatureIndex])

  const onUpdate = useCallback((payload) => {
    const { editType, data } = payload
    if (editType === 'addFeature') {
      setMode(new EditingMode())
      savePolygon(data[data.length - 1])
    }
  }, [])

  const drawTools = (
    <div className='mapboxgl-ctrl-top-left'>
      <div className='mapboxgl-ctrl-group mapboxgl-ctrl'>
        <button
          className='mapbox-gl-draw_ctrl-draw-btn mapbox-gl-draw_polygon'
          title='Polygon tool (p)'
          onClick={() => setMode(new DrawPolygonMode())}
        />
        <button
          className='mapbox-gl-draw_ctrl-draw-btn mapbox-gl-draw_trash'
          title='Delete'
          onClick={onDelete}
        />
      </div>
    </div>
  )

  return (
    <MapGL
      {...viewport}
      width='100%'
      height='100%'
      mapOptions={{ logoPosition: 'bottom-right' }}
      attributionControl={false}
      mapStyle='mapbox://styles/mapbox/light-v9'
      mapboxApiAccessToken={mapbox.token}
      onViewportChange={setViewport}
    >
      <Editor
        clickRadius={12}
        editHandleShape={'circle'}
        editHandleStyle={getEditHandleStyle}
        featureStyle={getFeatureStyle}
        features={existingPolygon}
        mode={mode}
        onSelect={onSelect}
        onUpdate={onUpdate}
        ref={editorRef}
        style={{ width: '100%', height: '100%' }}
      />
      {drawTools}
    </MapGL>
  )
}
