import React, { Fragment, FC } from 'react'
import { graphql, MutationFunc } from 'react-apollo'

import savePickupInSession from '../mutations/savePickupInSession.gql'

import ListItem from './ListItem'


interface Variables {
  name: string
  address: {
    addressId: string
    postalCode: string
    city: string
    complement: string
    country: string
    state: string
    street: string
    number: string
    neighborhood: string
    geoCoordinates: [number, number]
  }
}
type SavePickupMutation = MutationFunc<{ favoritePickup: SessionFavoritePickup }, Variables>

interface Props {
  locations: SkuPickupLocation[]
  maxItems?: number
  selectedAddressId: string | undefined
  savePickupInSession: SavePickupMutation
  onPickupChange: () => void
  dispatch: DispatchFn
  onPressPickup?: () => void
}

const StoreList: FC<Props> = ({ locations, maxItems, selectedAddressId, savePickupInSession, onPickupChange, dispatch, onPressPickup }) => {
  const items = maxItems && locations.length > maxItems ? locations.slice(0, maxItems) : locations

  const saveMutation = async (location: SkuPickupLocation) => {
    const { address, friendlyName } = location.pickupStoreInfo
    await savePickupInSession({
      variables: {
        name: friendlyName,
        address: {
          addressId: address.addressId,
          postalCode: address.postalCode,
          city: address.city,
          complement: address.complement,
          country: address.country,
          state: address.state,
          street: address.street,
          number: address.number,
          neighborhood: address.neighborhood,
          geoCoordinates: address.geoCoordinates,
        }
      },
    })
  }

  return (
    <Fragment>
      {items.map((location) => {
        return (
          <ListItem
            key={location.id}
            isSelected={location.pickupStoreInfo.address.addressId === selectedAddressId}
            location={location}
            onSelectItem={() => {
              onPressPickup && onPressPickup()
              dispatch({ type: 'PICKUP_CHANGE_REQUEST' })
              saveMutation(location).finally(() => {
                dispatch({ type: 'PICKUP_CHANGE_DONE' })
                onPickupChange()
              })
            }}
          />
        )
      })}
    </Fragment>
  )
}

export default graphql<any>(savePickupInSession, { name: 'savePickupInSession' })(StoreList)