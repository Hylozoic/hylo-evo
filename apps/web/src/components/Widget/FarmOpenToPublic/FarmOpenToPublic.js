import React from 'react'
import { useTranslation } from 'react-i18next'
import { keyBy } from 'lodash'
import { getOpeningHours, getPublicOfferings, getOpenToPublic, getFarmAddressLine1, getFarmLocality, getFarmAdministrativeArea, getFarmPostalCode, getFarmCountryCode } from 'store/selectors/farmExtensionSelectors'
import { PUBLIC_OFFERINGS } from 'util/constants'
import { FarmDetailSection } from '../FarmDetailsWidget/FarmDetailsWidget'
import classes from './FarmOpenToPublic.module.scss'

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
  const { t } = useTranslation()

  return (
    openToPublic
      ? <div className={cx(classes.farmOpenToPublicContainer)}>
        <div className={cx(classes.openingHours)}>{t('Open'), openingHours}</div>
        {getFarmAddressLine1(group) &&
          <div className={classes.address}>
            <div className={classes.addressLine}>{getFarmAddressLine1(group)}</div>
            <div className={classes.addressLine}>{`${getFarmLocality(group)}, ${getFarmAdministrativeArea(group)}`}</div>
            <div className={classes.addressLine}>{`${getFarmPostalCode(group)}, ${getFarmCountryCode(group)}`}</div>
          </div>}
        {publicOfferings.length > 0 && <FarmDetailSection items={publicOfferings.map((offering) => publicOfferingsLookup[offering].label)} title={t('Public Offerings')} />}
      </div>
      : null
  )
}
