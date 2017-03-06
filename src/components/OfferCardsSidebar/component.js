import React from 'react'
import CardOffer from 'components/CardOffer'

const { string, bool } = React.PropTypes

export default function OfferCardsSidebar () {
  return <div styleName='offer-cards'>
    <CardOffer />
    <CardOffer />
    <CardOffer />
    <CardOffer />
  </div>
}
OfferCardsSidebar.propTypes = {
  label: string,
  color: string,
  active: bool,
  className: string
}
