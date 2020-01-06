import React, { FC } from 'react'
import { render, wait } from '@vtex/test-tools/react'
import { MockedProvider } from '@apollo/react-testing'
import { clone } from 'ramda'
import StoreListQuery from '../components/StoreListQuery'

import { getProduct } from '../__mocks__/productMock'

import ProductContextProvider from '../__mocks__/vtex.product-context/ProductContextProvider'

import logisticsQuery from '../queries/logistics.gql'
import skuPickupSLAs from '../queries/skuPickupSLAs.gql'

const TestComponent: FC<any> = ({ product, skuSelector, coords, selectedAddressId, onPickupChange, dispatch }) => (
  <ProductContextProvider product={product} skuSelector={skuSelector}>
    <StoreListQuery coords={coords} selectedAddressId={selectedAddressId} onPickupChange={onPickupChange} dispatch={dispatch} />
  </ProductContextProvider>
)

const renderComponent = (customProps: any = {}) => {

  const product = customProps.product || getProduct()
  const skuSelector = customProps.skuSelector || { isVisible: false }

  const result = render(<TestComponent product={product} skuSelector={skuSelector} coords={customProps.coords || { lat: '-23', long: '-43' }} selectedAddressId={customProps.selectedAddressId} onPickupChange={() => { }} dispatch={() => { }} />, {
    graphql: { mocks: customProps.mocks || [] },
    MockedProvider
  })

  const { rerender } = result
  const customRerender = (customProps: any) => rerender(<TestComponent product={product} skuSelector={skuSelector} coords={customProps.coords || { lat: '-23', long: '-43' }} selectedAddressId={customProps.selectedAddressId} onPickupChange={() => { }} dispatch={() => { }} />)
  return {
    ...result,
    rerender: customRerender,
  }
}

beforeEach(() => {
  jest.useFakeTimers()
})

test('should render store list properly, do not show see all modal', async () => {
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

  const skuPickupsMock = {
    request: {
      query: skuPickupSLAs,
      variables: {
        itemId: '1',
        seller: '1',
        lat: '-23',
        long: '-43',
        country: 'BRA',
      }
    },
    result: {
      loading: false,
      data: {
        skuPickupSLAs: [{
          id: 'ppbotafogo',
          shippingEstimate: '30m',
          pickupStoreInfo: {
            friendlyName: 'Pickup Botafogo',
            address: {
              cacheId: 'a',
              street: 'Praia de Botafogo',
              number: '300',
              addressId: 'ppbotafogo',
              state: 'RJ',
              country: 'BRA',
              geoCoordinates: [-43, -20],
              postalCode: '2250040',
              complement: '',
              neighborhood: 'Botafogo',
              city: 'Rio de Janeiro'
            }
          }
        },
        {
          id: 'ppipanema',
          shippingEstimate: '30m',
          pickupStoreInfo: {
            friendlyName: 'Pickup Ipanema',
            address: {
              cacheId: 'a',
              street: 'Praia de Ipanema',
              number: '302',
              addressId: 'ppipanema',
              state: 'RJ',
              country: 'BRA',
              geoCoordinates: [-43, -20],
              postalCode: '2250040',
              complement: '',
              neighborhood: 'Ipanema',
              city: 'Rio de Janeiro'
            }
          }
        },
        {
          id: 'ppleblon',
          shippingEstimate: '30m',
          pickupStoreInfo: {
            friendlyName: 'Pickup Leblon',
            address: {
              cacheId: 'a',
              street: 'Praia de Leblon',
              number: '303',
              addressId: 'ppleblon',
              state: 'RJ',
              country: 'BRA',
              geoCoordinates: [-43, -20],
              postalCode: '2250040',
              complement: '',
              neighborhood: 'Leblon',
              city: 'Rio de Janeiro'
            }
          }
        }],
      }
    }
  }

  const { getByText } = renderComponent({
    mocks: [logisticsMock, skuPickupsMock]
  })

  await wait(() => {
    jest.runAllTimers()
  })

  expect(getByText(new RegExp(skuPickupsMock.result.data.skuPickupSLAs[0].pickupStoreInfo.friendlyName))).toBeDefined()
  expect(getByText(new RegExp(skuPickupsMock.result.data.skuPickupSLAs[0].pickupStoreInfo.address.street))).toBeDefined()
  expect(getByText(new RegExp(skuPickupsMock.result.data.skuPickupSLAs[0].pickupStoreInfo.address.number))).toBeDefined()
  expect(getByText(new RegExp(skuPickupsMock.result.data.skuPickupSLAs[1].pickupStoreInfo.friendlyName))).toBeDefined()
  expect(getByText(new RegExp(skuPickupsMock.result.data.skuPickupSLAs[1].pickupStoreInfo.address.street))).toBeDefined()
  expect(getByText(new RegExp(skuPickupsMock.result.data.skuPickupSLAs[1].pickupStoreInfo.address.number))).toBeDefined()
  expect(getByText(new RegExp(skuPickupsMock.result.data.skuPickupSLAs[2].pickupStoreInfo.friendlyName))).toBeDefined()
  expect(getByText(new RegExp(skuPickupsMock.result.data.skuPickupSLAs[2].pickupStoreInfo.address.street))).toBeDefined()
  expect(getByText(new RegExp(skuPickupsMock.result.data.skuPickupSLAs[2].pickupStoreInfo.address.number))).toBeDefined()
})

