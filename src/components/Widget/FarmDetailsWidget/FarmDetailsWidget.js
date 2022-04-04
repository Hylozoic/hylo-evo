import React from 'react'
import Pill from 'components/Pill'
import { capitalize } from 'lodash'

import './FarmDetailsWidget.scss'

export default function FarmDetailsWidget (props) {
  /*
    Overview
    - acres/hectares (range instead of precise number)
    - animal count (range instead of precise number)
    - climate zone
    - hardiness zone
    - soil

    Breakout
    - animal types
    - product details
    - product value added

    - goals
    - certifications current
    - management techniques

    <div styleName='group-tags'>
            {topics.map((topic, index) => (
              <Pill
                styleName='tag-pill'
                darkText
                label={capitalize(topic.topic.name.toLowerCase())}
                id={topic.id}
                key={index}
              />
            ))}
          </div>

  */

  const areaToRange = (area, unit) => {
   if (!area || typeof area !== 'number') return null
   if (area < 1) return unit === 'acres' ? 'Less than an acre' : 'Less than half a hectare'
   if (area <= 5) return unit === 'acres' ? '1-5 acres' : '0.5-2 hectares'
   if (area <= 20) return unit === 'acres' ? '5-20 acres' : '2-8 hectares'
   if (area <= 50) return unit === 'acres' ? '20-50 acres' : '8-20 hectares'
   if (area <= 100) return unit === 'acres' ? '50-100 acres' : '20-40 hectares'
   if (area <= 500) return unit === 'acres' ? '100-500 acres' : '40-200 hectares'
   if (area <= 1000) return unit === 'acres' ? '500-1000 acres' : '200-400 hectares'
   if (area <= 5000) return unit === 'acres' ? '1000-5000 acres' : '400-2000 hectares'
   if (area <= 10000) return unit === 'acres' ? '5000-10000 acres' : '2000-4000 hectares'
   if (area <= 50000) return unit === 'acres' ? '10000-50000 acres' : '4000-20000 hectares'
   return unit === 'acres' ? '50000+ acres' : '20000+ hectares'
  }

  const overviewLabels = [
    `Area: `
  ]

  return (
    <div styleName='farm-details-container'>
      Nothing to see here
    </div>
  )
}
