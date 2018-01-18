/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = finalWarning;
/* unused harmony export getValue */
/* unused harmony export hitEnter */
/* harmony export (immutable) */ __webpack_exports__["a"] = fatalErrorMsg;
/* harmony export (immutable) */ __webpack_exports__["c"] = oneTo;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_readline__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_readline___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_readline__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_stream__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_stream___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_stream__);
/* global API_URI, GRAPHQL_URI */




const iface = (out) => __WEBPACK_IMPORTED_MODULE_0_readline___default.a.createInterface({
  input: process.stdin,
  output: out || process.stdout,
  terminal: true
})

function finalWarning (message) {
  return new Promise(resolve => {
    const rl = iface()
    rl.question(
      message,
      answer => {
        if (answer !== 'yes') {
          console.log('\nExiting.')
          process.exit()
        }
        console.log('\n  Ok, you asked for it...')
        rl.close()
        resolve()
      })
  })
}

function getValue (message, muted) {
  return new Promise(resolve => {
    const out = new __WEBPACK_IMPORTED_MODULE_1_stream__["Writable"]({
      write: function (chunk, encoding, callback) {
        if (!this.muted) {
          process.stdout.write(chunk, encoding)
        }
        callback()
      }
    })
    if (muted) {
      process.stdout.write(message)
      out.muted = true
    }

    const rl = iface(out)
    rl.question(message, answer => {
      rl.close()
      resolve(answer)
    })
  })
}

function hitEnter (message) {
  return new Promise(resolve => {
    const rl = iface()
    rl.question(message, () => {
      rl.close()
      resolve()
    })
  })
}

function fatalErrorMsg ({ message }) {
  return console.error(`
  The seeder encountered an error it didn't know how to handle. Sorry! If you're
  curious, the message was:

    ${message}
`)
}

function oneTo (n) {
  return Math.floor(Math.random() * n + 1)
}


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(2);


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_minimist__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_minimist___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_minimist__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__seeder__ = __webpack_require__(6);
// Populate a development database with faked data using the same GraphQL the client uses.
//
// Motivation: our previous seed script... kind of worked, but quickly became out of date
// and had a number of edge cases where it didn't quite behave like the live data. This
// led to using client data in development, and staging, which isn't ideal from a privacy
// or security standpoint.
//
// The intent here is to provide something which uses the same function calls we use, so
// should continue to be relevant for longer. Likewise, we should not be afraid to throw
// away our previous development db, so that means we need something that is easy to
// recreate at the drop of the hat, and add to as we add more features.
//
// This is mostly just the launcher. Entities (networks, communities, users) are created
// using the named files in the `seeder` directory. These can be modified or extended as
// required. The seeder will run 'em all in the order specified.




(async function seed () {
  // Please don't run this in production. It's not nice.
  if (process.env.NODE_ENV === 'production') {
    console.log(' !!! Do NOT run this in production! This will completely trash your prod database. !!!')
    process.exit(1)
  }

  // Next, let's grab a few command line arguments (mostly a placeholder in case we want
  // to get clever later.
  const argv = __WEBPACK_IMPORTED_MODULE_0_minimist___default()(process.argv, {
    alias: {
      '?': 'help'
    },
    string: [
      'help'
    ]
  })

  const WARNING = `
  This is the Hylo seeder. It grows fake databases using Hylo client functions
  to simulate user activity. Please use it with caution.
    
  Note that it requires the Hylo backend to be up and running.`
  const EXTRA_EXTRA_WARNING = `
  *WARNING*: This is mostly an ADDITIVE seeder, in that it won't truncate tables
  or anything like that. It will however issue several thousand API requests via
  headless Chrome. If you're sure that's what you want, type 'yes'. Anything
  else will result in this script terminating.

    : `

  const action = argv._[2]
  switch (action) {
    case 'help':
    case '?':
      console.log(`${WARNING}

        Usage
        $ yarn run seed
        `)
      break

    default:
      console.log(WARNING)
      await Object(__WEBPACK_IMPORTED_MODULE_1__util__["b" /* finalWarning */])(EXTRA_EXTRA_WARNING)
      Object(__WEBPACK_IMPORTED_MODULE_2__seeder__["a" /* default */])()
  }
})()


/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("minimist");

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("readline");

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("stream");

/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = seeder;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_puppeteer__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_puppeteer___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_puppeteer__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__users__ = __webpack_require__(8);





// const networks = require('./networks')
// const communities = require('./communities')
// const posts = require('./posts')

