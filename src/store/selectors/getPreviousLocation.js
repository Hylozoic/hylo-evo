import { get } from 'lodash/fp'

export default (state) => get('locationHistory.previousLocation', state) || { pathname: '/' }
