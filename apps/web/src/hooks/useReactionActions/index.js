import { useDispatch } from 'react-redux'
import reactAction from 'store/actions/reactOnEntity'
import removeAction from 'store/actions/removeReactOnEntity'

export default function useReactOnEntity () {
  const dispatch = useDispatch()

  const reactOnEntity = ({ commentId, emojiFull, entityType, postId, groupIds }) => {
    dispatch(reactAction({ commentId, emojiFull, entityType, postId, groupIds }))
  }

  const removeReactOnEntity = ({ commentId, emojiFull, entityType, postId }) => {
    dispatch(removeAction({ commentId, emojiFull, entityType, postId }))
  }

  return { reactOnEntity, removeReactOnEntity }
}
