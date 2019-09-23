import React, { FC } from 'react'
import { Radio } from 'vtex.styleguide'
import StorePickupItem from './StorePickupItem'

interface Props {
  isSelected: boolean
  location: SkuPickupLocation
  onSelectItem: () => void
}

const ListItem: FC<Props> = ({ location, isSelected, onSelectItem }) => {
  const bgColor = isSelected ? 'bg-near-white' : 'bg-base'
  return (
    <div className={`flex ${bgColor} pa4 bt bb b--muted-4 ph7-l`}>
      <div className="mt3">
        <Radio
          checked={isSelected}
          id=""
          label=""
          name=""
          value=""
          onChange={onSelectItem}
        />
      </div>
      <StorePickupItem location={location} />
    </div>
  )
}

export default ListItem