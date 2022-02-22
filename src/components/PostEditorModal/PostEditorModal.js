import React, { useState } from 'react'
import { get, omit } from 'lodash/fp'
import { CSSTransition } from 'react-transition-group'
import { useDispatch } from 'react-redux'
import { addQuerystringToPath, baseUrl, postUrl } from 'util/navigation'
import Icon from 'components/Icon'
import PostEditor from 'components/PostEditor'
import { push } from 'connected-react-router'
import getQuerystringParam from 'store/selectors/getQuerystringParam'
import './PostEditorModal.scss'

export default function PostEditorModal (props) {
  const { match, location } = props
  const dispatch = useDispatch()
  const [isDirty, setIsDirty] = useState()

  if (!match) return null

  const routeParams = get('params', match) || {}
  const querystringParams = getQuerystringParam(['s', 't'], null, { location })

  const { postId } = routeParams
  const urlParams = omit(['postId', 'action'], routeParams)
  const closeUrl = postId
    ? postUrl(postId, urlParams, querystringParams)
    : addQuerystringToPath(baseUrl(urlParams), querystringParams)

  const hidePostEditor = () => dispatch(push(closeUrl))

  const handleOnCancel = () => {
    const confirmed = !isDirty || window.confirm('Changes won\'t be saved. Are you sure you want to cancel?')
    if (confirmed) {
      hidePostEditor()
    }
  }

  return <CSSTransition
    classNames='post-editor'
    in
    appear
    timeout={{ appear: 400, enter: 400, exit: 300 }}>
    <div styleName='post-editor-modal' key='post-editor-modal'>
      <div styleName='post-editor-wrapper' className='post-editor-wrapper'>
        <span styleName='close-button' onClick={handleOnCancel}><Icon name='Ex' /></span>
        <PostEditor
          {...props}
          onClose={hidePostEditor}
          onCancel={handleOnCancel}
          setIsDirty={setIsDirty}
        />
      </div>
    </div>
  </CSSTransition>
}
