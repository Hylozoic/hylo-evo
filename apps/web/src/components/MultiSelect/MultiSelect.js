import cx from 'classnames'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import classes from './MultiSelect.module.scss'

const MultiSelect = ({ items, selected = [], hideAfter, handleSelect }) => {
  const { t } = useTranslation()
  const [showAll, setShowAll] = useState(false)

  const handleShowMore = () => {
    setShowAll(true)
  }

  const renderItems = () => {
    const itemsToRender = showAll || !hideAfter || items.length <= hideAfter
      ? items
      : items.slice(0, hideAfter)

    return itemsToRender.map((item, i) => (
      <div
        onClick={(evt) => {
          evt.stopPropagation()
          handleSelect && handleSelect(item.id)
        }}
        key={item.id}
        className={cx(classes.item, { [classes.selected]: selected.includes(item.id) })}
      >
        <span>{item.text || item.title}</span>
        {handleSelect && (
          <input
            type='checkbox'
            checked={selected.includes(item.id)}
            readOnly
          />
        )}
      </div>
    ))
  }

  return (
    <ul className={classes.multiSelect}>
      {renderItems()}
      {hideAfter && items.length > hideAfter && !showAll && (
        <div className={classes.showMore} onClick={handleShowMore}>
          <span>{t('Show more')}</span>
        </div>
      )}
    </ul>
  )
}

export default MultiSelect
