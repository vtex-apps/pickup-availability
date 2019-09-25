import React, { Fragment, FC } from 'react'
import { path } from 'ramda'
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
type SavePickupMutation = MutationFunc<{ favoritePickup: FavoritePickup }, Variables>

interface Props {
  stores: SkuPickupStore[]
  maxItems?: number
  selectedAddressId: string | undefined
  savePickupInSession: SavePickupMutation
  onPickupChange: (pickup?: FavoritePickup) => void
  dispatch: DispatchFn
  onPressPickup?: () => void
}

const StoreList: FC<Props> = ({ stores, maxItems, selectedAddressId, savePickupInSession, onPickupChange, dispatch, onPressPickup }) => {
  const items = maxItems && stores.length > maxItems ? stores.slice(0, maxItems) : stores

  const saveMutation = (store: SkuPickupStore) => {
    const { address, friendlyName } = store.pickupStoreInfo
    return savePickupInSession({
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
      {items.map(store => {
        return (
          <ListItem
            key={store.id}
            isSelected={store.pickupStoreInfo.address.addressId === selectedAddressId}
            store={store}
            onSelectItem={() => {
              onPressPickup && onPressPickup()
              dispatch({ type: 'PICKUP_CHANGE_REQUEST' })
              saveMutation(store).then(response => {
                dispatch({ type: 'PICKUP_CHANGE_DONE' })
                onPickupChange(path<FavoritePickup>(['data', 'savePickupInSession', 'favoritePickup'], response))
              }).catch(() => {
                dispatch({ type: 'PICKUP_CHANGE_DONE' })
              })
            }}
          />
        )
      })}
    </Fragment>
  )
}

export default graphql<any>(savePickupInSession, { name: 'savePickupInSession' })(StoreList)