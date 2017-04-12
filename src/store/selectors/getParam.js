import { curry } from 'lodash'

const getParam = curry((key, state, props) =>
  props.match.params[key])

export default getParam
