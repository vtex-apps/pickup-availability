import React, { FC } from 'react'
import { graphql, DataValue } from 'react-apollo'
import useProduct from 'vtex.product-context/useProduct'

import styles from './components/styles.css'
import logisticsQuery from './queries/logistics.gql'
import ContainerStateSelector from './components/ContainerStateSelector'

type LogisticsResponse = { logistics: { googleMapsKey: string } }

type LogisticsQuery = DataValue<LogisticsResponse>

interface InjectedProps {
  logisticsQuery: LogisticsQuery
}

const StorePickup: FC<{} & InjectedProps> = ({ logisticsQuery }) => {
  const { skuSelector } = useProduct()

  if (logisticsQuery.loading) {
    return null
  }

  return (
    <div className={styles.container}>
      <ContainerStateSelector
        showSelectSkuMessage={skuSelector.isVisible && !skuSelector.areAllVariationsSelected}
        googleMapsKey={logisticsQuery.logistics && logisticsQuery.logistics.googleMapsKey}
      />
    </div>
  )
}

export default graphql<any>(logisticsQuery, { name: 'logisticsQuery', options: { ssr: false } })(StorePickup)
