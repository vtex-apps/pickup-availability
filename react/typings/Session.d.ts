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
