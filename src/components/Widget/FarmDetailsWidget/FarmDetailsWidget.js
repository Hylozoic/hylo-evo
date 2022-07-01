import React, { useState } from 'react'
import Pill from 'components/Pill'
import cx from 'classnames'
import { capitalize, keyBy } from 'lodash'
import { animalCountToRange, areaToRange } from 'store/presenters/presentFarmData'
import {
  getAnimalProducts,
  getAnimalTotalCount,
  getArea,
  getCertifitcationsCurrentDetail,
  getClimateZone,
  getHardinessZone,
  getManagementPlansCurrentDetail,
  getOperationTypes,
  getProductDetail,
  getProductsValueAdded,
  getUnitPreference
} from 'store/selectors/farmExtensionSelectors'
import { ANIMAL_LIST, CLIMATE_ZONES, FARM_PRODUCT_LIST, FARM_CERTIFICATIONS, MANAGEMENT_PLANS, FARM_TYPES } from 'util/constants'
import './FarmDetailsWidget.scss'

const animalListLookup = keyBy(ANIMAL_LIST, 'value')
const productLookup = keyBy(FARM_PRODUCT_LIST, 'value')
const certificationsLookup = keyBy(FARM_CERTIFICATIONS, 'value')
const managementPlansLookup = keyBy(MANAGEMENT_PLANS, 'value')
const operationTypeLookup = keyBy(FARM_TYPES, 'value')

export default function FarmDetailsWidget ({ group }) {
  /*
    Overview
    - acres/hectares (range instead of precise number)
    - animal count (range instead of precise number)
    - climate zone
    - hardiness zone

    Breakout
    - animal types
    - product details
    - product value added

    - goals
    - certifications current
    - management techniques

  */
  const [showMore, setShowMore] = useState(false)
  const unitPreference = getUnitPreference(group)

  let overviewLabels = []
  if (areaToRange(getArea(group), unitPreference)) overviewLabels.push(`Area: ${areaToRange(getArea(group), unitPreference)}`)
  if (getAnimalTotalCount(group)) overviewLabels.push(`Livestock: ${animalCountToRange(getAnimalTotalCount(group))}`)
  if (getClimateZone(group)) overviewLabels.push(`Climate Zone: ${CLIMATE_ZONES.find((zone) => zone.value === getClimateZone(group)).label}`)
  if (getHardinessZone(group)) overviewLabels.push(`Hardiness Zone: ${getHardinessZone(group)}`)
  if (getOperationTypes(group).length > 0) overviewLabels = overviewLabels.concat(getOperationTypes(group).map((type) => operationTypeLookup[type].label))
  let productLabels = []
  if (getAnimalProducts(group).length > 0) productLabels = productLabels.concat(getAnimalProducts(group).map((product) => animalListLookup[product].label))
  if (getProductDetail(group).length > 0) productLabels = productLabels.concat(getProductDetail(group).map((product) => capitalize(productLookup[product].label)))
  if (getProductsValueAdded(group).length > 0) productLabels = productLabels.concat(getProductsValueAdded(group).map((value) => capitalize(value)))

  const numProducts = getAnimalProducts(group).length + getProductDetail(group).length
  const numCertifications = getCertifitcationsCurrentDetail(group).length
  const numManagementPlans = getManagementPlansCurrentDetail(group).length
  let numOfSections = 0
  if (numProducts) numOfSections += 1
  if (numCertifications) numOfSections += 1
  if (numManagementPlans) numOfSections += 1
  const isThereMoreToShow = (numOfSections > 1 || numProducts + numCertifications + numManagementPlans > 6)

  return (
    <>
      <div styleName={cx('farm-details-container', { showless: !showMore })}>
        <div styleName='group-tags'>
          {overviewLabels.map((attribute, index) => (
            <Pill
              styleName='tag-pill'
              darkText
              label={attribute}
              id={attribute}
              key={index}
            />
          ))}
        </div>
        {numProducts > 0 && <FarmDetailSection title='Products' items={productLabels} />}
        {numCertifications > 0 && <FarmDetailSection title='Certifications' items={getCertifitcationsCurrentDetail(group).map((cert) => certificationsLookup[cert].label)} />}
        {numManagementPlans > 0 && <FarmDetailSection title='Management Techniques' items={getManagementPlansCurrentDetail(group).map((plan) => managementPlansLookup[plan].label)} />}
      </div>
      {isThereMoreToShow &&
        <div>
          <div styleName='separator-bg' />
          <div styleName='separator' />
          <Pill styleName='green-pill' onClick={() => setShowMore(!showMore)} label={showMore ? 'Show Less' : 'Show More'} />
        </div>}
    </>
  )
}

export function FarmDetailSection ({ title, items }) {
  return (
    <div>
      {title &&
        <div styleName='header'>
          <h4>
            {title}
          </h4>
        </div>}
      <div styleName='group-tags'>
        {items.map((attribute, index) => {
          return (
            attribute &&
              <Pill
                styleName='tag-pill'
                darkText
                label={attribute}
                id={attribute}
                key={index}
              />
          )
        })}
      </div>
    </div>
  )
}