test('should render store list properly, show top three only and see all button', async () => {
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

  const skuPickupsMock = {
    request: {
      query: skuPickupSLAs,
      variables: {
        itemId: '1',
        seller: '1',
        lat: '-23',
        long: '-43',
        country: 'BRA',
      }
    },
    result: {
      loading: false,
      data: {
        skuPickupSLAs: [{
          id: 'ppbotafogo',
          shippingEstimate: '30m',
          pickupStoreInfo: {
            friendlyName: 'Pickup Botafogo',
            address: {
              cacheId: 'a',
              street: 'Praia de Botafogo',
              number: '300',
              addressId: 'ppbotafogo',
              state: 'RJ',
              country: 'BRA',
              geoCoordinates: [-43, -20],
              postalCode: '2250040',
              complement: '',
              neighborhood: 'Botafogo',
              city: 'Rio de Janeiro'
            }
          }
        },
        {
          id: 'ppipanema',
          shippingEstimate: '30m',
          pickupStoreInfo: {
            friendlyName: 'Pickup Ipanema',
            address: {
              cacheId: 'a',
              street: 'Praia de Ipanema',
              number: '302',
              addressId: 'ppipanema',
              state: 'RJ',
              country: 'BRA',
              geoCoordinates: [-43, -20],
              postalCode: '2250040',
              complement: '',
              neighborhood: 'Ipanema',
              city: 'Rio de Janeiro'
            }
          }
        },
        {
          id: 'ppleblon',
          shippingEstimate: '30m',
          pickupStoreInfo: {
            friendlyName: 'Pickup Leblon',
            address: {
              cacheId: 'a',
              street: 'Praia de Leblon',
              number: '303',
              addressId: 'ppleblon',
              state: 'RJ',
              country: 'BRA',
              geoCoordinates: [-43, -20],
              postalCode: '2250040',
              complement: '',
              neighborhood: 'Leblon',
              city: 'Rio de Janeiro'
            }
          }
        },
        {
          id: 'ppgloria',
          shippingEstimate: '30m',
          pickupStoreInfo: {
            friendlyName: 'Pickup Gloria',
            address: {
              cacheId: 'a',
              street: 'Praia de Gloria',
              number: '304',
              addressId: 'ppgloria',
              state: 'RJ',
              country: 'BRA',
              geoCoordinates: [-43, -20],
              postalCode: '2250040',
              complement: '',
              neighborhood: 'Gloria',
              city: 'Rio de Janeiro'
            }
          }
        }],
      }
    }
  }

  const { queryByText, getByText } = renderComponent({
    mocks: [logisticsMock, skuPickupsMock]
  })

  await wait(() => {
    jest.runAllTimers()
  })

  expect(getByText(new RegExp(skuPickupsMock.result.data.skuPickupSLAs[0].pickupStoreInfo.friendlyName))).toBeDefined()
  expect(getByText(new RegExp(skuPickupsMock.result.data.skuPickupSLAs[0].pickupStoreInfo.address.street))).toBeDefined()
  expect(getByText(new RegExp(skuPickupsMock.result.data.skuPickupSLAs[0].pickupStoreInfo.address.number))).toBeDefined()
  expect(getByText(new RegExp(skuPickupsMock.result.data.skuPickupSLAs[1].pickupStoreInfo.friendlyName))).toBeDefined()
  expect(getByText(new RegExp(skuPickupsMock.result.data.skuPickupSLAs[1].pickupStoreInfo.address.street))).toBeDefined()
  expect(getByText(new RegExp(skuPickupsMock.result.data.skuPickupSLAs[1].pickupStoreInfo.address.number))).toBeDefined()
  expect(getByText(new RegExp(skuPickupsMock.result.data.skuPickupSLAs[2].pickupStoreInfo.friendlyName))).toBeDefined()
  expect(getByText(new RegExp(skuPickupsMock.result.data.skuPickupSLAs[2].pickupStoreInfo.address.street))).toBeDefined()
  expect(getByText(new RegExp(skuPickupsMock.result.data.skuPickupSLAs[2].pickupStoreInfo.address.number))).toBeDefined()

  // Fourth element should not be found
  expect(queryByText(new RegExp(skuPickupsMock.result.data.skuPickupSLAs[3].pickupStoreInfo.friendlyName))).toBeNull()

  //See all stores button should appear
  expect(getByText(/See all stores/)).toBeDefined()
})

