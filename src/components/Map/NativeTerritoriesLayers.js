import React from 'react'
import { Layer, Source } from 'react-map-gl'
import { useTranslation } from 'react-i18next'
import { uniqBy } from 'lodash/fp'

import './Map.scss'

export default function NativeTerritoriesLayer (props) {
  const { cursorLocation, hoveredLayerFeatures, visibility } = props
  const { t } = useTranslation()
  const renderTooltip = () => {
    const displayFeatures = hoveredLayerFeatures && uniqBy('properties.Name', hoveredLayerFeatures.filter(f => f.layer.id === 'native_territories'))
    return (
      displayFeatures && displayFeatures.length > 0 && (
        <div styleName='tooltip' style={{ left: cursorLocation.x + 10, top: cursorLocation.y + 10 }}>
          <h3>{t('Native Territories')}</h3>
          <div>{displayFeatures.reduce((acc, f) => [...acc, <div key={f.properties.Name}>{f.properties.Name}</div>], [])}</div>
        </div>
      )
    )
  }

  return (
    <>
      <Source id='native_lands' type='geojson' data='https://hylo-app.s3.amazonaws.com/map/indigenousTerritories.json'>
        <Layer
          id='native_territories'
          type='fill'
          paint={{
            'fill-color': ['get', 'color'],
            'fill-opacity': 0.25,
            'fill-outline-color': 'black'
          }}
          layout={{
            visibility: visibility ? 'visible' : 'none'
          }}
        />
        <Layer
          id='native_territory_label'
          type='symbol'
          layout={{
            'text-field': ['to-string', ['get', 'Name']],
            'text-size': 14,
            'text-anchor': 'center',
            visibility: visibility ? 'visible' : 'none'
          }}
          paint={{
            'text-halo-color': 'rgba(255, 255, 255, 1)',
            'text-halo-width': 1,
            'text-halo-blur': 2
          }}
        />
      </Source>
      {renderTooltip()}
    </>
  )
}
