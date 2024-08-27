import React, { useState } from 'react'
import cx from 'classnames'
import './MultiSelect.scss'
import { useTranslation } from 'react-i18next'

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
        styleName={cx('item', { selected: selected.includes(item.id) })}
      >
        <span>{item.text || item.title}</span>
        {handleSelect && (
          <input
            type='checkbox'
            checked={selected.includes(item.id)}
          />
        )}
      </div>
    ))
  }

  return (
    <ul styleName='multi-select'>
      {renderItems()}
      {hideAfter && items.length > hideAfter && !showAll && (
        <div styleName='show-more' onClick={handleShowMore}>
          <span>{t('Show more')}</span>
        </div>
      )}
    </ul>
  )
}

export default MultiSelect