const ADMIN_LOGIN_MESSAGE = `
  This script requires an admin login. Any Hylo developer should have one of
  these: you just need an @hylo.com email. The script delivers your password
  to the server using headless Chrome and then should be promptly GC'd out of
  existence. It doesn't get cached or written anywhere.

  (The admin login is completely separate to Hylo user accounts, so we can do
  it without a single user in the database which is handy.)
`
const BE_PATIENT = `
  This will take awhile (API requests issued sequentially). If you're not sure
  if everything is still working, you can always check the backend log output
  in its terminal window.
`

async function seeder () {
  // First, we need an admin login.
  // console.log(ADMIN_LOGIN_MESSAGE)
  // const email = await getValue('    Hylo email: ')
  // const password = await getValue('    Password: ', true)
  // process.stdout.write('\n\n  Authenticating you with Google...')
  //
  let browser
  let page

  try {
    browser = await __WEBPACK_IMPORTED_MODULE_0_puppeteer___default.a.launch({
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox'
      ],
      headless: false
    })
    page = await browser.newPage()
    await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3264.0 Safari/537.36')

    // Google auth
    // await page.goto('http://localhost:3001/noo/admin/login')
    // await page.waitForNavigation()
    // await page.keyboard.type(email)
    // await page.click('#identifierNext')
    //
    // If you're having difficulties logging in, try increasing this from 2s
    // await page.waitFor(2 * 1000)
    //
    // await page.keyboard.type(password)
    // await page.click('#passwordNext')
    // await page.waitForNavigation()
    //
    // Great, now we should be authenticated. We can start sending POST requests
    // to the GraphQL endpoint.
    // process.stdout.write(' ✓')

    process.stdout.write(`\n  ${BE_PATIENT}`)
    await Object(__WEBPACK_IMPORTED_MODULE_2__users__["a" /* default */])(page)

    await page.close()
    await browser.close()
  } catch (e) {
    if (page) await page.close()
    if (browser) await browser.close()
    Object(__WEBPACK_IMPORTED_MODULE_1__util__["a" /* fatalErrorMsg */])(e)
  }
}


/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("puppeteer");

/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = users;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_faker__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_faker___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_faker__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash_fp__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash_fp___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_lodash_fp__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__api__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__util__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_routes_Signup_AddSkills_AddSkills_store__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_routes_Signup_AddSkills_AddSkills_store___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_routes_Signup_AddSkills_AddSkills_store__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_routes_CreateCommunity_Review_Review_store__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_routes_CreateCommunity_Review_Review_store___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_routes_CreateCommunity_Review_Review_store__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_store_actions_updateUserSettings__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_store_actions_updateUserSettings___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_store_actions_updateUserSettings__);
/* global USER_COUNT, USER_COMMUNITY_CHANCE */











const fakeUser = () => {
  const community = __WEBPACK_IMPORTED_MODULE_0_faker___default.a.random.words()

  return {
    avatarUrl: __WEBPACK_IMPORTED_MODULE_0_faker___default.a.internet.avatar(),
    bannerUrl: __WEBPACK_IMPORTED_MODULE_0_faker___default.a.image.imageUrl(),
    bio: __WEBPACK_IMPORTED_MODULE_0_faker___default.a.lorem.paragraph(),
    community: { name: community, slug: __WEBPACK_IMPORTED_MODULE_0_faker___default.a.helpers.slugify(community) },

    // Faker's email function tends to duplicate in the 1000's, hence unique.
    email: __WEBPACK_IMPORTED_MODULE_0_faker___default.a.unique(__WEBPACK_IMPORTED_MODULE_0_faker___default.a.internet.email),

    facebookUrl: __WEBPACK_IMPORTED_MODULE_0_faker___default.a.internet.url(),
    linkedinUrl: __WEBPACK_IMPORTED_MODULE_0_faker___default.a.internet.url(),
    location: __WEBPACK_IMPORTED_MODULE_0_faker___default.a.address.country(),
    login: true,
    name: `${__WEBPACK_IMPORTED_MODULE_0_faker___default.a.name.firstName()} ${__WEBPACK_IMPORTED_MODULE_0_faker___default.a.name.lastName()}`,
    password: 'hylo',
    settings: { signupInProgress: false },
    skills: [ ...new Array(Object(__WEBPACK_IMPORTED_MODULE_3__util__["c" /* oneTo */])(5)) ].map(__WEBPACK_IMPORTED_MODULE_0_faker___default.a.hacker.ingverb),
    twitterName: __WEBPACK_IMPORTED_MODULE_0_faker___default.a.internet.userName(),
    work: __WEBPACK_IMPORTED_MODULE_0_faker___default.a.lorem.paragraph(),
    url: __WEBPACK_IMPORTED_MODULE_0_faker___default.a.internet.url()
  }
}

