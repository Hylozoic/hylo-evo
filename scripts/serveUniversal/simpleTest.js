import Button from 'components/Button'
import { renderToString } from 'react-dom/server'
import React from 'react'
console.log(renderToString(<Button label='Hello world' />))
