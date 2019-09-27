type Actions =
  | { type: 'SET_COORDS'; args: { coords: Coords } }
  | { type: 'PICKUP_CHANGE_REQUEST' }
  | { type: 'PICKUP_CHANGE_DONE' }

type DispatchFn = Dispatch<Actions>

interface Coords {
  lat: string | null
  long: string | null
}

interface ContextState {
  coords: Coords
  pickupChangeLoading: boolean
}