async function users (page) {
  process.stdout.write(`\n  Creating ${10} users...`)
  const api = Object(__WEBPACK_IMPORTED_MODULE_2__api__["a" /* default */])(page)

  // At time of writing, /noo/user is essentially an unprotected POST route.
  // We're exploiting this here, but should probably change that... this bit
  // doesn't actually need admin login at all.
  const userBatch = [
    {
      name: 'Test User',
      community: { name: 'Test Community', slug: 'test-community' },
      email: 'test@hylo.com',
      login: true,
      password: 'hylo',
      settings: { signupInProgress: false }
    },
    ...Object(__WEBPACK_IMPORTED_MODULE_1_lodash_fp__["times"])(fakeUser, 10)
  ]

  for (let user of userBatch) {
    process.stdout.write('\n  Creating user and logging in, ')
    await api.request('/noo/user', user)

    process.stdout.write('faking their data, ')
    const fields = Object(__WEBPACK_IMPORTED_MODULE_1_lodash_fp__["pick"])([
      'avatarUrl',
      'bannerUrl',
      'bio',
      'facebookUrl',
      'firstName',
      'linkedinUrl',
      'location',
      'settings',
      'twitterName',
      'url'
    ], user)
    const person = await api.graphql(Object(__WEBPACK_IMPORTED_MODULE_6_store_actions_updateUserSettings__["updateUserSettings"])(fields))
    user.id = person.data.updateMe.id

    process.stdout.write('adding skills, ')
    for (let skill of user.skills || []) {
      await api.graphql(Object(__WEBPACK_IMPORTED_MODULE_4_routes_Signup_AddSkills_AddSkills_store__["addSkill"])(skill))
    }

    if (Math.random() < 0.3 || user.email.endsWith('@hylo.com')) {
      process.stdout.write('creating community, ')
      await api.graphql(Object(__WEBPACK_IMPORTED_MODULE_5_routes_CreateCommunity_Review_Review_store__["createCommunity"])(user.community.name, user.community.slug))
    }

    process.stdout.write('and logging out.')
    await api.logout()
  }

  // Now we need to update the rest. Relevant files:
  //  - Signup/AddSkills/AddSkills.store
  //  - store/updateUserSettings
  // for (let user of userBatch) {
  //   const fields = pick([
  //     'avatarUrl',
  //     'bannerUrl',
  //     'bio',
  //     'extraInfo',
  //     'facebookUrl',
  //     'firstName',
  //     'intention',
  //     'linkedinUrl',
  //     'location',
  //     'twitterName',
  //     'work',
  //     'url'
  //   ], user)
  //   const encodedQuery = encodeUriComponent(updateUserSettings(
  //   query(
  // }
  //
  return userBatch
}


/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = require("faker");

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = require("lodash/fp");

/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* global API_URI, GRAPHQL_URI */

const api = page => ({
  async apiRequest (uri, payload) {
    await page.setRequestInterception(true)
    page.once('request', request =>
      request.continue({
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        postData: JSON.stringify(payload)
      })
    )
    const res = await page.goto(uri)
    await page.setRequestInterception(false)
    return JSON.parse(await res.text())
  },

  async graphql (action) {
    return this.apiRequest('http://localhost:3001/noo/graphql', action.graphql)
  },

  async logout () {
    return page.goto(`${'http://localhost:3001'}/noo/logout`)
  },

  async request (endpoint, json) {
    return this.apiRequest(`${'http://localhost:3001'}${endpoint}`, json)
  }
})

/* harmony default export */ __webpack_exports__["a"] = (api);


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addSkill = addSkill;
exports.removeSkill = removeSkill;
var MODULE_NAME = exports.MODULE_NAME = "AddSkills";
var SIGNUP_ADD_SKILL = exports.SIGNUP_ADD_SKILL = MODULE_NAME + "/SIGNUP_ADD_SKILL";
var SIGNUP_REMOVE_SKILL = exports.SIGNUP_REMOVE_SKILL = MODULE_NAME + "/SIGNUP_REMOVE_SKILL";
var SIGNUP_REMOVE_SKILL_PENDING = exports.SIGNUP_REMOVE_SKILL_PENDING = SIGNUP_REMOVE_SKILL + "_PENDING";

