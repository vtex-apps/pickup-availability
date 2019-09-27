import React, { RefObject } from 'react'
import { Input, Spinner } from 'vtex.styleguide'
import { injectIntl, InjectedIntlProps } from 'react-intl'

import LocationInputIcon from './LocationInputIcon'

/*

Based on: https://github.com/ErrorPro/react-google-autocomplete/blob/master/src/index.js

*/

type AutocompletionRequest = google.maps.places.AutocompletionRequest
interface Props {
  isLoading: boolean
  types?: AutocompletionRequest['types']
  componentRestrictions?: AutocompletionRequest['componentRestrictions']
  bounds?: AutocompletionRequest['bounds']
  onPlaceSelected: (place: google.maps.places.PlaceResult) => void
  value?: string
  errorMessage?: string
  onChange?: (e: any) => void
  onSuffixPress: (e: any) => void
  isFetchingPosition: boolean
}

class ReactGoogleAutocomplete extends React.Component<Props & InjectedIntlProps> {
  input: RefObject<HTMLInputElement>
  autocomplete: google.maps.places.Autocomplete | null
  event: google.maps.MapsEventListener | null

  constructor(props: Props & InjectedIntlProps) {
    super(props)
    this.input = React.createRef()
    this.autocomplete = null
    this.event = null
  }

  componentDidMount() {
    if (!this.props.isLoading) {
      this.setup()
    }
  }

  setup = () => {
    if (!this.input.current) {
      return
    }
    const { types = ['(cities)'], componentRestrictions, bounds } = this.props
    const config = {
      types,
      bounds,
    } as google.maps.places.AutocompleteOptions

    if (componentRestrictions) {
      config.componentRestrictions = componentRestrictions
    }

    this.disableAutofill()

    this.autocomplete = new google.maps.places.Autocomplete(
      this.input.current,
      config
    )

    this.event = this.autocomplete.addListener(
      'place_changed',
      this.onSelected.bind(this)
    )
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.isLoading && !this.props.isLoading) {
      this.setup()
    }
  }

  disableAutofill() {
    // Autofill workaround adapted from https://stackoverflow.com/questions/29931712/chrome-autofill-covers-autocomplete-for-google-maps-api-v3/49161445#49161445
    if ((window as any).MutationObserver) {
      const observerHack = new MutationObserver(() => {
        observerHack.disconnect()
        if (this.input.current) {
          this.input.current.autocomplete = 'disable-autofill'
        }
      })
      if (this.input.current) {
        observerHack.observe(this.input.current, {
          attributes: true,
          attributeFilter: ['autocomplete'],
        })
      }
    }
  }

  componentWillUnmount() {
    this.event && this.event.remove()
  }

  onSelected() {
    if (this.autocomplete && this.props.onPlaceSelected) {
      this.props.onPlaceSelected(this.autocomplete.getPlace())
    }
  }

  render() {
    const {
      value,
      errorMessage,
      onChange,
      onSuffixPress,
      isFetchingPosition,
      intl: { formatMessage }
    } = this.props

    return (
      <Input
        ref={this.input}
        key="input"
        type="text"
        value={value}
        errorMessage={errorMessage}
        placeholder={formatMessage({ id: 'store/pickup-availability.input-placeholder' })}
        size="large"
        onChange={onChange}
        suffix={
          isFetchingPosition ? (
            <Spinner size={16} />
          ) : (
              <LocationInputIcon onClick={onSuffixPress} />
            )
        }
      />
    )
  }
}

export default injectIntl(ReactGoogleAutocomplete)
