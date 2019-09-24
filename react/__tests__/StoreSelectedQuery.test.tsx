import React from 'react'
import { render, flushPromises } from '@vtex/test-tools/react'
import StoreSelectedQuery from '../components/StoreSelectedQuery'

import { getProduct } from '../__mocks__/productMock'

import ProductContextProvider from '../__mocks__/vtex.product-context/ProductContextProvider'

import logisticsQuery from '../queries/logistics.gql'
import sessionQuery from '../queries/sessionQuery.gql'
import skuPickupSLA from '../queries/skuPickupSLA.gql'

const favoritePickup = {
  cacheId: 'ppbotafogo',
  name: 'Pickup Botafogo',
  address: {
    street: 'Praia de Botafogo',
    number: '300',
    addressId: 'ppbotafogo',
    state: 'RJ',
    country: 'BRA',
    geoCoordinates: [-43, -20],
    postalCode: '2250040',
    complement: '',
    neighborhood: 'Botafogo'
  }
}

const renderComponent = (customProps: any = {}) => {

  const product = customProps.product || getProduct()
  const skuSelector = customProps.skuSelector || { isVisible: false }

  return render(<ProductContextProvider product={product} skuSelector={skuSelector}>
    <StoreSelectedQuery pickup={favoritePickup as any} onChangeStoreClick={() => { }} />
  </ProductContextProvider>, {
    graphql: { mocks: customProps.mocks || [] }
  })
}

test('should render unavailable pickup properly if no sku pickup was found', async () => {
  jest.useFakeTimers()

  const sessionMock = {
    request: {
      query: sessionQuery,
    },
    result: {
      loading: false,
      data: {
        getSession: {
          cacheId: 'a',
          favoritePickup: {
            cacheId: 'ppbotafogo',
            name: 'Pickup Botafogo',
            address: {
              street: 'Praia de Botafogo',
              number: '300',
              addressId: 'ppbotafogo',
              state: 'RJ',
              country: 'BRA',
              geoCoordinates: [-43, -20],
              postalCode: '2250040',
              complement: '',
              neighborhood: 'Botafogo'
            }
          }
        },
      }
    }
  }

  const logisticsMock = {
    request: {
      query: logisticsQuery,
    },
    result: {
      loading: false,
      data: {
        logistics: {
          googleMapsKey: 'aaaaa',
        }
      }
    }
  }

  const skuPickupMock = {
    request: {
      query: skuPickupSLA,
      variables: {
        itemId: '1',
        seller: '1',
        lat: '-20',
        long: '-43',
        country: 'BRA',
        pickupId: 'ppbotafogo'
      }
    },
    result: {
      loading: false,
      data: {
        skuPickupSLA: null,
      }
    }
  }

  const { getByText, debug } = renderComponent({
    mocks: [sessionMock, logisticsMock, skuPickupMock]
  })

  await flushPromises()

  jest.runAllTimers()

  debug()

  expect(getByText(new RegExp(sessionMock.result.data.getSession.favoritePickup.name))).toBeDefined()
  expect(getByText(new RegExp(sessionMock.result.data.getSession.favoritePickup.address.street))).toBeDefined()
  expect(getByText(new RegExp(sessionMock.result.data.getSession.favoritePickup.address.number))).toBeDefined()
  expect(getByText(/Unavailable for pickup/)).toBeDefined()
  expect(getByText(/Choose a different store/)).toBeDefined()
})