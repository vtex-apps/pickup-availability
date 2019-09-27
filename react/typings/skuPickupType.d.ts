interface CheckoutAddress {
  street: string
  number: string
  addressId: string
  complement: string
  country: string
  geoCoordinates: [number, number]
  neighborhood: string
  postalCode: string
  state: string
  city: string
}

type SessionAddress = Omit<CheckoutAddress, 'geoCoordinates'> & {
  geoCoordinate: [number, number]
}

interface SkuPickupStore {
  cacheId: string
  id: string
  shippingEstimate: string | null
  pickupStoreInfo: {
    friendlyName: string
    address: CheckoutAddress
  }
}

interface FavoritePickup {
  name: string
  address: CheckoutAddress
}
