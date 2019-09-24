import React from 'react'
import { FormattedMessage } from 'react-intl'

import styles from './styles.css'

const SelectSkuMessage = () => {
  return (
    <div className={`flex flex-column lh-copy ${styles.selectSkuContainer}`}>
      <div className={`c-muted-2 t-body ${styles.availabilityHeader}`}>
        <FormattedMessage id="store/pickup-availability.availability-header" />
      </div>
      <div className={`c-on-base t-body ${styles.selectSkuMessage}`}>
        <FormattedMessage id="store/pickup-availability.select-sku" />
      </div>
    </div>
  )
}

export default SelectSkuMessage