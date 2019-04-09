import React from 'react'
import { injectIntl } from 'react-intl'

// The b-s token makes the `b` class be applied only on mobile devices.

const TranslatedTile = ({ intl, title }) => {
  const titleText = title || intl.formatMessage({ id: 'base.title' })
  return (
    <div className="flex flex-grow-1 justify-center b-s">
      <span className="t-heading-4">{titleText}</span>
    </div>
  )
}

export default injectIntl(TranslatedTile)
