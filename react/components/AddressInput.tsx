import React, { Fragment, PureComponent } from 'react'
import { withScriptjs, WithScriptjsProps } from 'react-google-maps'
import { withRuntimeContext, RenderContextProps } from 'vtex.render-runtime'
import ReactGoogleAutocomplete from './ReactGooogleAutocomplete'
import { FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl'

const GEOLOCATION_TIMEOUT = 30 * 1000
const MAXIMUM_AGE = 3 * 1000

const getCurrentPositionPromise = (): Promise<Position> => {
  const geolocationOptions = {
    enableHighAccuracy: true,
    timeout: GEOLOCATION_TIMEOUT,
    maximumAge: MAXIMUM_AGE,
  }
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position: Position) => resolve(position),
      (error: any) => reject(error.code),
      geolocationOptions
    )
  })
}

interface GoogleRequestParams {
  lat: string
  long: string
  googleMapsKey: string
}

const requestGoogleMapsApi = async (params: GoogleRequestParams): Promise<GoogleResponse> => {
  const { lat, long, googleMapsKey } = params
  try {
    const response =
      await fetch(`https://maps.googleapis.com/maps/api/geocode/json?key=${googleMapsKey}&latlng=${lat},${long}`)
    return await response.json()
  } catch (err) {
    return { results: [] }
  }
}

interface GoogleResponse {
  results: Array<{
    formatted_address: string
  }>
}

interface Props {
  onPlaceSelected: (place: google.maps.places.PlaceResult) => void
  onCurrentPositionReceived: (coords: Coords) => void
  googleMapsKey: string
}

interface State {
  isFetchingPosition: boolean
  showError: boolean
  formattedAddress: string | undefined
}

class AddressInput extends PureComponent<Props & WithScriptjsProps & RenderContextProps & InjectedIntlProps, State> {
  state = {
    isFetchingPosition: false,
    showError: false,
    formattedAddress: undefined
  }

  onSuffixPress = async () => {
    const { onCurrentPositionReceived, googleMapsKey } = this.props
    this.setState({ isFetchingPosition: true, showError: false })
    const position = await getCurrentPositionPromise().catch(() => null)
    if (!position) {
      this.setState({ isFetchingPosition: false, showError: true })
      return
    }
    const lat = position.coords.latitude.toString()
    const long = position.coords.longitude.toString()
    onCurrentPositionReceived({
      lat,
      long,
    })

    const googleResponse = await requestGoogleMapsApi({
      googleMapsKey,
      lat,
      long,
    })
    if (googleResponse.results.length > 0) {
      const [closestMatch] = googleResponse.results
      this.setState({ formattedAddress: closestMatch['formatted_address'] })
    }

    this.setState({ isFetchingPosition: false })
  }

  onChange = (e: any) => {
    if (this.state.showError) {
      this.setState({ showError: false })
    }
    this.setState({ formattedAddress: e.target.value })
  }

  render() {
    const {
      runtime: {
        culture: { country },
      },
      onPlaceSelected,
      intl: { formatMessage }
    } = this.props

    return (
      <Fragment>
        <div className="t-body c-on-base mv4">
          <FormattedMessage id="store/pickup-availability.input-form-header" />
        </div>
        <ReactGoogleAutocomplete
          isLoading={false}
          isFetchingPosition={this.state.isFetchingPosition}
          onPlaceSelected={onPlaceSelected}
          onSuffixPress={this.onSuffixPress}
          types={['address']}
          componentRestrictions={{ country }}
          onChange={this.onChange}
          errorMessage={this.state.showError ? formatMessage({ id: 'store/pickup-availability.error-position-message' }) : undefined}
          value={this.state.formattedAddress}
        />
      </Fragment>
    )
  }
}

export default injectIntl(withRuntimeContext(withScriptjs(AddressInput)))