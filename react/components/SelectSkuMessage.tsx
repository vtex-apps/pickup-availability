import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'

const CSS_HANDLES = ['selectSkuContainer', 'availabilityHeader', 'selectSkuMessage'] as const

const SelectSkuMessage = () => {
  const handles = useCssHandles(CSS_HANDLES)
  return (
    <div className={`flex flex-column lh-copy ${handles.selectSkuContainer}`}>
      <div className={`c-muted-2 t-body ${handles.availabilityHeader}`}>
        <FormattedMessage id="store/pickup-availability.availability-header" />
      </div>
      <div className={`c-on-base t-body ${handles.selectSkuMessage}`}>
        <FormattedMessage id="store/pickup-availability.select-sku" />
      </div>
    </div>
  )
}

export default SelectSkuMessage