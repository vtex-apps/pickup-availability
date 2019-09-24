import React, { FC, useState, Fragment } from 'react'
import { Button } from 'vtex.styleguide'
import { IconClose } from 'vtex.store-icons'
import { Overlay } from 'vtex.react-portal'
import { useDevice } from 'vtex.device-detector'

import StoreList from './StoreList'
import { FormattedMessage } from 'react-intl'

import styles from './styles.css'

const noop = (e: any) => { e.stopPropagation() }

interface Props {
  stores: SkuPickupStore[]
  selectedAddressId: string | undefined
  onPickupChange: () => void
  dispatch: DispatchFn
}

const SeeAllStoresModal: FC<Props> = ({ stores, selectedAddressId, onPickupChange, dispatch }) => {
  const [isModalOpen, setModalOpen] = useState(false)
  const { isMobile } = useDevice()
  if (stores.length <= 3) {
    return null
  }

  if (!isModalOpen) {
    return (
      <div className={styles.seeAllModalButton}>
        <Button onClick={() => setModalOpen(true)} variation="tertiary">
          <div className="t-body">
            <FormattedMessage id="store/pickup-availability.see-all" />
          </div>
        </Button>
      </div>
    )
  }

  const closeModal = () => setModalOpen(false)

  return (
    <Overlay>
      {
        <Fragment>
          <div className="fixed top-0 left-0 w-100 h-100 bg-black-20" />
          <div
            className="fixed top-0 left-0 w-100 h-100 flex items-center justify-center"
            onClick={closeModal}
          >
            <div
              className={`w-100 h-100 items-center justify-center overflow-y-auto bg-base ${styles.modalContainer}`}
              style={!isMobile ? { maxHeight: '80vh', maxWidth: '90vw', height: 'auto', width: 'auto' } : {}}
              onClick={noop}
            >
              <div className={`flex justify-between items-center ph4 pv5 sticky top-0 bg-base z-999 ${styles.modalHeader}`}>
                <div className="t-body c-muted-2">
                  <FormattedMessage id="store/pickup-availability.select-store" />
                </div>
                <div className={`mh4 pointer h-100 justify-center items-center ${styles.modalCloseIcon}`} onClick={closeModal}>
                  <IconClose size={20} type="line" />
                </div>
              </div>
              <div className={styles.modalStoreList}>
                <StoreList
                  stores={stores}
                  selectedAddressId={selectedAddressId}
                  onPressPickup={closeModal}
                  onPickupChange={onPickupChange}
                  dispatch={dispatch}
                />
              </div>
            </div>
          </div>
        </Fragment>
      }
    </Overlay>
  )
}

export default SeeAllStoresModal