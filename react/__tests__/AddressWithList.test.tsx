import React from 'react'
import { render, wait } from '@vtex/test-tools/react'
import { MockedProvider } from '@apollo/react-testing'
import AddressWithList from '../components/AddressWithList'

import { getProduct } from '../__mocks__/productMock'

import ProductContextProvider from '../__mocks__/vtex.product-context/ProductContextProvider'

import logisticsQuery from '../queries/logistics.gql'
import skuPickupSLA from '../queries/skuPickupSLA.gql'
import skuPickupSLAs from '../queries/skuPickupSLAs.gql'


let currentAutocomplete: any = null

const event = new Event('place_changed')

class Autcomplete {
  public eventListening: string | null = null
  count = -1

  public addListener(eventName: string, fn: any) {
    currentAutocomplete = this
    this.eventListening = eventName
    window.addEventListener(eventName, fn)
  }

  public getPlace() {
    // Make like this so each dispatched event returns something new
    this.count += 1
    return {
      geometry: {
        location: {
          lat: () => -23 - this.count,
          lng: () => -43 - this.count,
        }
      }
    }
  }
}

jest.mock('react-google-maps', () => {
  return {
    withScriptjs: (WrappedComponent) => props => <WrappedComponent {...props} />
  }
})

beforeEach(() => {
  jest.useFakeTimers()
})

const renderComponent = (customProps: any = {}) => {

  const product = customProps.product || getProduct()
  const skuSelector = customProps.skuSelector || { isVisible: false }

  global.google = {
    maps: {
      places: {
        Autocomplete: Autcomplete,
      }
    }
  }

  return render(<ProductContextProvider product={product} skuSelector={skuSelector}>
    <AddressWithList googleMapsKey={'a'} selectedAddressId={'a'} onPickupChange={() => { }} />
  </ProductContextProvider>, {
    graphql: { mocks: customProps.mocks || [] },
    MockedProvider,
  })
}

test('test place_changed event dispatch triggering and changing coordinas, making store list render pickup list', async () => {
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

  const skuPickupsMockTwo = {
    request: {
      query: skuPickupSLAs,
      variables: {
        itemId: '1',
        seller: '1',
        lat: '-24',
        long: '-44',
        country: 'BRA',
      }
    },
    result: {
      loading: false,
      data: {
        skuPickupSLAs: [{
          id: 'ppgloria',
          shippingEstimate: '30m',
          pickupStoreInfo: {
            friendlyName: 'Pickup Gloria',
            address: {
              cacheId: 'a',
              street: 'Praia de Botafogo',
              number: '131',
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

  const { getByText } = renderComponent({
    mocks: [logisticsMock, skuPickupMock, skuPickupsMock, skuPickupsMockTwo],
  })

  await wait(() => {
    jest.runAllTimers()
  })

  //Dispatch 'place_changed' event
  await wait(() => {
    window.dispatchEvent(event)
  })

  await wait(() => {
    jest.runAllTimers()
  })

  expect(currentAutocomplete.eventListening).toBe('place_changed')

  expect(getByText(new RegExp(skuPickupsMock.result.data.skuPickupSLAs[0].pickupStoreInfo.friendlyName))).toBeDefined()
  expect(getByText(new RegExp(skuPickupsMock.result.data.skuPickupSLAs[0].pickupStoreInfo.address.street))).toBeDefined()
  expect(getByText(new RegExp(skuPickupsMock.result.data.skuPickupSLAs[0].pickupStoreInfo.address.number))).toBeDefined()
  expect(getByText(new RegExp(skuPickupsMock.result.data.skuPickupSLAs[1].pickupStoreInfo.friendlyName))).toBeDefined()
  expect(getByText(new RegExp(skuPickupsMock.result.data.skuPickupSLAs[1].pickupStoreInfo.address.street))).toBeDefined()
  expect(getByText(new RegExp(skuPickupsMock.result.data.skuPickupSLAs[1].pickupStoreInfo.address.number))).toBeDefined()
  expect(getByText(new RegExp(skuPickupsMock.result.data.skuPickupSLAs[2].pickupStoreInfo.friendlyName))).toBeDefined()
  expect(getByText(new RegExp(skuPickupsMock.result.data.skuPickupSLAs[2].pickupStoreInfo.address.street))).toBeDefined()
  expect(getByText(new RegExp(skuPickupsMock.result.data.skuPickupSLAs[2].pickupStoreInfo.address.number))).toBeDefined()


  await wait(() => {
    window.dispatchEvent(event)
  })

  await wait(() => {
    jest.runAllTimers()
  })

  expect(getByText(new RegExp(skuPickupsMockTwo.result.data.skuPickupSLAs[0].pickupStoreInfo.friendlyName))).toBeDefined()
  expect(getByText(new RegExp(skuPickupsMockTwo.result.data.skuPickupSLAs[0].pickupStoreInfo.address.street))).toBeDefined()
  expect(getByText(new RegExp(skuPickupsMockTwo.result.data.skuPickupSLAs[0].pickupStoreInfo.address.number))).toBeDefined()
})