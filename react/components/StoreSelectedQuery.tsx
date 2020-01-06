import React, { FC } from 'react'
import { useQuery } from 'react-apollo'
import useProduct from 'vtex.product-context/useProduct'
import { Button } from 'vtex.styleguide'
import { FormattedMessage } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'

import skuPickupSLA from '../queries/skuPickupSLA.gql'

import StorePickupItem from './StorePickupItem'
import ItemLoader from './Loaders/ItemLoader'

const CSS_HANDLES = ['storeSelectedContainer', 'availabilityHeader', 'chooseDifferentStoreButton', 'chooseDifferentStoreButtonText'] as const

interface SkuPickupSLAData {
  skuPickupSLA: SkuPickupStore
}

interface Variables {
  itemId?: string
  seller?: string
  lat: string
  long: string
  country: string
  pickupId: string
}

interface Props {
  pickup: FavoritePickup
  onChangeStoreClick: () => void
}

const getVariablesFromSessionPickup = (pickup: FavoritePickup) => {
  const { geoCoordinates, country, addressId } = pickup.address
  const [long, lat] = geoCoordinates
  return {
    long: long.toString(),
    lat: lat.toString(),
    country: country,
    pickupId: addressId
  }
}

const createSlaFromSessionPickup = (pickup: FavoritePickup) => {
  return {
    cacheId: pickup.address.addressId,
    id: pickup.address.addressId,
    shippingEstimate: null,
    pickupStoreInfo: {
      friendlyName: pickup.name,
      address: pickup.address,
    }
  }
}

const StoreSelectedQuery: FC<Props> = ({ pickup, onChangeStoreClick }) => {
  const { selectedItem } = useProduct()
  const { long, lat, country, pickupId } = getVariablesFromSessionPickup(pickup)
  const handles = useCssHandles(CSS_HANDLES)

  const { error, data, loading } = useQuery<SkuPickupSLAData, Variables>(skuPickupSLA, {
    ssr: false,
    skip: !selectedItem,
    variables: {
      itemId: selectedItem?.itemId,
      seller: selectedItem?.sellers?.[0]?.sellerId,
      lat,
      long,
      country,
      pickupId,
    }
  })

  if (error || !selectedItem) {
    return null
  }
  const store = !loading && data?.skuPickupSLA ? data.skuPickupSLA : createSlaFromSessionPickup(pickup)
  return (
    <div className={`flex flex-column ${handles.storeSelectedContainer}`}>
      <div className="mh2">
        <div className={`t-body c-muted-2 mv3 ${handles.availabilityHeader}`}>
          <FormattedMessage id="store/pickup-availability.availability-header" />
        </div>
        {!loading ? <StorePickupItem store={store} /> : <ItemLoader />}
      </div>
      <div className={handles.chooseDifferentStoreButton}>
        <Button variation="tertiary" onClick={onChangeStoreClick} size="small">
          <div className={`${handles.chooseDifferentStoreButtonText} t-body nh4`}>
            <FormattedMessage id="store/pickup-availability.choose-different" />
          </div>
        </Button>
      </div>
    </div>
  )
}

export default StoreSelectedQuery