function addSkill(skillName) {
  return {
    type: SIGNUP_ADD_SKILL,
    graphql: {
      query: "mutation ($name: String) {\n        addSkill(name: $name) {\n          id,\n          name\n        }\n      }",
      variables: {
        name: skillName
      }
    },
    meta: {
      optimistic: true,
      skillName: skillName
    }
  };
}

function removeSkill(skillId) {
  return {
    type: SIGNUP_REMOVE_SKILL,
    graphql: {
      query: "mutation ($id: ID) {\n        removeSkill(id: $id) {\n          success\n        }\n      }",
      variables: {
        id: skillId
      }
    },
    meta: {
      optimistic: true,
      skillId: skillId
    }
  };
}

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createCommunity = createCommunity;
var MODULE_NAME = exports.MODULE_NAME = 'Review';
var CREATE_COMMUNITY = exports.CREATE_COMMUNITY = MODULE_NAME + '/CREATE_COMMUNITY';

function createCommunity(name, slug) {
  return {
    type: CREATE_COMMUNITY,
    graphql: {
      query: 'mutation ($data: CommunityInput) {\n        createCommunity(data: $data) {\n          id\n          hasModeratorRole\n          community {\n            id\n            name\n            slug\n          }\n        }\n      }\n      ',
      variables: {
        data: {
          name: name,
          slug: slug
        }
      }
    },
    meta: {
      extractModel: 'Membership',
      slug: slug,
      name: name
    }
  };
}

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateUserSettings = updateUserSettings;

var _constants = __webpack_require__(15);

function updateUserSettings(changes) {
  return {
    type: _constants.UPDATE_USER_SETTINGS,
    graphql: {
      query: 'mutation ($changes: MeInput) {\n        updateMe(changes: $changes) {\n          id\n        }\n      }',
      variables: {
        changes: changes
      }
    },
    meta: {
      optimistic: true,
      changes: changes
    }
  };
}

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var _PENDING = exports._PENDING = '_PENDING';

