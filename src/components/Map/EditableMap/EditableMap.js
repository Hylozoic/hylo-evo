import React, { useCallback, useEffect, useRef, useState } from 'react'
import MapGL from 'react-map-gl'
import { Editor, DrawPolygonMode, EditingMode } from 'react-map-gl-draw'
import Icon from '../../Icon'
import { mapbox } from 'config'

import { getEditHandleStyle, getFeatureStyle } from './EditableMapStyles'
import './EditableMap.scss'

export default function EditableMap (props) {
  const { locationObject, polygon, savePolygon } = props
  const centerAt = locationObject?.center
  const showLocationOnMap = !polygon && centerAt
  const [viewport, setViewport] = useState(null)
  const [mode, setMode] = useState(null)
  const [selectedFeatureIndex, setSelectedFeatureIndex] = useState(null)
  const [isModeDrawing, setIsModeDrawing] = useState(false)
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

  const toggleMode = () => {
    setMode(isModeDrawing ? new EditingMode() : new DrawPolygonMode())
    setIsModeDrawing(!isModeDrawing)
  }

  const drawTools = (
    <div className='mapboxgl-ctrl-top-left'>
      <div className='mapboxgl-ctrl-group mapboxgl-ctrl'>
        <button
          styleName='mapbox-gl-draw_polygon'
          title='New Polygon'
          onClick={() => toggleMode()}
        ><Icon styleName={'drawing-icon'} name='Drawing' /></button>
      </div>
      <div className='mapboxgl-ctrl-group mapboxgl-ctrl'>
        <button
          styleName='mapbox-gl-draw_trash'
          title='Delete Polygon'
          onClick={onDelete}
        ><Icon styleName={'trash-icon'} name='Trash' /></button>
      </div>
      <div className='mapboxgl-ctrl-group mapboxgl-ctrl'>
        <button
          styleName='mapbox-gl-draw_reset'
          title='Reset Drawing'
          onClick={() => setMode(new EditingMode())}
        ><Icon styleName={'circle-arrow-icon'} name='CircleArrow' /></button>
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
