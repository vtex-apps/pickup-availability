import React, { FC, Fragment } from 'react'
import { RectShape } from 'react-placeholder/lib/placeholders'

import { useShowWithDelay } from '../hooks/useShowWithDelay'

const AddressBarLoader: FC = () => {
  const canShow = useShowWithDelay()

  if (!canShow) {
    return (
      <div className="w-100" style={{ height: 60 }} />
    )
  }

  return (
    <Fragment>
      <RectShape color="#f3f3f3" style={{ height: 16, width: '200px' }} />
      <RectShape color="#f3f3f3" style={{ height: 48, width: '100%', marginTop: '6px' }} />
    </Fragment>
  )
}

export default AddressBarLoader