var ADD_USER_TYPING = exports.ADD_USER_TYPING = 'ADD_USER_TYPING';
var ADD_MODERATOR = exports.ADD_MODERATOR = 'ADD_MODERATOR';
var ADD_MODERATOR_PENDING = exports.ADD_MODERATOR_PENDING = ADD_MODERATOR + _PENDING;
var CHECK_LOGIN = exports.CHECK_LOGIN = 'CHECK_LOGIN';
var CLEAR_USER_TYPING = exports.CLEAR_USER_TYPING = 'CLEAR_USER_TYPING';
var CLEAR_MODERATOR_SUGGESTIONS = exports.CLEAR_MODERATOR_SUGGESTIONS = 'CLEAR_MODERATOR_SUGGESTIONS';
var CREATE_COMMENT = exports.CREATE_COMMENT = 'CREATE_COMMENT';
var CREATE_COMMENT_PENDING = exports.CREATE_COMMENT_PENDING = CREATE_COMMENT + _PENDING;
var CREATE_MESSAGE = exports.CREATE_MESSAGE = 'CREATE_MESSAGE';
var CREATE_MESSAGE_PENDING = exports.CREATE_MESSAGE_PENDING = CREATE_MESSAGE + _PENDING;
var CREATE_COMMUNITY = exports.CREATE_COMMUNITY = 'CREATE_COMMUNITY';
var CREATE_COMMUNITY_PENDING = exports.CREATE_COMMUNITY_PENDING = 'CREATE_COMMUNITY' + _PENDING;
var DROP_QUERY_RESULTS = exports.DROP_QUERY_RESULTS = 'DROP_QUERY_RESULTS';
var EXTRACT_MODEL = exports.EXTRACT_MODEL = 'EXTRACT_MODEL';
var FETCH_COMMENTS = exports.FETCH_COMMENTS = 'FETCH_COMMENTS';
var FETCH_COMMUNITY_TOPIC = exports.FETCH_COMMUNITY_TOPIC = 'FETCH_COMMUNITY_TOPIC';
var FETCH_MESSAGES = exports.FETCH_MESSAGES = 'FETCH_MESSAGES';
var FETCH_MESSAGES_PENDING = exports.FETCH_MESSAGES_PENDING = FETCH_MESSAGES + _PENDING;
var FETCH_THREAD = exports.FETCH_THREAD = 'FETCH_THREAD';
var FETCH_THREADS = exports.FETCH_THREADS = 'FETCH_THREADS';
var FIND_OR_CREATE_THREAD = exports.FIND_OR_CREATE_THREAD = 'FIND_OR_CREATE_THREAD';
var FETCH_TOPIC = exports.FETCH_TOPIC = 'FETCH_TOPIC';
var FETCH_FEED_ITEMS = exports.FETCH_FEED_ITEMS = 'FETCH_FEED_ITEMS';
var FETCH_NOTIFICATIONS = exports.FETCH_NOTIFICATIONS = 'FETCH_NOTIFICATIONS';
var FETCH_POST = exports.FETCH_POST = 'FETCH_POST';
var FETCH_POSTS = exports.FETCH_POSTS = 'FETCH_POSTS';
var FETCH_MODERATOR_SUGGESTIONS = exports.FETCH_MODERATOR_SUGGESTIONS = 'FETCH_MODERATOR_SUGGESTIONS';
var FETCH_COMMUNITY = exports.FETCH_COMMUNITY = 'FETCH_COMMUNITY';
var LEAVE_COMMUNITY = exports.LEAVE_COMMUNITY = 'LEAVE_COMMUNITY';
var LOGIN = exports.LOGIN = 'LOGIN';
var LOGOUT = exports.LOGOUT = 'LOGOUT';
var MARK_ACTIVITY_READ = exports.MARK_ACTIVITY_READ = 'MARK_ACTIVITY_READ';
var MARK_ACTIVITY_READ_PENDING = exports.MARK_ACTIVITY_READ_PENDING = MARK_ACTIVITY_READ + _PENDING;
var MARK_ALL_ACTIVITIES_READ = exports.MARK_ALL_ACTIVITIES_READ = 'MARK_ALL_ACTIVITIES_READ';
var MARK_ALL_ACTIVITIES_READ_PENDING = exports.MARK_ALL_ACTIVITIES_READ_PENDING = MARK_ALL_ACTIVITIES_READ + _PENDING;
var REMOVE_MODERATOR = exports.REMOVE_MODERATOR = 'REMOVE_MODERATOR';
var REMOVE_MODERATOR_PENDING = exports.REMOVE_MODERATOR_PENDING = REMOVE_MODERATOR + _PENDING;
var RESET_NEW_POST_COUNT = exports.RESET_NEW_POST_COUNT = 'RESET_NEW_POST_COUNT';
var RESET_NEW_POST_COUNT_PENDING = exports.RESET_NEW_POST_COUNT_PENDING = 'RESET_NEW_POST_COUNT' + _PENDING;
var SET_CONFIRM_BEFORE_CLOSE = exports.SET_CONFIRM_BEFORE_CLOSE = 'SET_CONFIRM_BEFORE_CLOSE';
var SET_STATE = exports.SET_STATE = 'SET_STATE';
var SIGNUP = exports.SIGNUP = 'SIGNUP';
var STORE_CLEAR_FEED_LIST = exports.STORE_CLEAR_FEED_LIST = 'STORE_CLEAR_FEED_LIST';
var TOGGLE_TOPIC_SUBSCRIBE = exports.TOGGLE_TOPIC_SUBSCRIBE = 'TOGGLE_TOPIC_SUBSCRIBE';
var TOGGLE_TOPIC_SUBSCRIBE_PENDING = exports.TOGGLE_TOPIC_SUBSCRIBE_PENDING = 'TOGGLE_TOPIC_SUBSCRIBE_PENDING';
var UPDATE_THREAD_READ_TIME = exports.UPDATE_THREAD_READ_TIME = 'UPDATE_THREAD_READ_TIME';
var UPDATE_USER_SETTINGS = exports.UPDATE_USER_SETTINGS = 'UPDATE_USER_SETTINGS';
var UPDATE_USER_SETTINGS_PENDING = exports.UPDATE_USER_SETTINGS_PENDING = 'UPDATE_USER_SETTINGS_PENDING';
var UPLOAD_ATTACHMENT = exports.UPLOAD_ATTACHMENT = 'UPLOAD_ATTACHMENT';
var UNLINK_ACCOUNT = exports.UNLINK_ACCOUNT = 'UNLINK_ACCOUNT';
var VOTE_ON_POST = exports.VOTE_ON_POST = 'VOTE_ON_POST';
var VOTE_ON_POST_PENDING = exports.VOTE_ON_POST_PENDING = VOTE_ON_POST + _PENDING;

/***/ })
/******/ ]);