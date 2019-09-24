import React, { FC } from 'react'
import { graphql, DataValue } from 'react-apollo'
import { compose, path } from 'ramda'
import useProduct from 'vtex.product-context/useProduct'

import logisticsQuery from './queries/logistics.gql'
import sessionQuery from './queries/sessionQuery.gql'
import ContainerStateSelector from './components/ContainerStateSelector'

type LogisticsResponse = { logistics: { googleMapsKey: string } }
type SessionResponse = { getSession: { favoritePickup: SessionFavoritePickup } }

type LogisticsQuery = DataValue<LogisticsResponse>
type SessionQuery = DataValue<SessionResponse>

interface InjectedProps {
  logisticsQuery: LogisticsQuery
  sessionQuery: SessionQuery
}

const StorePickup: FC<{} & InjectedProps> = ({ logisticsQuery, sessionQuery }) => {
  const { skuSelector } = useProduct()

  // console.log('teste oLAAA', logisticsQuery)
  // console.log('teste oLAAA', sessionQuery)

  if (logisticsQuery.loading || sessionQuery.loading) {
    return null
  }

  return (
    <ContainerStateSelector
      favoritePickup={sessionQuery.getSession && sessionQuery.getSession.favoritePickup}
      showSelectSkuMessage={skuSelector.isVisible && !skuSelector.areAllVariationsSelected}
      googleMapsKey={logisticsQuery.logistics && logisticsQuery.logistics.googleMapsKey}
      selectedAddressId={path<string>(['getSession', 'favoritePickup', 'address', 'addressId'], sessionQuery)}
    />
  )
}

const enhance = compose(
  graphql<any>(logisticsQuery, { name: 'logisticsQuery', options: { ssr: false } }),
  graphql<any>(sessionQuery, { name: 'sessionQuery', options: { ssr: false } }),
)

export default enhance(StorePickup)
