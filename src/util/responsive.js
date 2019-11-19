import { useMediaQuery } from 'react-responsive'

export const isMediumScreen = () => useMediaQuery({ query: '(max-width: 1050px)' })
export const isSmallScreen = () => useMediaQuery({ query: '(max-width: 800px)' })
