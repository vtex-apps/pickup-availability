import React, { FC } from 'react'
import TranslateEstimate from 'vtex.shipping-estimate-translator/TranslateEstimate'
import { FormattedMessage } from 'react-intl'

import styles from './styles.css'

interface Props {
  store: SkuPickupStore
}

const StorePickupItem: FC<Props> = ({ store }) => {
  const { pickupStoreInfo: { address, friendlyName }, shippingEstimate } = store
  const estimate = shippingEstimate && (
    <div className={`${styles.estimateTranslated} ml2`}>
      <TranslateEstimate shippingEstimate={shippingEstimate} isPickup />
    </div>
  )

  return (
    <div className={`flex flex-column t-body lh-copy c-muted-2 ${styles.pickupItem}`}>
      <span className={`t-heading-6 c-on-base ${styles.pickupName}`}>{`${friendlyName}`}</span>
      <span className={styles.pickupAddress}>{`${address.street}${address.number ? `, ${address.number}` : ''}`}</span>
      <div className={`${shippingEstimate ? styles.pickupEstimate : styles.pickupUnavailable} flex`}>
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
