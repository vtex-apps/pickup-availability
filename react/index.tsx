import React, { FC, useEffect, useState } from 'react'
import { graphql, DataValue } from 'react-apollo'
import { path } from 'ramda'
import useProduct from 'vtex.product-context/useProduct'

import styles from './components/styles.css'
import logisticsQuery from './queries/logistics.gql'
// import sessionQuery from './queries/sessionQuery.gql'
import ContainerStateSelector from './components/ContainerStateSelector'

type LogisticsResponse = { logistics: { googleMapsKey: string } }
type SessionResponse = { getSession: { favoritePickup: FavoritePickup } }

type LogisticsQuery = DataValue<LogisticsResponse>
type SessionQuery = DataValue<SessionResponse>

interface SessionPickup {
  name: string
  address: SessionAddress
}

interface SessionData {
  error?: any
  response: {
    id: string
    namespaces: {
      public?: {
        favoritePickup?: {
          value: {
            name: string
            address: SessionAddress
          }
        }
      }
    }
  } | undefined
}

const sessionMock = { "id": "8eba9a09-9014-442f-a40e-e37314a1651d", "namespaces": { "account": { "id": { "value": "7b6a2d3d-d59f-47a8-998d-af140fd1a1d0", "keepAlive": true }, "accountName": { "value": "storecomponents" } }, "store": { "channel": { "value": "1" }, "countryCode": { "value": "USA" }, "cultureInfo": { "value": "en-US" }, "currencyCode": { "value": "USD" }, "currencySymbol": { "value": "$" }, "admin_cultureInfo": { "value": "en-US" } }, "public": { "favoritePickup": { "value": { "address": { "addressId": "a", "street": "Praia", "number": "300", "geoCoordinate": [-2, -3] }, "name": "Banana" } } }, "creditControl": { "creditAccounts": { "value": { "accounts": [{ "id": "974CE77D3FAA066F83F2", "availableCredit": 1000 }] } }, "deadlines": { "value": { "deadlines": [{ "paymentOptions": [30] }, { "paymentOptions": [15, 30] }, { "paymentOptions": [30, 60, 90] }] } }, "minimumInstallmentValue": { "value": 0 } }, "profile": { "isAuthenticated": { "value": "true" }, "id": { "value": "19861eff-f05c-4099-90e1-006653e7fc23" }, "email": { "value": "joao.fidelis@vtex.com.br" } }, "authentication": { "storeUserId": { "value": "19861eff-f05c-4099-90e1-006653e7fc23" }, "storeUserEmail": { "value": "joao.fidelis@vtex.com.br" } } } }

interface InjectedProps {
  logisticsQuery: LogisticsQuery
  sessionQuery: SessionQuery
}

const StorePickup: FC<{} & InjectedProps> = ({ logisticsQuery, sessionQuery }) => {
  const { skuSelector } = useProduct()
  const [favoritePickup, setFavoritePickup] = useState<FavoritePickup | undefined>(undefined)

  if (logisticsQuery.loading) {
    return null
  }

  useEffect(() => {
    const sessionPromise = (window as any).__RENDER_8_SESSION__.sessionPromise
    sessionPromise.then((data: SessionData) => {
      const favoritePickupData = path<SessionPickup>(['response', 'namespaces', 'public', 'favoritePickup', 'value'], data)
      if (!favoritePickupData) {
        return
      }
      const { name, address } = favoritePickupData
      const { geoCoordinate, ...rest } = address
      setFavoritePickup({ name, address: { ...rest, geoCoordinates: geoCoordinate } })
    })
  }, [])


  return (
    <div className={styles.container}>
      <ContainerStateSelector
        favoritePickup={favoritePickup}
        showSelectSkuMessage={skuSelector.isVisible && !skuSelector.areAllVariationsSelected}
        googleMapsKey={logisticsQuery.logistics && logisticsQuery.logistics.googleMapsKey}
        selectedAddressId={path<string>(['getSession', 'favoritePickup', 'address', 'addressId'], sessionQuery)}
      />
    </div>
  )
}

export default graphql<any>(logisticsQuery, { name: 'logisticsQuery', options: { ssr: false } })(StorePickup)
