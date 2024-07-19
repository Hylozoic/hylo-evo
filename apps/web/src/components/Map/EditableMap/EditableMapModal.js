import React from 'react'
import { useTranslation } from 'react-i18next'
import { CSSTransition } from 'react-transition-group'
import { bgImageStyle } from 'util/index'
import { DEFAULT_AVATAR, DEFAULT_BANNER } from 'store/models/Group'
import Icon from 'components/Icon'
import RoundImage from 'components/RoundImage'
import './EditableMapModal.scss'

const EditableMapModal = (props) => {
  const { group, toggleModal } = props
  const { t } = useTranslation()

  return (
    <CSSTransition
      classNames='editable-map-modal'
      appear
      in
      timeout={{ appear: 400, enter: 400, exit: 300 }}
    >
      <div styleName='editable-map-modal-wrapper' key='editable-map-modal'>
        <div styleName='editable-map-modal' className='editable-map-modal'>
          <span styleName='close-button' onClick={toggleModal}><Icon name='Ex' /></span>
          <div style={bgImageStyle(group?.bannerUrl || DEFAULT_BANNER)} styleName='banner'>
            <div styleName='banner-content'>
              <RoundImage url={group?.avatarUrl || DEFAULT_AVATAR} size='50px' square />
              <h3>{group?.name} {t('Group Shape')}</h3>
            </div>
            <div styleName='fade' />
          </div>
          <div styleName='editable-map-content'>
            {props.children}
          </div>
        </div>
      </div>
    </CSSTransition>
  )
}

export default EditableMapModal
