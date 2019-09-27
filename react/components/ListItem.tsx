import React, { FC } from 'react'
import { Radio } from 'vtex.styleguide'
import StorePickupItem from './StorePickupItem'

import styles from './styles.css'

interface Props {
  isSelected: boolean
  store: SkuPickupStore
  onSelectItem: () => void
}

const noop = () => { }

const ListItem: FC<Props> = ({ store, isSelected, onSelectItem }) => {
  const bgColor = isSelected ? 'bg-near-white' : 'bg-base'

  return (
    <div
      role="button"
      className={`pointer flex ${bgColor} pa4 bt bb b--muted-4 ph7-l ${styles.storeListItem}`}
      onClick={onSelectItem}
      onKeyDown={e => e.key === 'Enter' && onSelectItem()}
      tabIndex={0}
    >
      <div className="mt3">
        {/* Decorative Radio element */}
        <Radio
          checked={isSelected}
          id=""
          label=""
          name=""
          value=""
          onChange={noop}
        />
      </div>
      <StorePickupItem store={store} />
    </div>
  )
}

export default ListItem
