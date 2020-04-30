import React, { FC } from 'react'
import TranslateEstimate from 'vtex.shipping-estimate-translator/TranslateEstimate'
import { FormattedMessage } from 'react-intl'
import { applyModifiers, useCssHandles } from 'vtex.css-handles'

const CSS_HANDLES = ['estimateTranslated', 'pickupItem', 'pickupName', 'pickupAddress', 'pickupEstimate', 'pickupUnavailable'] as const

interface Props {
  store: SkuPickupStore
}

const StorePickupItem: FC<Props> = ({ store }) => {
  const handles = useCssHandles(CSS_HANDLES)
  const { pickupStoreInfo: { address, friendlyName }, shippingEstimate } = store
  const estimate = shippingEstimate && (
    <div className={`${handles.estimateTranslated} ml2`}>
      <TranslateEstimate shippingEstimate={shippingEstimate} isPickup />
    </div>
  )

  return (
    <div className={`flex flex-column t-body lh-copy c-muted-2 ${handles.pickupItem}`}>
      <span className={`t-heading-6 c-on-base ${handles.pickupName}`}>{`${friendlyName}`}</span>
      <span className={handles.pickupAddress}>{`${address.street}${address.number ? `, ${address.number}` : ''}`}</span>
      <div className={`${shippingEstimate ?
        applyModifiers(handles.pickupEstimate, shippingEstimate) :
        handles.pickupUnavailable} flex`}>
        {shippingEstimate ? (
          <FormattedMessage id="store/pickup-availability.pickup-estimate" values={{ estimate }} />
        ) : (
            <FormattedMessage id="store/pickup-availability.pickup-unavailable" />
          )}
      </div>
    </div>
  )
}

export default StorePickupItem
