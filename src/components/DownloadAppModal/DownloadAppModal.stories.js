import React from 'react'
import { storiesOf } from '@storybook/react'
import DownloadAppModal from './DownloadAppModal'

storiesOf('DownloadAppModal', module)
  .add('basic', () => (
    <DownloadAppModal url='https://google.com' returnToURL='' />
  ))
