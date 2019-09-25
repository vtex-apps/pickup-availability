import React, { FC, useState, useEffect } from 'react'
import { Button } from 'vtex.styleguide'
import { FormattedMessage } from 'react-intl'
import { path } from 'ramda'

import SelectSkuMessage from './SelectSkuMessage'
import StoreSelectedQuery from './StoreSelectedQuery'
import AddressWithList from './AddressWithList'

interface Props {
  googleMapsKey?: string
  showSelectSkuMessage: boolean
}

function usePickupFromSession() {
  const [favoritePickup, setFavoritePickup] = useState<FavoritePickup | undefined>(undefined)

  useEffect(() => {
    let isCurrent = true
    const sessionPromise = (window as any).__RENDER_8_SESSION__.sessionPromise
    sessionPromise.then((data: SessionData) => {
      const favoritePickupData = path<SessionPickup>(['response', 'namespaces', 'public', 'favoritePickup', 'value'], data)
      if (!favoritePickupData) {
        return
      }
      const { name, address } = favoritePickupData
      const { geoCoordinate, ...rest } = address
      if (isCurrent) {
        setFavoritePickup({ name, address: { ...rest, geoCoordinates: geoCoordinate } })
      }
    })
    return () => {
      isCurrent = false
    }
  }, [])

  return { favoritePickup, setFavoritePickup }
}


const ContainerStateSelector: FC<Props> = ({ showSelectSkuMessage, googleMapsKey }) => {
  const [showAddressForm, setShowForm] = useState(false)
  const { favoritePickup, setFavoritePickup } = usePickupFromSession()

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
        selectedAddressId={path<string>(['address', 'addressId'], favoritePickup)}
        onPickupChange={(pickup?: FavoritePickup) => {
          setShowForm(false)
          setFavoritePickup(pickup)
        }}
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
