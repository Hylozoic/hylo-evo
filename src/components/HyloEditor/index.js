import CSSModules from 'react-css-modules'
import component from './component'
import connector from './connector'
import styles from './component.scss'

export const stylesWrap = CSSModules(styles, {allowMultiple: true})

export default stylesWrap(connector(component))
