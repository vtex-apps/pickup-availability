import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'

const CSS_HANDLES = ['addressMessage']

const AddressInputMessage = () => {
  const handles = useCssHandles(CSS_HANDLES)
  return (
    <div className={`t-body c-on-base mv4 ${handles.addressMessage}`}>
      <FormattedMessage id="store/pickup-availability.input-form-header" />
    </div>
  )
}

export default AddressInputMessage
