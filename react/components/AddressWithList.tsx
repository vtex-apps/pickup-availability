import React, { FC, useReducer, useCallback, useMemo } from 'react'
import { Spinner } from 'vtex.styleguide'

import AddressInput from './AddressInput'
import StoreListQuery from './StoreListQuery'
import AddressBarLoader from './Loaders/AddressBarLoader'

interface Props {
  selectedAddressId: string | undefined
  googleMapsKey: string
  onPickupChange: (pickup?: FavoritePickup) => void
}

const LoadingOverlay: FC<{ loading: boolean }> = ({ children, loading }) => {
  return (
    <div className="relative justify-center flex-column">
      {loading && <div className="absolute w-100 h-100 z-2" style={{ background: 'rgba(255, 255, 255, .6)' }}>
        <div className="absolute top-0 bottom-0 left-0 right-0 flex justify-center items-center">
          <Spinner />
        </div>
      </div>}
      {children}
    </div>
  )
}

const intialState = {
  coords: { lat: null, long: null },
  pickupChangeLoading: false,
}

function reducer(state: ContextState, action: Actions): ContextState {
  switch (action.type) {
    case 'SET_COORDS': {
      return {
        ...state,
        coords: action.args.coords,
      }
    }
    case 'PICKUP_CHANGE_REQUEST': {
      return {
        ...state,
        pickupChangeLoading: true,
      }
    }
    case 'PICKUP_CHANGE_DONE': {
      return {
        ...state,
        pickupChangeLoading: false,
      }
    }
    default:
      return state
  }
}

const AddressWithList: FC<Props> = ({ googleMapsKey, selectedAddressId, onPickupChange }) => {
  const [state, dispatch] = useReducer(reducer, intialState)

  const onPlaceSelected = useCallback((place: google.maps.places.PlaceResult) => {
    const { geometry } = place
    if (!geometry) {
      // do nothing for now
      return
    }
    dispatch({
      type: 'SET_COORDS',
      args: {
        coords: {
          lat: geometry.location.lat().toString(),
          long: geometry.location.lng().toString(),
        }
      }
    })
  }, [])

  const onCurrentPositionReceived = useCallback(({
    lat,
    long,
  }: Coords) => {
    dispatch({
      type: 'SET_COORDS',
      args: {
        coords: {
          lat,
          long,
        }
      }
    })
  }, [])

  const loadingElement = useMemo(() => <AddressBarLoader />, [])

  return (
    <div>
      <AddressInput
        googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${googleMapsKey}&v=3.exp&libraries=places`}
        loadingElement={loadingElement}
        onPlaceSelected={onPlaceSelected}
        onCurrentPositionReceived={onCurrentPositionReceived}
        googleMapsKey={googleMapsKey}
      />
      <LoadingOverlay loading={state.pickupChangeLoading}>
        <StoreListQuery
          coords={state.coords}
          selectedAddressId={selectedAddressId}
          onPickupChange={onPickupChange}
          dispatch={dispatch}
        />
      </LoadingOverlay>
    </div>

  )
}

export default AddressWithList