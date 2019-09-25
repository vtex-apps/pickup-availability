import React, { FC, useState } from 'react'
import { Button } from 'vtex.styleguide'
import { FormattedMessage } from 'react-intl'

import SelectSkuMessage from './SelectSkuMessage'
import StoreSelectedQuery from './StoreSelectedQuery'
import AddressWithList from './AddressWithList'

interface Props {
  favoritePickup?: FavoritePickup
  googleMapsKey?: string
  showSelectSkuMessage: boolean
  selectedAddressId?: string
}


const ContainerStateSelector: FC<Props> = ({ favoritePickup, showSelectSkuMessage, googleMapsKey, selectedAddressId }) => {
  const [showAddressForm, setShowForm] = useState(false)

  if (showSelectSkuMessage) {
    return <SelectSkuMessage />
  }

  if (!showAddressForm && favoritePickup) {
    return (
      <StoreSelectedQuery
        pickup={favoritePickup}
        onChangeStoreClick={() => setShowForm(true)}
      />
    )
  }

  if (showAddressForm && googleMapsKey) {
    return (
      <AddressWithList
        googleMapsKey={googleMapsKey}
        selectedAddressId={selectedAddressId}
        onPickupChange={() => setShowForm(false)}
      />
    )
  }

  return (
    <div className="flex flex-column">
      <div className="c-muted-2 t-body mb1 ml3">
        <FormattedMessage id="store/pickup-availability.availability-header" />
      </div>
      <div className="c-on-base t-body mb1 ml3 mt3">
        <FormattedMessage id="store/pickup-availability.available-for-pickup" />
      </div>
      <div>
        <Button onClick={() => setShowForm(true)} variation="tertiary">
          <div className="t-body nh5">
            <FormattedMessage id="store/pickup-availability.choose-store" />
          </div>
        </Button>
      </div>
    </div>
  )
}

export default ContainerStateSelector
