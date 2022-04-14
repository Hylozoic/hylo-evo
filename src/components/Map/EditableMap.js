import React, { useState, useRef, useCallback } from 'react'
import MapGL from 'react-map-gl'
import { Editor, DrawPolygonMode, EditingMode } from 'react-map-gl-draw'
import { mapbox } from 'config'

import { getFeatureStyle, getEditHandleStyle } from './EditableMapStyles'

export default function EditableMap () {
  const [viewport, setViewport] = useState({
    longitude: -122.2712,
    latitude: 37.8044,
    zoom: 12
  })
  const [mode, setMode] = useState(null)
  const [selectedFeatureIndex, setSelectedFeatureIndex] = useState(null)
  const editorRef = useRef(null)

  const onSelect = useCallback(options => {
    setSelectedFeatureIndex(options && options.selectedFeatureIndex)
  }, [])

  const onDelete = useCallback(() => {
    if (selectedFeatureIndex !== null && selectedFeatureIndex >= 0) {
      editorRef.current.deleteFeatures(selectedFeatureIndex)
    }
  }, [selectedFeatureIndex])

  const onUpdate = useCallback(({ editType }) => {
    if (editType === 'addFeature') {
      setMode(new EditingMode())
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

  // const features = editorRef.current && editorRef.current.getFeatures()
  // const selectedFeature =
  //   features && (features[selectedFeatureIndex] || features[features.length - 1])

  return (
    <>
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
          ref={editorRef}
          style={{ width: '100%', height: '100%' }}
          clickRadius={12}
          mode={mode}
          onSelect={onSelect}
          onUpdate={onUpdate}
          editHandleShape={'circle'}
          featureStyle={getFeatureStyle}
          editHandleStyle={getEditHandleStyle}
        />
        {drawTools}
      </MapGL>
    </>
  )
}
