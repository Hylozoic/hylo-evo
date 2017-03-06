import React from 'react'
import CardOffer from 'components/CardOffer'

const { string, bool } = React.PropTypes

export default function OfferCardsMain () {
  return <div styleName='offer-cards'>
    <CardOffer />
    <CardOffer />
  </div>
}
OfferCardsMain.propTypes = {
  label: string,
  color: string,
  active: bool,
  className: string
}
