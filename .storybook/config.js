import { configure, addDecorator } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'

const req = require.context("../src", true, /.(stories).(tsx|ts|js|jsx)$/)
function loadStories() {
  req.keys().forEach(filename => req(filename))
}

// * would be really nice if this showed-up in the addOns viewport
// https://github.com/storybooks/storybook/issues/1147
addDecorator(
  withInfo({
    header: false // Global configuration for the info addon across all of your stories.
  })
)

configure(loadStories, module);