test('test that changing coords pased to component reults in a different query and works flawless', async () => {
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

  const skuPickupsMock = {
    request: {
      query: skuPickupSLAs,
      variables: {
        itemId: '1',
        seller: '1',
        lat: '-23',
        long: '-43',
        country: 'BRA',
      }
    },
    result: {
      loading: false,
      data: {
        skuPickupSLAs: [{
          id: 'ppbotafogo',
          shippingEstimate: '30m',
          pickupStoreInfo: {
            friendlyName: 'Pickup Botafogo',
            address: {
              cacheId: 'a',
              street: 'Praia de Botafogo',
              number: '300',
              addressId: 'ppbotafogo',
              state: 'RJ',
              country: 'BRA',
              geoCoordinates: [-43, -20],
              postalCode: '2250040',
              complement: '',
              neighborhood: 'Botafogo',
              city: 'Rio de Janeiro'
            }
          }
        },
        {
          id: 'ppipanema',
          shippingEstimate: '30m',
          pickupStoreInfo: {
            friendlyName: 'Pickup Ipanema',
            address: {
              cacheId: 'a',
              street: 'Praia de Ipanema',
              number: '302',
              addressId: 'ppipanema',
              state: 'RJ',
              country: 'BRA',
              geoCoordinates: [-43, -20],
              postalCode: '2250040',
              complement: '',
              neighborhood: 'Ipanema',
              city: 'Rio de Janeiro'
            }
          }
        },
        {
          id: 'ppleblon',
          shippingEstimate: '30m',
          pickupStoreInfo: {
            friendlyName: 'Pickup Leblon',
            address: {
              cacheId: 'a',
              street: 'Praia de Leblon',
              number: '303',
              addressId: 'ppleblon',
              state: 'RJ',
              country: 'BRA',
              geoCoordinates: [-43, -20],
              postalCode: '2250040',
              complement: '',
              neighborhood: 'Leblon',
              city: 'Rio de Janeiro'
            }
          }
        },
        {
          id: 'ppgloria',
          shippingEstimate: '30m',
          pickupStoreInfo: {
            friendlyName: 'Pickup Gloria',
            address: {
              cacheId: 'a',
              street: 'Praia de Gloria',
              number: '304',
              addressId: 'ppgloria',
              state: 'RJ',
              country: 'BRA',
              geoCoordinates: [-43, -20],
              postalCode: '2250040',
              complement: '',
              neighborhood: 'Gloria',
              city: 'Rio de Janeiro'
            }
          }
        }],
      }
    }
  }

  const skuPickupsMockClone = clone(skuPickupsMock)
  skuPickupsMockClone.request.variables.lat = '-21'
  skuPickupsMockClone.request.variables.long = '-30'
  skuPickupsMockClone.result.data.skuPickupSLAs = [
    {
      id: 'ppleme',
      shippingEstimate: '30m',
      pickupStoreInfo: {
        friendlyName: 'Pickup Leme',
        address: {
          cacheId: 'a',
          street: 'Praia do Leme',
          number: '300',
          addressId: 'ppleme',
          state: 'RJ',
          country: 'BRA',
          geoCoordinates: [-43, -20],
          postalCode: '2250040',
          complement: '',
          neighborhood: 'Leme',
          city: 'Rio de Janeiro'
        }
      }
    }
  ]



  const { getByText, rerender, queryByText } = renderComponent({
    mocks: [logisticsMock, skuPickupsMock, skuPickupsMockClone]
  })

  await wait(() => {
    jest.runAllTimers()
  })

  expect(getByText(new RegExp(skuPickupsMock.result.data.skuPickupSLAs[0].pickupStoreInfo.friendlyName))).toBeDefined()
  expect(getByText(new RegExp(skuPickupsMock.result.data.skuPickupSLAs[0].pickupStoreInfo.address.street))).toBeDefined()
  expect(getByText(new RegExp(skuPickupsMock.result.data.skuPickupSLAs[0].pickupStoreInfo.address.number))).toBeDefined()
  expect(getByText(new RegExp(skuPickupsMock.result.data.skuPickupSLAs[1].pickupStoreInfo.friendlyName))).toBeDefined()
  expect(getByText(new RegExp(skuPickupsMock.result.data.skuPickupSLAs[1].pickupStoreInfo.address.street))).toBeDefined()
  expect(getByText(new RegExp(skuPickupsMock.result.data.skuPickupSLAs[1].pickupStoreInfo.address.number))).toBeDefined()
  expect(getByText(new RegExp(skuPickupsMock.result.data.skuPickupSLAs[2].pickupStoreInfo.friendlyName))).toBeDefined()
  expect(getByText(new RegExp(skuPickupsMock.result.data.skuPickupSLAs[2].pickupStoreInfo.address.street))).toBeDefined()
  expect(getByText(new RegExp(skuPickupsMock.result.data.skuPickupSLAs[2].pickupStoreInfo.address.number))).toBeDefined()

  // Fourth element should not be found
  expect(queryByText(new RegExp(skuPickupsMock.result.data.skuPickupSLAs[3].pickupStoreInfo.friendlyName))).toBeNull()

  //See all stores button should appear
  expect(getByText(/See all stores/)).toBeDefined()

  // Switch props
  rerender({ coords: { lat: '-21', long: '-30' } })

  await wait(() => {
    jest.runAllTimers()
  })

  expect(getByText(new RegExp(skuPickupsMockClone.result.data.skuPickupSLAs[0].pickupStoreInfo.friendlyName))).toBeDefined()
  expect(getByText(new RegExp(skuPickupsMockClone.result.data.skuPickupSLAs[0].pickupStoreInfo.address.street))).toBeDefined()
  expect(getByText(new RegExp(skuPickupsMockClone.result.data.skuPickupSLAs[0].pickupStoreInfo.address.number))).toBeDefined()
  expect(queryByText(/See all stores/)).toBeNull()
})

