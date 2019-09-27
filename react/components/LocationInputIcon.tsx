import React, { FC } from 'react'

import { IconLocationInput } from 'vtex.store-icons'

interface Props {
  onClick: (e: any) => void
}

const LocationInputIcon: FC<Props> = ({ onClick }) => {
  return (
    <span
      onClick={onClick}
      className="pointer c-action-primary"
    >
      <IconLocationInput size={18} viewBox="0 0 18 18" />
    </span>
  )
}

export default LocationInputIcon
