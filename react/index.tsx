import React, { useState } from 'react'
import { Input } from 'vtex.styleguide'
import { FormattedMessage } from 'react-intl'

import TranslatedTitle from './TranslatedTitle'

import styles from './styles.css'

const BaseApp = ({ title }) => {
  const [inputValue, setValue] = useState(null)

  return (
    <div className={`${styles.container} flex flex-column pv6 ph4`}>
      <TranslatedTitle title={title} />
      <div className="t-body pv4">
        <FormattedMessage id="base.change-value" values={{ value:  inputValue || '' }} />
      </div>
      <Input onChange={e => setValue(e.target.value)} value={inputValue} />
    </div>
  )
}

BaseApp.defaultProps = {
  title: null,
}

BaseApp.schema = {
  title: 'editor.base-store-component.title',
  description: 'editor.base-store-component.description',
  type: 'object',
  properties: {
    title: {
      title: 'editor.base-store-component.title.title',
      description: 'editor.base-store-component.title.description',
      type: 'string',
      default: null,
    },
  },
}

export default BaseApp
