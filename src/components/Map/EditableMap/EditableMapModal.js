import React from 'react'
import { useTranslation } from 'react-i18next'
import { CSSTransition } from 'react-transition-group'
import { bgImageStyle } from 'util/index'
import { DEFAULT_AVATAR, DEFAULT_BANNER } from 'store/models/Group'
import Icon from 'components/Icon'
import RoundImage from 'components/RoundImage'
import classes from './EditableMapModal.module.scss'

const EditableMapModal = (props) => {
  const { group, toggleModal } = props
  const { t } = useTranslation()

  return (
    <CSSTransition
      classNames="editableMapModal"
      appear
      in
      timeout={{ appear: 400, enter: 400, exit: 300 }}
    >
      <div className={classes.editableMapModalWrapper} key="editableMapModal">
        <div className={classes.editableMapModal}>
          <span className={classes.closeButton} onClick={toggleModal}><Icon name="Ex" /></span>
          <div style={bgImageStyle(group?.bannerUrl || DEFAULT_BANNER)} className={classes.banner}>
            <div className={classes.bannerContent}>
              <RoundImage url={group?.avatarUrl || DEFAULT_AVATAR} size="50px" square />
              <h3>{group?.name} {t('Group Shape')}</h3>
            </div>
            <div className={classes.fade} />
          </div>
          <div className={classes.editableMapContent}>
            {props.children}
          </div>
        </div>
      </div>
    </CSSTransition>
  )
}

export default EditableMapModal