test('Should render empty list message', async () => {
  jest.useFakeTimers()

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

  const skuPickupsMock = {
    request: {
      query: skuPickupSLAs,
      variables: {
        itemId: '1',
        seller: '1',
        lat: '-23',
        long: '-43',
        country: 'BRA',
      }
    },
    result: {
      loading: false,
      data: {
        skuPickupSLAs: [],
      }
    }
  }

  const { getByText, queryByText } = renderComponent({
    mocks: [logisticsMock, skuPickupsMock]
  })

  await wait(() => {
    jest.runAllTimers()
  })

  expect(getByText(/Could not find pickup locations near specified address/)).toBeDefined()
  expect(queryByText(/See all stores/)).toBeNull()
})

test('ensure loader is appearing when loading is true', async () => {
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

  const skuPickupsMock = {
    request: {
      query: skuPickupSLAs,
      variables: {
        itemId: '1',
        seller: '1',
        lat: '-23',
        long: '-43',
        country: 'BRA',
      }
    },
    result: {
      loading: false,
      data: {
        skuPickupSLAs: [{
          id: 'ppbotafogo',
          shippingEstimate: '30m',
          pickupStoreInfo: {
            friendlyName: 'Pickup Botafogo',
            address: {
              cacheId: 'a',
              street: 'Praia de Botafogo',
              number: '300',
              addressId: 'ppbotafogo',
              state: 'RJ',
              country: 'BRA',
              geoCoordinates: [-43, -20],
              postalCode: '2250040',
              complement: '',
              neighborhood: 'Botafogo',
              city: 'Rio de Janeiro'
            }
          }
        },
        {
          id: 'ppipanema',
          shippingEstimate: '30m',
          pickupStoreInfo: {
            friendlyName: 'Pickup Ipanema',
            address: {
              cacheId: 'a',
              street: 'Praia de Ipanema',
              number: '302',
              addressId: 'ppipanema',
              state: 'RJ',
              country: 'BRA',
              geoCoordinates: [-43, -20],
              postalCode: '2250040',
              complement: '',
              neighborhood: 'Ipanema',
              city: 'Rio de Janeiro'
            }
          }
        },
        {
          id: 'ppleblon',
          shippingEstimate: '30m',
          pickupStoreInfo: {
            friendlyName: 'Pickup Leblon',
            address: {
              cacheId: 'a',
              street: 'Praia de Leblon',
              number: '303',
              addressId: 'ppleblon',
              state: 'RJ',
              country: 'BRA',
              geoCoordinates: [-43, -20],
              postalCode: '2250040',
              complement: '',
              neighborhood: 'Leblon',
              city: 'Rio de Janeiro'
            }
          }
        },
        {
          id: 'ppgloria',
          shippingEstimate: '30m',
          pickupStoreInfo: {
            friendlyName: 'Pickup Gloria',
            address: {
              cacheId: 'a',
              street: 'Praia de Gloria',
              number: '304',
              addressId: 'ppgloria',
              state: 'RJ',
              country: 'BRA',
              geoCoordinates: [-43, -20],
              postalCode: '2250040',
              complement: '',
              neighborhood: 'Gloria',
              city: 'Rio de Janeiro'
            }
          }
        }],
      }
    }
  }

  const { getByTestId, queryByTestId } = renderComponent({
    mocks: [logisticsMock, skuPickupsMock]
  })

  getByTestId('item-loader')

  await wait(() => {
    jest.runAllTimers()
  })

  expect(queryByTestId('item-loader')).toBe(null)
})