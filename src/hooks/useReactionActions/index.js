import { useDispatch } from 'react-redux'
import { default as reactAction } from 'store/actions/reactOnEntity'
import { default as removeAction } from 'store/actions/removeReactOnEntity'

export default function useReactOnEntity () {
  const dispatch = useDispatch()

  const reactOnEntity = ({ commentId, emojiFull, entityType, postId }) => {
    dispatch(reactAction({ commentId, emojiFull, entityType, postId }))
  }

  const removeReactOnEntity = ({ commentId, emojiFull, entityType, postId }) => {
    dispatch(removeAction({ commentId, emojiFull, entityType, postId }))
  }

  return { reactOnEntity, removeReactOnEntity }
}
