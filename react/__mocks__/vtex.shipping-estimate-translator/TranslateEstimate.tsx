import React, { FC } from 'react'

const TranslateEstimate: FC<any> = ({ shippingEstimate, isPickup }) => (
  <div>{`shipping estimate: ${shippingEstimate}, isPickup: ${isPickup}`}</div>
)

export default TranslateEstimate
