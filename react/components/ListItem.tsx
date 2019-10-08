import React, { FC } from 'react'
import { Radio } from 'vtex.styleguide'
import StorePickupItem from './StorePickupItem'
import { useCssHandles, applyModifiers } from 'vtex.css-handles'

const CSS_HANDLES = ['storeListItem'] as const

interface Props {
  isSelected: boolean
  store: SkuPickupStore
  onSelectItem: () => void
}

const noop = () => { }

const ListItem: FC<Props> = ({ store, isSelected, onSelectItem }) => {
  const bgColor = isSelected ? 'bg-near-white' : 'bg-base'
  const handles = useCssHandles(CSS_HANDLES)
  const classes = applyModifiers(handles.storeListItem, isSelected ? 'selected' : 'unselected')

  return (
    <div
      role="button"
      className={`pointer flex ${bgColor} pa4 bt bb b--muted-4 ph7-l ${classes}`}
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
