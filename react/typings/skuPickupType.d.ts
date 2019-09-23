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

interface SkuPickupStore {
  cacheId: string
  id: string
  shippingEstimate: string | null
  pickupStoreInfo: {
    friendlyName: string
    address: CheckoutAddress
  }
}

interface SessionFavoritePickup {
  name: string
  address: CheckoutAddress
}
