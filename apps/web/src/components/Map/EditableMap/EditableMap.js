import { isEqual } from 'lodash/fp'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import MapGL from 'react-map-gl'
import { Editor, DrawPolygonMode, EditingMode } from 'react-map-gl-draw'
import centroid from '@turf/centroid'
import Icon from 'components/Icon'
import { mapbox } from 'config/index'
import cx from 'classnames'

import { getEditHandleStyle, getFeatureStyle } from './EditableMapStyles'
import classes from './EditableMap.module.scss'

export default function EditableMap (props) {
  const { locationObject, polygon, savePolygon, toggleModal } = props
  const [isPolygonSelected, setIsPolygonSelected] = useState(false)

  const fallbackCoords = {
    latitude: 35.442845,
    longitude: 7.916598,
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
    setDisplayPolygon(getFormattedPolygon(polygon))
  }, [polygon])

  useEffect(() => {
    const polygonCenter = !isEqual(displayPolygon, emptyGeoJsonObject) ? centroid(displayPolygon[0]).geometry.coordinates : null
    const viewportLocation = polygonCenter?.length > 0 ? {
      longitude: polygonCenter[0],
      latitude: polygonCenter[1],
      zoom: 12
    } : centerAt ? {
      longitude: parseFloat(centerAt.lng),
      latitude: parseFloat(centerAt.lat),
      zoom: 12
    } : fallbackCoords
    setViewport(viewportLocation)
  }, [displayPolygon])

  useEffect(() => {
    editorRef.current && console.log({ editorFeatures: editorRef.current.getFeatures() })
  }, [isModeDrawing, mode])

  const toggleMode = () => {
    setMode(!isModeDrawing ? new DrawPolygonMode() : new EditingMode())
    setIsModeDrawing(!isModeDrawing)
  }

  const onSelect = useCallback(options => {
    setIsPolygonSelected(!!options.selectedFeature)
    setSelectedFeatureIndex(options?.selectedFeatureIndex || 0)
  }, [])

  const onDelete = useCallback(() => {
    setIsPolygonSelected(false)
    if (selectedFeatureIndex !== null && selectedFeatureIndex >= 0) {
      editorRef.current.deleteFeatures(selectedFeatureIndex)
      savePolygon(null)
      setDisplayPolygon(emptyGeoJsonObject)
    } else {
      setMode(new EditingMode())
      setIsModeDrawing(false)
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

  const zoomIn = () => {
    setViewport({ ...viewport, zoom: viewport.zoom + 1 })
  }
  const zoomOut = () => {
    setViewport({ ...viewport, zoom: viewport.zoom - 1 })
  }
  const expand = () => {
    toggleModal()
  }

  const drawTools = (
    <div className='mapboxgl-ctrl-top-left'>
      <div className={cx(classes.mapboxglCtrlGroup, classes.mapboxglCtrl, classes.mapControl)}>
        <button
          className={cx(classes.mapboxGlGrawPolygon, { active: isModeDrawing })}
          title='New Polygon'
          onClick={toggleMode}
        ><Icon name='Drawing' /></button>
      </div>
      <div className={cx(classes.mapboxglCtrlGroup, classes.mapboxglCtrl, classes.mapControl)}>
        <button
          className={classes.mapboxGlDrawCircleEx}
          title='Delete selected polygon, click polygon to select'
          onClick={onDelete}
          disabled={!isPolygonSelected}
        >
          <Icon name='CircleEx' />
        </button>
      </div>
      {/* We may implement this later
       <div className={cx('mapboxgl-ctrl-group mapboxgl-ctrl', classes.mapControl)}>
        <button
          className={classes.mapboxGlDrawReset}
          title='Reset Drawing'
          onClick={() => setMode(new EditingMode())}
        ><Icon name='CircleArrow' /></button>
      </div> */}
    </div>
  )

  const zoomTools = (
    <div className='mapboxgl-ctrl-top-right'>
      <div className={cx(classes.mapboxglCtrlGroup, classes.mapboxglCtrl, classes.mapControl)}>
        <button
          className={classes.mapboxGlDrawPlus}
          title='Zoom In'
          onClick={zoomIn}
        >
          <Icon name='Plus' />
        </button>
        <button
          className={classes.mapboxGlDrawMinus}
          title='Zoom Out'
          onClick={zoomOut}
        >
          <Icon name='Minus' />
        </button>
      </div>
    </div>
  )

  const expandTools = (
    <div className='mapboxgl-ctrl-bottom-left'>
      <div className={cx(classes.mapboxglCtrlGroup, classes.mapboxglCtrl, classes.mapControl)}>
        <button
          className={classes.mapboxGlExpand}
          title='Expand'
          onClick={expand}
        >
          <Icon name='Expand' />
        </button>
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
      mapStyle='mapbox://styles/mapbox/satellite-v9'
      onViewportChange={setViewport}
      width='100%'
    >
      <span className={cx(classes.editableMap, { [classes.drawingMode]: isModeDrawing })}>
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
      {drawTools}{zoomTools}{expandTools}
    </MapGL>
  )
}
