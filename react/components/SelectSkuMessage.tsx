import React from 'react'
import { FormattedMessage } from 'react-intl'

const SelectSkuMessage = () => {
  return (
    <div className="flex flex-column lh-copy">
      <div className="c-muted-2 t-body">
        <FormattedMessage id="store/pickup-availability.availability-header" />
      </div>
      <div className="c-on-base t-body">
        <FormattedMessage id="store/pickup-availability.select-sku" />
      </div>
    </div>
  )
}

export default SelectSkuMessage