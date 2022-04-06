import React from 'react'
import { keyBy } from 'lodash'
import { getFarmAddress, getOpeningHours, getPublicOfferings, getOpenToPublic } from 'store/selectors/farmExtensionSelectors'
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
  const address = getFarmAddress(group)
  const publicOfferings = getPublicOfferings(group)
  const openToPublic = getOpenToPublic(group)

  return (
    openToPublic ?
      <div styleName='farm-open-to-public-container'>
        <div styleName='opening-hours'>Open {openingHours}</div>
        {address.address_line1 &&
          <div styleName='address'>
            <div styleName='address-line'>{address.address_line1}</div>
            <div styleName='address-line'>{`${address.locality}, ${address.administrative_area}`}</div>
            <div styleName='address-line'>{`${address.postal_code}, ${address.country}`}</div>
          </div>}
        {publicOfferings.length > 0 && <FarmDetailSection items={publicOfferings.map((offering) => publicOfferingsLookup[offering].label)} title='Public Offerings' />}
      </div>
      : null
  )
}
