import React, { FC } from 'react'

import { IconLocationInput } from 'vtex.store-icons'

interface Props {
  onClick: (e: any) => void
}

const LocationInputIcon: FC<Props> = ({ onClick }) => {
  return (
    <span
      onClick={onClick}
      className="pointer vtex-input-icon vtex-input-icon--location c-action-primary"
    >
      <IconLocationInput size={18} viewBox="0 0 18 18" />
    </span>
  )
}

export default LocationInputIcon
