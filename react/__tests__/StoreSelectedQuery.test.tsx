import React from 'react'
import { render, wait, fireEvent } from '@vtex/test-tools/react'
import { MockedProvider } from '@apollo/react-testing'
import StoreSelectedQuery from '../components/StoreSelectedQuery'

import { getProduct } from '../__mocks__/productMock'

import ProductContextProvider from '../__mocks__/vtex.product-context/ProductContextProvider'

import logisticsQuery from '../queries/logistics.gql'
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

const fakeSession = {
  id: 'a',
  namespaces: {
    public: {
      favoritePickup: {
        value: favoritePickup,
      }
    }
  }
}

const noop = () => { }

const renderComponent = (customProps: any = {}) => {

  const product = customProps.product || getProduct()
  const skuSelector = customProps.skuSelector || { isVisible: false }

  const sessionPromise = new Promise(resolve => {
    resolve({ response: customProps.sessionMock || fakeSession })
  })

  global.__RENDER_8_SESSION__ = {
    sessionPromise
  }

  return render(<ProductContextProvider product={product} skuSelector={skuSelector}>
    <StoreSelectedQuery pickup={favoritePickup as any} onChangeStoreClick={customProps.onChangeStoreClick || noop} />
  </ProductContextProvider>, {
    graphql: { mocks: customProps.mocks || [] },
    MockedProvider
  })
}

beforeEach(() => {
  jest.useFakeTimers()
})

test('should render unavailable pickup properly if no sku pickup was found', async () => {
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

  const onChangeStoreClickFn = jest.fn()

  const { getByText } = renderComponent({
    mocks: [logisticsMock, skuPickupMock],
    onChangeStoreClick: onChangeStoreClickFn,
  })

  await wait(() => {
    jest.runAllTimers()
  })

  expect(getByText(new RegExp(fakeSession.namespaces.public.favoritePickup.value.name))).toBeDefined()
  expect(getByText(new RegExp(fakeSession.namespaces.public.favoritePickup.value.address.street))).toBeDefined()
  expect(getByText(new RegExp(fakeSession.namespaces.public.favoritePickup.value.address.number))).toBeDefined()
  expect(getByText(/Unavailable for pickup/)).toBeDefined()

  const button = getByText(/Choose a different store/)
  await wait(() => {
    fireEvent.click(button)
  })
  expect(onChangeStoreClickFn).toBeCalledTimes(1)
})

test('should render item loader when loading is true', async () => {
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

  const { getByTestId, queryByTestId } = renderComponent({
    mocks: [logisticsMock, skuPickupMock],
  })
  getByTestId('item-loader')
  await wait(() => {
    jest.runAllTimers()
  })
  expect(queryByTestId('item-loader')).toBe(null)
})