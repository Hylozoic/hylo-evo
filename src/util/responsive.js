import { useMediaQuery } from 'react-responsive'

export const isSmallScreen = () => useMediaQuery({ query: '(max-width: 1005px)' })
