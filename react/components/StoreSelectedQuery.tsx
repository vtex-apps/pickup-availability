import React, { FC } from 'react'
import { Query } from 'react-apollo'
import useProduct from 'vtex.product-context/useProduct'
import { Button } from 'vtex.styleguide'

import skuPickupSLA from '../queries/skuPickupSLA.gql'
import StorePickupItem from './StorePickupItem'
import { FormattedMessage } from 'react-intl'
import ItemLoader from './Loaders/ItemLoader'

interface SkuPickupSLAData {
  skuPickupSLA: SkuPickupStore
}

interface Variables {
  itemId: string
  seller: string
  lat: string
  long: string
  country: string
  pickupId: string
}

interface Props {
  pickup: SessionFavoritePickup
  onChangeStoreClick: () => void
}

const getVariablesFromSessionPickup = (pickup: SessionFavoritePickup) => {
  const { geoCoordinates, country, addressId } = pickup.address
  const [long, lat] = geoCoordinates
  return {
    long: long.toString(),
    lat: lat.toString(),
    country: country,
    pickupId: addressId
  }
}

const createSlaFromSessionPickup = (pickup: SessionFavoritePickup) => {
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

  if (!selectedItem) {
    return null
  }
  console.log('VARS: ', {
    itemId: selectedItem.itemId,
    seller: selectedItem.sellers[0].sellerId,
    lat,
    long,
    country,
    pickupId,
  })
  return (
    <Query<SkuPickupSLAData, Variables>
      query={skuPickupSLA}
      key={selectedItem.itemId}
      variables={{
        itemId: selectedItem.itemId,
        seller: selectedItem.sellers[0].sellerId,
        lat,
        long,
        country,
        pickupId,
      }}
      ssr={false}
    >
      {({ error, data, loading }) => {
        // console.log('teste OIEEE, ', data)
        if (error || !data) {
          return null
        }

        // console.log(data.skuPickupSLA)
        console.log(data)
        const store = data.skuPickupSLA ? data.skuPickupSLA : createSlaFromSessionPickup(pickup)
        return (
          <div className="flex flex-column">
            <div className="mh2">
              <div className="t-body c-muted-2 mv3">
                <FormattedMessage id="store/pickup-availability.availability-header" />
              </div>
              {!loading ? <StorePickupItem store={store} /> : <ItemLoader />}
            </div>
            <div>
              <Button variation="tertiary" onClick={onChangeStoreClick} size="small">
                <div className="t-body nh4">
                  <FormattedMessage id="store/pickup-availability.choose-different" />
                </div>
              </Button>
            </div>
          </div>
        )
      }}
    </Query>
  )
}

export default StoreSelectedQuery

// import React, { FC } from 'react'
// import { Query, graphql } from 'react-apollo'
// import useProduct from 'vtex.product-context/useProduct'
// import { Button } from 'vtex.styleguide'

// import skuPickupSLA from '../queries/skuPickupSLA.gql'
// import StorePickupItem from './StorePickupItem'
// import { FormattedMessage } from 'react-intl'
// import ItemLoader from './Loaders/ItemLoader'

// interface SkuPickupSLAData {
//   skuPickupSLA: SkuPickupStore
// }

// interface Variables {
//   itemId: string
//   seller: string
//   lat: string
//   long: string
//   country: string
//   pickupId: string
// }

// interface Props {
//   pickup: SessionFavoritePickup
//   onChangeStoreClick: () => void
// }

// const getVariablesFromSessionPickup = (pickup: SessionFavoritePickup) => {
//   const { geoCoordinates, country, addressId } = pickup.address
//   const [long, lat] = geoCoordinates
//   return {
//     long: long.toString(),
//     lat: lat.toString(),
//     country: country,
//     pickupId: addressId
//   }
// }

// const createSlaFromSessionPickup = (pickup: SessionFavoritePickup) => {
//   return {
//     cacheId: pickup.address.addressId,
//     id: pickup.address.addressId,
//     shippingEstimate: null,
//     pickupStoreInfo: {
//       friendlyName: pickup.name,
//       address: pickup.address,
//     }
//   }
// }

// const StoreSelectedQuery: FC<any> = ({ skuPickupSLA }) => {
//   console.log('teste skuPickupSLA: ', skuPickupSLA)
//   return <div>oi</div>
// }

// export default graphql<any>(skuPickupSLA, {
//   name: 'skuPickupSLA', options: {
//     ssr: false, variables: {
//       itemId: '50',
//       seller: '1',
//       lat: '-23',
//       long: '-43',
//       country: 'BRA',
//       pickupId: 'a',
//     }
//   }
// })(StoreSelectedQuery)

// const StoreSelectedQuery: FC<Props> = ({ pickup, onChangeStoreClick }) => {
//   const { selectedItem } = useProduct()
//   const { long, lat, country, pickupId } = getVariablesFromSessionPickup(pickup)

//   if (!selectedItem) {
//     return null
//   }

//   return (
//     <Query<SkuPickupSLAData, Variables>
//       query={skuPickupSLA}
//       key={selectedItem.itemId}
//       variables={{
//         itemId: selectedItem.itemId,
//         seller: selectedItem.sellers[0].sellerId,
//         lat,
//         long,
//         country,
//         pickupId,
//       }}
//       ssr={false}
//     >
//       {({ error, data, loading }) => {
//         console.log('teste OIEEE, ', data)
//         if (error || !data) {
//           return null
//         }
//         const store = data.skuPickupSLA ? data.skuPickupSLA : createSlaFromSessionPickup(pickup)
//         return (
//           <div className="flex flex-column">
//             <div className="mh2">
//               <div className="t-body c-muted-2 mv3">
//                 <FormattedMessage id="store/pickup-availability.availability-header" />
//               </div>
//               {!loading ? <StorePickupItem store={store} /> : <ItemLoader />}
//             </div>
//             <div>
//               <Button variation="tertiary" onClick={onChangeStoreClick} size="small">
//                 <div className="t-body nh4">
//                   <FormattedMessage id="store/pickup-availability.choose-different" />
//                 </div>
//               </Button>
//             </div>
//           </div>
//         )
//       }}
//     </Query>
//   )
// }

// export default StoreSelectedQuery
