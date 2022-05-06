import React from 'react'
import { keyBy } from 'lodash'
import { getOpeningHours, getPublicOfferings, getOpenToPublic, getFarmAddressLine1, getFarmLocality, getFarmAdministrativeArea, getFarmPostalCode, getFarmCountryCode } from 'store/selectors/farmExtensionSelectors'
import { PUBLIC_OFFERINGS } from 'util/constants'
import { FarmDetailSection } from '../FarmDetailsWidget/FarmDetailsWidget'
import './FarmOpenToPublic.scss'

const publicOfferingsLookup = keyBy(PUBLIC_OFFERINGS, 'value')

export default function FarmOpenToPublic ({ group }) {
  /*
    - opening hours
    - address
    - public offerings
  */
  const openingHours = getOpeningHours(group)
  const publicOfferings = getPublicOfferings(group)
  const openToPublic = getOpenToPublic(group)

  return (
    openToPublic
      ? <div styleName='farm-open-to-public-container'>
        <div styleName='opening-hours'>Open {openingHours}</div>
        {getFarmAddressLine1(group) &&
          <div styleName='address'>
            <div styleName='address-line'>{getFarmAddressLine1(group)}</div>
            <div styleName='address-line'>{`${getFarmLocality(group)}, ${getFarmAdministrativeArea(group)}`}</div>
            <div styleName='address-line'>{`${getFarmPostalCode(group)}, ${getFarmCountryCode(group)}`}</div>
          </div>}
        {publicOfferings.length > 0 && <FarmDetailSection items={publicOfferings.map((offering) => publicOfferingsLookup[offering].label)} title='Public Offerings' />}
      </div>
      : null
  )
}
