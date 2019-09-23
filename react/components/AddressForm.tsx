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

interface Props {
  onPlaceSelected: (place: google.maps.places.PlaceResult) => void
  onCurrentPositionReceived: (coords: Coords) => void
}

interface State {
  isFetchingPosition: boolean
  showError: boolean
}

class AddressForm extends PureComponent<Props & WithScriptjsProps & RenderContextProps & InjectedIntlProps, State> {
  state = {
    isFetchingPosition: false,
    showError: false,
  }

  onSuffixPress = () => {
    const { onCurrentPositionReceived } = this.props
    this.setState({ isFetchingPosition: true, showError: false })
    getCurrentPositionPromise()
      .then(position => {
        this.setState({ isFetchingPosition: false })
        onCurrentPositionReceived({
          lat: position.coords.latitude.toString(),
          long: position.coords.longitude.toString(),
        })
      })
      .catch(() => this.setState({ isFetchingPosition: false, showError: true }))
  }

  onChange = () => {
    if (this.state.showError) {
      this.setState({ showError: false })
    }
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
        />
      </Fragment>
    )
  }
}

export default injectIntl(withRuntimeContext(withScriptjs(AddressForm)))