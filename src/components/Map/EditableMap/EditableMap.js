import React, { useCallback, useEffect, useRef, useState } from 'react'
import MapGL from 'react-map-gl'
import { Editor, DrawPolygonMode, EditingMode } from 'react-map-gl-draw'
import centroid from '@turf/centroid'
import Icon from 'components/Icon'
import { mapbox } from 'config'

import { getEditHandleStyle, getFeatureStyle } from './EditableMapStyles'
import './EditableMap.scss'

export default function EditableMap (props) {
  const { locationObject, polygon, savePolygon } = props
  const fallbackCoords = {
    longitude: -122.2712,
    latitude: 37.8044,
    zoom: 12
  }
  const emptyGeoJsonObject = [{
    geometry: {},
    properties: {},
    type: 'Feature'
  }]
  const parsePolygon = (polygonToParse) => {
    try {
      return JSON.parse(polygonToParse)
    } catch (e) {
      return emptyGeoJsonObject
    }
  }
  const getFormattedPolygon = (polygonToFormat) => {
    const parsedPolygon = polygonToFormat && typeof polygonToFormat === 'string' ? parsePolygon(polygonToFormat) : polygonToFormat || null
    if (parsedPolygon?.type === 'Feature') {
      return parsedPolygon
    } else if (parsedPolygon?.type === 'Polygon') {
      return [{
        geometry: parsedPolygon,
        properties: {},
        type: 'Feature'
      }]
    } else {
      return emptyGeoJsonObject
    }
  }

  const [viewport, setViewport] = useState(fallbackCoords)
  const [mode, setMode] = useState(new EditingMode())
  const [selectedFeatureIndex, setSelectedFeatureIndex] = useState(null)
  const [isModeDrawing, setIsModeDrawing] = useState(false)
  const [displayPolygon, setDisplayPolygon] = useState(getFormattedPolygon(polygon))

  const centerAt = locationObject?.center
  const editorRef = useRef(null)

  useEffect(() => {
    const formattedPolygon = getFormattedPolygon(polygon)
    const polygonCenter = formattedPolygon !== emptyGeoJsonObject ? centroid(formattedPolygon[0]).geometry.coordinates : null
    const viewportLocation = polygonCenter?.length > 0 ? {
      longitude: polygonCenter[0],
      latitude: polygonCenter[1],
      zoom: 12
    } : centerAt ? {
      longitude: parseFloat(centerAt.lat),
      latitude: parseFloat(centerAt.lng),
      zoom: 12
    } : fallbackCoords
    setViewport(viewportLocation)
  }, [displayPolygon])

  const toggleMode = () => {
    setMode(!isModeDrawing ? new DrawPolygonMode() : new EditingMode())
    setIsModeDrawing(!isModeDrawing)
  }

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
      const polygonToSave = getFormattedPolygon(data[data.length - 1])
      setMode(new EditingMode())
      setIsModeDrawing(false)
      savePolygon(polygonToSave)
      setDisplayPolygon([polygonToSave])
    }
  }, [])

  const drawTools = (
    <div className='mapboxgl-ctrl-top-left'>
      <div className='mapboxgl-ctrl-group mapboxgl-ctrl' styleName='map-control'>
        <button
          styleName={`mapbox-gl-draw_polygon${isModeDrawing ? ' active' : ''}`}
          title='New Polygon'
          onClick={toggleMode}
        ><Icon name='Drawing' /></button>
      </div>
      <div className='mapboxgl-ctrl-group mapboxgl-ctrl' styleName='map-control'>
        <button
          styleName='mapbox-gl-draw_circle-ex'
          title='Delete Polygon'
          onClick={onDelete}
        ><Icon name='CircleEx' /></button>
      </div>
      <div className='mapboxgl-ctrl-group mapboxgl-ctrl' styleName='map-control'>
        <button
          styleName='mapbox-gl-draw_reset'
          title='Reset Drawing'
          onClick={() => setMode(new EditingMode())}
        ><Icon name='CircleArrow' /></button>
      </div>
    </div>
  )

  return (
    <MapGL
      {...viewport}
      attributionControl={false}
      height='100%'
      mapboxApiAccessToken={mapbox.token}
      mapOptions={{ logoPosition: 'bottom-right' }}
      mapStyle='mapbox://styles/mapbox/light-v9'
      onViewportChange={setViewport}
      width='100%'
    >
      <span styleName={`editable-map${isModeDrawing ? ' drawing-mode' : ''}`}>
        <Editor
          clickRadius={12}
          editHandleShape={'circle'}
          editHandleStyle={getEditHandleStyle}
          featureStyle={getFeatureStyle}
          features={displayPolygon}
          mode={mode}
          onSelect={onSelect}
          onUpdate={onUpdate}
          ref={editorRef}
          style={{ width: '100%', height: '100%' }}
        />
      </span>
      {drawTools}
    </MapGL>
  )
}
