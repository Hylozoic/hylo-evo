import cx from 'classnames'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { bgImageStyle } from 'util/index'

import classes from './ModalSidebar.module.scss'

export default function ModalSidebar ({
  theme = {},
  header,
  body,
  onClick,
  secondParagraph,
  imageUrl,
  imageStyle,
  imageDialogOne,
  imageDialogTwo
}) {
  const { t } = useTranslation()

  return <div className={classes.sidebar}>
    <p className={cx(classes.grayText, classes.closeButton)} onClick={onClick}>{t('CLOSE')}</p>
    <p className={cx(theme.sidebarHeader || classes.sidebarHeader)}>{header}</p>
    <p className={cx(theme.sidebarText || classes.grayText, classes.sidebarText)}>{body}</p>
    {secondParagraph && <p className={cx(theme.sidebarText || classes.grayText, classes.sidebarText)}>{secondParagraph}</p>}
    {imageDialogOne && <div className={classes.sidebarDialog}>{imageDialogOne}</div>}
    {imageDialogTwo && <div className={classes.sidebarDialogTwo}>{imageDialogTwo}</div>}
    {imageDialogOne && <div className={classes.dialogLine} />}
    {imageUrl && <div style={bgImageStyle(imageUrl)} className={classes.sidebarImage} />}
  </div>
}
