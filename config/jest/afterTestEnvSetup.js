import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

// NOTE: This is what is ran in the jest config from setupTestFrameworkScriptFile / setupFilesAfterEnv (jest v24)
//       It is ran before every test file after the test environment is setup.
//       You Has access to installed test environment, methods like describe, expect and other globals.
//       You can for example add your custom matchers here.

configure({ adapter: new Adapter() })
