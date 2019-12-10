import React, { FC } from 'react'
import { useShowWithDelay } from '../hooks/useShowWithDelay'
import { RectShape } from 'react-placeholder/lib/placeholders'

const ItemLoader: FC = () => {
  const canShow = useShowWithDelay()

  if (!canShow) {
    return (
      <div className="w-100" style={{ height: 80 }} data-testid="item-loader" />
    )
  }

  return (
    <div style={{ marginLeft: '10px' }}>
      <RectShape color="#f3f3f3" style={{ height: 28, width: '160px' }} />
      <RectShape color="#f3f3f3" style={{ height: 22, width: '200px', marginTop: '6px' }} />
      <RectShape color="#f3f3f3" style={{ height: 22, width: '200px', marginTop: '6px' }} />
    </div>
  )
}

export default ItemLoader
