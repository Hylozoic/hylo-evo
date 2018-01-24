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
/******/ 	return __webpack_require__(__webpack_require__.s = 11);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("redux-orm");

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("lodash/fp");

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.orm = undefined;

var _reduxOrm = __webpack_require__(0);

__webpack_require__(20);

var _Activity = __webpack_require__(23);

var _Activity2 = _interopRequireDefault(_Activity);

var _Attachment = __webpack_require__(24);

var _Attachment2 = _interopRequireDefault(_Attachment);

var _Comment = __webpack_require__(25);

var _Comment2 = _interopRequireDefault(_Comment);

var _Community = __webpack_require__(26);

var _Community2 = _interopRequireDefault(_Community);

var _CommunityTopic = __webpack_require__(27);

var _CommunityTopic2 = _interopRequireDefault(_CommunityTopic);

var _Invitation = __webpack_require__(28);

var _Invitation2 = _interopRequireDefault(_Invitation);

var _LinkPreview = __webpack_require__(29);

var _LinkPreview2 = _interopRequireDefault(_LinkPreview);

var _Me = __webpack_require__(30);

var _Me2 = _interopRequireDefault(_Me);

var _Membership = __webpack_require__(31);

var _Membership2 = _interopRequireDefault(_Membership);

var _Message = __webpack_require__(32);

var _Message2 = _interopRequireDefault(_Message);

var _MessageThread = __webpack_require__(33);

var _MessageThread2 = _interopRequireDefault(_MessageThread);

var _Network = __webpack_require__(34);

var _Network2 = _interopRequireDefault(_Network);

var _Notification = __webpack_require__(35);

var _Notification2 = _interopRequireDefault(_Notification);

var _Person = __webpack_require__(36);

var _Person2 = _interopRequireDefault(_Person);

var _PersonConnection = __webpack_require__(37);

var _PersonConnection2 = _interopRequireDefault(_PersonConnection);

var _Post = __webpack_require__(38);

var _Post2 = _interopRequireDefault(_Post);

var _PostMembership = __webpack_require__(39);

var _PostMembership2 = _interopRequireDefault(_PostMembership);

var _SearchResult = __webpack_require__(40);

var _SearchResult2 = _interopRequireDefault(_SearchResult);

var _Skill = __webpack_require__(41);

var _Skill2 = _interopRequireDefault(_Skill);

var _Topic = __webpack_require__(42);

var _Topic2 = _interopRequireDefault(_Topic);

var _Vote = __webpack_require__(43);

var _Vote2 = _interopRequireDefault(_Vote);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var orm = exports.orm = new _reduxOrm.ORM();
orm.register(_Activity2.default, _Attachment2.default, _Comment2.default, _Community2.default, _Community.CommunityModerator, _CommunityTopic2.default, _Invitation2.default, _LinkPreview2.default, _Me2.default, _Membership2.default, _Message2.default, _MessageThread2.default, _Network2.default, _Network.NetworkModerator, _Notification2.default, _Person2.default, _PersonConnection2.default, _Post2.default, _Post.PostCommenter, _Post.PostFollower, _PostMembership2.default, _SearchResult2.default, _Skill2.default, _Topic2.default, _Vote2.default);

exports.default = orm;

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = finalWarning;
/* harmony export (immutable) */ __webpack_exports__["c"] = getValue;
/* unused harmony export hitEnter */
/* harmony export (immutable) */ __webpack_exports__["a"] = fatalErrorMsg;
/* harmony export (immutable) */ __webpack_exports__["d"] = oneTo;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_readline__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_readline___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_readline__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_stream__ = __webpack_require__(14);
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
/* 4 */
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
/* 5 */
/***/ (function(module, exports) {

module.exports = require("faker");

/***/ }),
/* 6 */
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

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("reselect");

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.queryParamWhitelist = undefined;

exports.default = function () {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var action = arguments[1];
  var type = action.type,
      payload = action.payload,
      error = action.error,
      meta = action.meta;

  if (error) return state;
  var root = void 0;

  var addNetworkModerators = function addNetworkModerators(state) {
    var params = Object.assign({}, meta.graphql.variables, { page: meta.page });
    if (payload.data.network.moderators) {
      return appendIds(state, _NetworkSettings.FETCH_MODERATORS, params, payload.data.network.moderators);
    } else {
      return state;
    }
  };

  var addNetworkCommunities = function addNetworkCommunities(state) {
    var params = Object.assign({}, meta.graphql.variables, { page: meta.page });
    if (payload.data.network.communities) {
      return appendIds(state, _NetworkSettings.FETCH_COMMUNITIES, params, payload.data.network.communities);
    } else {
      return state;
    }
  };

  var _ref = meta || {},
      extractQueryResults = _ref.extractQueryResults;

  if (extractQueryResults && payload) {
    var getItems = extractQueryResults.getItems,
        getParams = extractQueryResults.getParams,
        getType = extractQueryResults.getType;

    return appendIds(state, getType ? getType(action) : action.type, getParams ? getParams(action) : meta.graphql.variables, getItems(action));
  }

  // Purpose of this reducer:
  //   Ordering and subsets of ReduxORM data
  //

  switch (type) {
    case _PostEditor.CREATE_POST:
      root = payload.data.createPost;
      var topic = meta.topic;
      // TODO: passing topic throught the meta is a temporary hack to avoid parsing
      // the post details here. Once we implement the topic line in the post editor we
      // can remove this because we'll have the topics. At that time we can remove
      // the topic param in PostEditor.store#createPost

      return matchNewPostIntoQueryResults(state, root, topic);

    case _constants.FIND_OR_CREATE_THREAD:
      root = payload.data.findOrCreateThread;
      return matchNewThreadIntoQueryResults(state, root);

    case _SocketListener.RECEIVE_THREAD:
      return matchNewThreadIntoQueryResults(state, payload.data.thread);

    case _NetworkSettings.FETCH_NETWORK_SETTINGS:
      return addNetworkCommunities(addNetworkModerators(state));

    case _NetworkSettings.FETCH_MODERATORS:
      return addNetworkModerators(state);

    case _NetworkSettings.FETCH_COMMUNITIES:
      return addNetworkCommunities(state);

    case _PostHeader.REMOVE_POST_PENDING:
      return (0, _lodash.mapValues)(state, function (results, key) {
        if ((0, _fp.get)('params.slug', JSON.parse(key)) !== meta.slug) return results;
        return Object.assign({}, results, {
          ids: results.ids.filter(function (id) {
            return id !== meta.postId;
          })
        });
      });

    case _constants.DROP_QUERY_RESULTS:
      return Object.assign({}, state, _defineProperty({}, payload, null));
  }

  return state;
};

exports.matchNewPostIntoQueryResults = matchNewPostIntoQueryResults;
exports.matchNewThreadIntoQueryResults = matchNewThreadIntoQueryResults;
exports.makeGetQueryResults = makeGetQueryResults;
exports.makeDropQueryResults = makeDropQueryResults;
exports.buildKey = buildKey;
exports.makeQueryResultsModelSelector = makeQueryResultsModelSelector;

var _fp = __webpack_require__(1);

var _lodash = __webpack_require__(9);

var _models = __webpack_require__(2);

var _models2 = _interopRequireDefault(_models);

var _reduxOrm = __webpack_require__(0);

var _constants = __webpack_require__(6);

var _PostEditor = __webpack_require__(10);

var _NetworkSettings = __webpack_require__(47);

var _PostHeader = __webpack_require__(48);

var _SocketListener = __webpack_require__(49);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; } // The purpose of this reducer is to provide a general-purpose store for keeping
// track of the ordering of lists of data fetched from the API.
//
// For example, the Members component will want to track the order of Members
// to show when the sort order is set to "Name" separately from when it is set
// to "Location". And both of these lists are different from what should be
// shown when something has been typed into the search field.


// reducer

function matchNewPostIntoQueryResults(state, _ref2, topic) {
  var id = _ref2.id,
      type = _ref2.type,
      communities = _ref2.communities;

  /* about this:
      we add the post id into queryResult sets that are based on time of
      creation because we know that the post just created is the latest
      so we can prepend it. we have to match the different variations which
      can be implicit or explicit about sorting by 'updated'.
  */
  return (0, _fp.reduce)(function (memo, community) {
    var queriesToMatch = [{ slug: community.slug }, { slug: community.slug, filter: type }, { slug: community.slug, sortBy: 'updated' }, { slug: community.slug, sortBy: 'updated', filter: type }];
    if (topic) queriesToMatch.push({ slug: community.slug, topic: topic.id });
    return (0, _fp.reduce)(function (innerMemo, params) {
      return prependIdForCreate(innerMemo, _constants.FETCH_POSTS, params, id);
    }, memo, queriesToMatch);
  }, state, communities);
}

function matchNewThreadIntoQueryResults(state, _ref3) {
  var id = _ref3.id,
      type = _ref3.type;

  return prependIdForCreate(state, _constants.FETCH_THREADS, null, id);
}

function prependIdForCreate(state, type, params, id) {
  var key = buildKey(type, params);
  if (!state[key]) return state;
  return Object.assign({}, state, _defineProperty({}, key, {
    ids: [id].concat(state[key].ids),
    total: state[key].total && state[key].total + 1,
    hasMore: state[key].hasMore
  }));
}

function appendIds(state, type, params, data) {
  if (!data) return state;
  var items = data.items,
      total = data.total,
      hasMore = data.hasMore;

  var key = buildKey(type, params);
  var existingIds = (0, _fp.get)('ids', state[key]) || [];
  return Object.assign({}, state, _defineProperty({}, key, {
    ids: (0, _fp.uniq)(existingIds.concat(items.map(function (x) {
      return x.id;
    }))),
    total: total,
    hasMore: hasMore
  }));
}

// selector factory

function makeGetQueryResults(actionType) {
  return function (state, props) {
    // TBD: Sometimes parameters like "id" and "slug" are to be found in the
    // URL, in which case they are in e.g. props.match.params.id; and sometimes
    // they are passed directly to a component. Should buildKey handle both
    // cases?

    var key = buildKey(actionType, props);
    return state.queryResults[key];
  };
}

// action factory

function makeDropQueryResults(actionType) {
  return function (props) {
    var key = buildKey(actionType, props);
    return {
      type: _constants.DROP_QUERY_RESULTS,
      payload: key
    };
  };
}

function buildKey(type, params) {
  return JSON.stringify({
    type: type,
    params: (0, _fp.omitBy)(_fp.isNull, (0, _fp.pick)(queryParamWhitelist, params))
  });
}

var queryParamWhitelist = exports.queryParamWhitelist = ['id', 'slug', 'networkSlug', 'sortBy', 'search', 'autocomplete', 'filter', 'topic', 'type', 'page'];

function makeQueryResultsModelSelector(resultsSelector, modelName) {
  var transform = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function (i) {
    return i;
  };

  return (0, _reduxOrm.createSelector)(_models2.default, function (state) {
    return state.orm;
  }, resultsSelector, function (session, results) {
    if ((0, _fp.isEmpty)(results) || (0, _fp.isEmpty)(results.ids)) return [];
    return session[modelName].all().filter(function (x) {
      return (0, _fp.includes)(x.id, results.ids);
    }).orderBy(function (x) {
      return results.ids.indexOf(x.id);
    }).toModelArray().map(transform);
  });
}

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = require("lodash");

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultState = exports.getLinkPreview = exports.CLEAR_LINK_PREVIEW = exports.REMOVE_LINK_PREVIEW = exports.FETCH_LINK_PREVIEW = exports.UPDATE_POST_PENDING = exports.UPDATE_POST = exports.CREATE_POST = exports.MODULE_NAME = undefined;
exports.createPost = createPost;
exports.updatePost = updatePost;
exports.fetchLinkPreview = fetchLinkPreview;
exports.pollingFetchLinkPreview = pollingFetchLinkPreview;
exports.removeLinkPreview = removeLinkPreview;
exports.clearLinkPreview = clearLinkPreview;
exports.default = reducer;

var _fp = __webpack_require__(1);

var _reduxOrm = __webpack_require__(0);

var _models = __webpack_require__(2);

var _models2 = _interopRequireDefault(_models);

var _linkMatcher = __webpack_require__(44);

var _linkMatcher2 = _interopRequireDefault(_linkMatcher);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MODULE_NAME = exports.MODULE_NAME = 'PostEditor';
var CREATE_POST = exports.CREATE_POST = MODULE_NAME + '/CREATE_POST';
var UPDATE_POST = exports.UPDATE_POST = MODULE_NAME + '/UPDATE_POST';
var UPDATE_POST_PENDING = exports.UPDATE_POST_PENDING = UPDATE_POST + '_PENDING';
var FETCH_LINK_PREVIEW = exports.FETCH_LINK_PREVIEW = MODULE_NAME + '/FETCH_LINK_PREVIEW';
var REMOVE_LINK_PREVIEW = exports.REMOVE_LINK_PREVIEW = MODULE_NAME + '/REMOVE_LINK_PREVIEW';
var CLEAR_LINK_PREVIEW = exports.CLEAR_LINK_PREVIEW = MODULE_NAME + '/CLEAR_LINK_PREVIEW';

// Actions

function createPost(post, topic) {
  var type = post.type,
      title = post.title,
      details = post.details,
      communities = post.communities,
      linkPreview = post.linkPreview,
      imageUrls = post.imageUrls,
      fileUrls = post.fileUrls;

  var linkPreviewId = linkPreview && linkPreview.id;
  var communityIds = communities.map(function (c) {
    return c.id;
  });
  return {
    type: CREATE_POST,
    graphql: {
      query: 'mutation (\n        $type: String,\n        $title: String,\n        $details: String,\n        $linkPreviewId: String,\n        $communityIds: [String],\n        $imageUrls: [String],\n        $fileUrls: [String]\n      ) {\n        createPost(data: {\n          type: $type,\n          title: $title,\n          details: $details,\n          linkPreviewId: $linkPreviewId,\n          communityIds: $communityIds,\n          imageUrls: $imageUrls,\n          fileUrls: $fileUrls\n        }) {\n          id\n          type\n          title\n          details\n          commentersTotal\n          communities {\n            id\n            name\n            slug\n          }\n          creator {\n            id\n          }\n          linkPreview {\n            id\n          }\n          attachments {\n            id\n            type\n            url\n            position\n          }\n        }\n      }',
      variables: {
        type: type,
        title: title,
        details: details,
        linkPreviewId: linkPreviewId,
        communityIds: communityIds,
        imageUrls: imageUrls,
        fileUrls: fileUrls
      }
    },
    meta: {
      extractModel: 'Post',
      topic: topic
    }
  };
}

function updatePost(post) {
  var id = post.id,
      type = post.type,
      title = post.title,
      details = post.details,
      communities = post.communities,
      linkPreview = post.linkPreview,
      imageUrls = post.imageUrls,
      fileUrls = post.fileUrls;

  var linkPreviewId = linkPreview && linkPreview.id;
  var communityIds = communities.map(function (c) {
    return c.id;
  });
  return {
    type: UPDATE_POST,
    graphql: {
      query: 'mutation (\n        $id: ID,\n        $type: String,\n        $title: String,\n        $details: String,\n        $linkPreviewId: String,\n        $communityIds: [String],\n        $imageUrls: [String],\n        $fileUrls: [String]\n      ) {\n        updatePost(id: $id, data: {\n          type: $type,\n          title: $title,\n          details: $details,\n          linkPreviewId: $linkPreviewId,\n          communityIds: $communityIds,\n          imageUrls: $imageUrls,\n          fileUrls: $fileUrls\n        }) {\n          id\n          type\n          title\n          details\n          linkPreview {\n            id\n          }\n          communities {\n            id\n            name\n            slug\n          }\n          attachments {\n            id\n            type\n            url\n            position\n          }\n        }\n      }',
      variables: {
        id: id,
        type: type,
        title: title,
        details: details,
        linkPreviewId: linkPreviewId,
        communityIds: communityIds,
        imageUrls: imageUrls,
        fileUrls: fileUrls
      }
    },
    meta: {
      id: id,
      extractModel: {
        modelName: 'Post',
        getRoot: (0, _fp.get)('updatePost'),
        append: false
      },
      optimistic: true
    }
  };
}

function fetchLinkPreview(url) {
  return {
    type: FETCH_LINK_PREVIEW,
    graphql: {
      query: 'mutation ($url: String) {\n        findOrCreateLinkPreviewByUrl(data: {url: $url}) {\n          id\n          url\n          imageUrl\n          title\n          description\n          imageWidth\n          imageHeight\n          status\n        }\n      }',
      variables: {
        url: url
      }
    },
    meta: {
      extractModel: {
        modelName: 'LinkPreview',
        getRoot: (0, _fp.get)('findOrCreateLinkPreviewByUrl')
      }
    }
  };
}

function pollingFetchLinkPreview(dispatch, htmlContent) {
  var poll = function poll(url, delay) {
    if (delay > 4) return;
    dispatch(fetchLinkPreview(url)).then(function (value) {
      if (!value) return;
      var linkPreviewFound = value.meta.extractModel.getRoot(value.payload.data);
      if (!linkPreviewFound) {
        setTimeout(function () {
          return poll(url, delay * 2);
        }, delay * 1000);
      }
    });
  };
  if (_linkMatcher2.default.test(htmlContent)) {
    var urlMatch = _linkMatcher2.default.match(htmlContent)[0].url;
    poll(urlMatch, 0.5);
  }
}

function removeLinkPreview() {
  return { type: REMOVE_LINK_PREVIEW };
}

function clearLinkPreview() {
  return { type: CLEAR_LINK_PREVIEW };
}

// Selectors

var getLinkPreview = exports.getLinkPreview = (0, _reduxOrm.createSelector)(_models2.default, function (state) {
  return state.orm;
}, function (state) {
  return state[MODULE_NAME];
}, function (_ref, _ref2) {
  var LinkPreview = _ref.LinkPreview;
  var linkPreviewId = _ref2.linkPreviewId;
  return LinkPreview.hasId(linkPreviewId) ? LinkPreview.withId(linkPreviewId).ref : null;
});

// Reducer

var defaultState = exports.defaultState = {
  linkPreviewId: null,
  linkPreviewStatus: null
};

function reducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultState;
  var action = arguments[1];
  var error = action.error,
      type = action.type,
      payload = action.payload,
      meta = action.meta;

  if (error) return state;

  switch (type) {
    case FETCH_LINK_PREVIEW:
      var linkPreview = meta.extractModel.getRoot(payload.data);
      if (linkPreview && !linkPreview.title) {
        return Object.assign({}, state, { linkPreviewId: null, linkPreviewStatus: 'invalid' });
      }
      return Object.assign({}, state, { linkPreviewId: (0, _fp.get)('id')(linkPreview), linkPreviewStatus: null });
    case REMOVE_LINK_PREVIEW:
      return Object.assign({}, state, { linkPreviewId: null, linkPreviewStatus: 'removed' });
    case CLEAR_LINK_PREVIEW:
      return Object.assign({}, state, { linkPreviewId: null, linkPreviewStatus: 'cleared' });
    default:
      return state;
  }
}

/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_minimist__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_minimist___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_minimist__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__seeder__ = __webpack_require__(15);
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
      await Object(__WEBPACK_IMPORTED_MODULE_1__utils__["b" /* finalWarning */])(EXTRA_EXTRA_WARNING)
      Object(__WEBPACK_IMPORTED_MODULE_2__seeder__["a" /* default */])()
  }
})()


/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = require("minimist");

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = require("readline");

/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = require("stream");

/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = seeder;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_puppeteer__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_puppeteer___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_puppeteer__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__admin__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__comments__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__communities__ = __webpack_require__(50);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__utils__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__posts__ = __webpack_require__(51);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__users__ = __webpack_require__(52);









const BE_PATIENT = `
  This will take awhile (API requests issued sequentially). If you're not sure
  if everything is still working, you can always check the backend log output
  in its terminal window.
`

async function seeder () {
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

    process.stdout.write(`\n  ${BE_PATIENT}`)

    // userBatch is gradually modified: definitely not immutable!
    const userBatch = await Object(__WEBPACK_IMPORTED_MODULE_6__users__["a" /* default */])(page)
    await Object(__WEBPACK_IMPORTED_MODULE_1__admin__["a" /* default */])(page)
    await Object(__WEBPACK_IMPORTED_MODULE_3__communities__["a" /* default */])(page, userBatch)
    const postBatch = await Object(__WEBPACK_IMPORTED_MODULE_5__posts__["a" /* default */])(page, userBatch)
    await Object(__WEBPACK_IMPORTED_MODULE_2__comments__["a" /* default */])(page, userBatch, postBatch)

    await page.close()
    await browser.close()
  } catch (e) {
    if (page) await page.close()
    if (browser) await browser.close()
    console.log(e)
    Object(__WEBPACK_IMPORTED_MODULE_4__utils__["a" /* fatalErrorMsg */])(e)
  }
}


/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports = require("puppeteer");

/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = admin;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils__ = __webpack_require__(3);


const ADMIN_LOGIN_MESSAGE = `
  This script requires an admin login. Any Hylo developer should have one of
  these: you just need an @hylo.com email. The script delivers your password
  to the server using headless Chrome and then should be promptly GC'd out of
  existence. It doesn't get cached or written anywhere.

  (The admin login is completely separate to Hylo user accounts, so we can do
  it without a single user in the database which is handy.)
`

async function admin (page) {
  console.log(`\n${ADMIN_LOGIN_MESSAGE}`)
  const email = await Object(__WEBPACK_IMPORTED_MODULE_0__utils__["c" /* getValue */])('    Hylo email: ')
  const password = await Object(__WEBPACK_IMPORTED_MODULE_0__utils__["c" /* getValue */])('    Password: ', true)
  process.stdout.write('\n\n  Authenticating you with Google...')

  // Google auth
  await page.goto('http://localhost:3001/noo/admin/login')
  await page.waitForNavigation()
  await page.keyboard.type(email)
  await page.click('#identifierNext')

  // If you're having difficulties logging in, try increasing this from 2s
  await page.waitFor(2 * 1000)

  await page.keyboard.type(password)
  await page.click('#passwordNext')
  await page.waitForNavigation()
  process.stdout.write(' ✓')
}


/***/ }),
/* 18 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = seedComments;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_faker__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_faker___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_faker__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__api__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_routes_PostDetail_Comments_Comments_store__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_routes_PostDetail_Comments_Comments_store___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_routes_PostDetail_Comments_Comments_store__);
/* global COMMENT_COUNT */





async function seedComments (page, userBatch, postBatch) {
  const api = Object(__WEBPACK_IMPORTED_MODULE_1__api__["a" /* default */])(page)

  const communities = userBatch.reduce((acc, user) => {
    if (user.community.id) {
      return [ ...acc, user.community ]
    }
    return acc
  }, [])

  for (let community of communities) {
    const posts = postBatch.filter(p => p.data.createPost.communities[0].id === community.id)
    process.stdout.write(`\n  Adding comments to ${posts.length} posts in ${community.name}...`)
    const members = userBatch.reduce((acc, user) => {
      if (user.memberships.includes(community.id) || user.community.id === community.id) {
        return [ ...acc, user ]
      }
      return acc
    }, [])

    for (let i = 0; i < 2; i++) {
      for (let member of members) {
        await api.request('/noo/login', member)
        for (let post of posts) {
          await api.graphql(Object(__WEBPACK_IMPORTED_MODULE_2_routes_PostDetail_Comments_Comments_store__["createComment"])(post.data.createPost.id, __WEBPACK_IMPORTED_MODULE_0_faker___default.a.lorem.paragraph()))
        }
        await api.logout()
      }
    }

    process.stdout.write(' ✓')
  }

  return null
}


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getComments = exports.getTotalComments = exports.getHasMoreComments = undefined;
exports.fetchComments = fetchComments;
exports.createComment = createComment;

var _constants = __webpack_require__(6);

var _fp = __webpack_require__(1);

var _reselect = __webpack_require__(7);

var _queryResults = __webpack_require__(8);

var _models = __webpack_require__(2);

var _models2 = _interopRequireDefault(_models);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function fetchComments(id) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  return {
    type: _constants.FETCH_COMMENTS,
    graphql: {
      query: 'query ($id: ID, $cursor: ID) {\n        post(id: $id) {\n          id\n          comments(first: 10, cursor: $cursor, order: "desc") {\n            items {\n              id\n              text\n              creator {\n                id\n                name\n                avatarUrl\n              }\n              createdAt\n              attachments {\n                id\n                url\n              }\n            }\n            total\n            hasMore\n          }\n        }\n      }',
      variables: {
        id: id,
        cursor: opts.cursor
      }
    },
    meta: {
      extractModel: 'Post',
      extractQueryResults: {
        getItems: (0, _fp.get)('payload.data.post.comments')
      }
    }
  };
}

function createComment(postId, text) {
  return {
    type: _constants.CREATE_COMMENT,
    graphql: {
      query: 'mutation ($postId: String, $text: String) {\n        createComment(data: {postId: $postId, text: $text}) {\n          id\n          text\n          post {\n            id\n          }\n          createdAt\n          creator {\n            id\n          }\n        }\n      }',
      variables: {
        postId: postId,
        text: text
      }
    },
    meta: {
      optimistic: true,
      extractModel: 'Comment',
      tempId: (0, _fp.uniqueId)('post' + postId + '_'),
      postId: postId,
      text: text
    }
  };
}

var getCommentResults = (0, _queryResults.makeGetQueryResults)(_constants.FETCH_COMMENTS);

var getHasMoreComments = exports.getHasMoreComments = (0, _reselect.createSelector)(getCommentResults, (0, _fp.get)('hasMore'));

var getTotalComments = exports.getTotalComments = (0, _reselect.createSelector)(getCommentResults, (0, _fp.get)('total'));

var getComments = exports.getComments = (0, _reselect.createSelector)(function (state) {
  return _models2.default.session(state.orm);
}, function (state, props) {
  return props.postId;
}, function (session, id) {
  var post;
  try {
    post = session.Post.get({ id: id });
  } catch (e) {
    return [];
  }
  return post.comments.orderBy(function (c) {
    return Number(c.id);
  }).toModelArray().map(function (comment) {
    return Object.assign({}, comment.ref, {
      creator: comment.creator,
      image: comment.attachments.toModelArray()[0]
    });
  });
});

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _reduxOrm = __webpack_require__(0);

var _fields = __webpack_require__(21);

var _utils = __webpack_require__(22);

var _lodash = __webpack_require__(9);

_reduxOrm.Model.safeGet = function (matchObj) {
  var result = void 0;
  try {
    result = this.get(matchObj);
  } catch (e) {
    result = null;
  }
  return result;
};

_reduxOrm.Model.prototype.updateAppending = function (attrs) {
  var _this = this;

  return this.update((0, _lodash.mapValues)(attrs, function (val, key) {
    if (!val) return val;
    var field = _this.constructor.fields[key];
    if (!(field && field instanceof _fields.ManyToMany)) return val;

    var existingIds = _this[key].toRefArray().map(function (x) {
      return x.id;
    });
    return (0, _lodash.uniq)(existingIds.concat(val.map(_utils.normalizeEntity)));
  }));
};

/***/ }),
/* 21 */
/***/ (function(module, exports) {

module.exports = require("redux-orm/lib/fields");

/***/ }),
/* 22 */
/***/ (function(module, exports) {

module.exports = require("redux-orm/lib/utils");

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reduxOrm = __webpack_require__(0);

var Activity = _reduxOrm.Model.createClass({
  toString: function toString() {
    return 'Message: ' + this.id;
  }
});

exports.default = Activity;


Activity.modelName = 'Activity';

Activity.fields = {
  id: (0, _reduxOrm.attr)(),
  actor: (0, _reduxOrm.fk)('Person'),
  post: (0, _reduxOrm.fk)('Post'),
  comment: (0, _reduxOrm.fk)('Comment'),
  unread: (0, _reduxOrm.attr)(),
  action: (0, _reduxOrm.attr)(),
  meta: (0, _reduxOrm.attr)()
};

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reduxOrm = __webpack_require__(0);

var Attachment = _reduxOrm.Model.createClass({
  toString: function toString() {
    return 'Attachment (' + this.type + '): ' + this.name;
  }
});

exports.default = Attachment;


Attachment.modelName = 'Attachment';

Attachment.fields = {
  id: (0, _reduxOrm.attr)(),
  type: (0, _reduxOrm.attr)(),
  position: (0, _reduxOrm.attr)(),
  url: (0, _reduxOrm.attr)(),
  thumbnailUrl: (0, _reduxOrm.attr)(),
  post: (0, _reduxOrm.fk)('Post', 'attachments'),
  comment: (0, _reduxOrm.fk)('Comment', 'attachments'),
  createdAt: (0, _reduxOrm.attr)()
};

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reduxOrm = __webpack_require__(0);

var Comment = _reduxOrm.Model.createClass({
  toString: function toString() {
    return 'Comment: ' + this.name;
  }
});

exports.default = Comment;


Comment.modelName = 'Comment';

Comment.fields = {
  id: (0, _reduxOrm.attr)(),
  text: (0, _reduxOrm.attr)(),
  creator: (0, _reduxOrm.fk)('Person', 'comments'),
  post: (0, _reduxOrm.fk)('Post', 'comments'),
  createdAt: (0, _reduxOrm.attr)()
};

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ALL_COMMUNITIES_AVATAR_PATH = exports.ALL_COMMUNITIES_ID = exports.DEFAULT_AVATAR = exports.DEFAULT_BANNER = exports.CommunityModerator = undefined;

var _reduxOrm = __webpack_require__(0);

var CommunityModerator = exports.CommunityModerator = _reduxOrm.Model.createClass({});
CommunityModerator.modelName = 'CommunityModerator';
CommunityModerator.fields = {
  community: (0, _reduxOrm.fk)('Community', 'communitymoderators'),
  moderator: (0, _reduxOrm.fk)('Person', 'communitymoderators')
};

var Community = _reduxOrm.Model.createClass({
  toString: function toString() {
    return 'Community: ' + this.name;
  }
});

exports.default = Community;


Community.modelName = 'Community';

Community.fields = {
  id: (0, _reduxOrm.attr)(),
  name: (0, _reduxOrm.attr)(),
  members: (0, _reduxOrm.many)('Person'),
  moderators: (0, _reduxOrm.many)({
    to: 'Person',
    relatedName: 'moderatedCommunities',
    through: 'CommunityModerator',
    throughFields: ['community', 'moderator']
  }),
  network: (0, _reduxOrm.fk)('Network'),
  posts: (0, _reduxOrm.many)('Post'),
  postCount: (0, _reduxOrm.attr)(),
  feedOrder: (0, _reduxOrm.attr)()
};

var DEFAULT_BANNER = exports.DEFAULT_BANNER = 'https://d3ngex8q79bk55.cloudfront.net/misc/default_community_banner.jpg';
var DEFAULT_AVATAR = exports.DEFAULT_AVATAR = 'https://d3ngex8q79bk55.cloudfront.net/misc/default_community_avatar.png';

var ALL_COMMUNITIES_ID = exports.ALL_COMMUNITIES_ID = 'all-communities';

var ALL_COMMUNITIES_AVATAR_PATH = exports.ALL_COMMUNITIES_AVATAR_PATH = '/assets/white-merkaba.png';

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reduxOrm = __webpack_require__(0);

var CommunityTopic = _reduxOrm.Model.createClass({
  toString: function toString() {
    return 'CommunityTopic: ' + this.topic;
  }
});

exports.default = CommunityTopic;


CommunityTopic.modelName = 'CommunityTopic';

CommunityTopic.fields = {
  id: (0, _reduxOrm.attr)(),
  topic: (0, _reduxOrm.fk)('Topic', 'communityTopics'),
  community: (0, _reduxOrm.fk)('Community', 'communityTopics'),
  postsTotal: (0, _reduxOrm.attr)(),
  followersTotal: (0, _reduxOrm.attr)()
};

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reduxOrm = __webpack_require__(0);

var Invitation = _reduxOrm.Model.createClass({
  toString: function toString() {
    return 'Invitation: ' + this.id;
  }
});

exports.default = Invitation;


Invitation.modelName = 'Invitation';
Invitation.fields = {
  id: (0, _reduxOrm.attr)(),
  email: (0, _reduxOrm.attr)(),
  createdAt: (0, _reduxOrm.attr)(),
  lastSentAt: (0, _reduxOrm.attr)(),
  resent: (0, _reduxOrm.attr)(),
  community: (0, _reduxOrm.fk)('Community', 'pendingInvitations')
};

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reduxOrm = __webpack_require__(0);

var LinkPreview = _reduxOrm.Model.createClass({
  toString: function toString() {
    return 'LinkPreview: ' + this.title;
  }
});

exports.default = LinkPreview;


LinkPreview.modelName = 'LinkPreview';

LinkPreview.fields = {
  id: (0, _reduxOrm.attr)()
};

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DEFAULT_BANNER = undefined;

var _reduxOrm = __webpack_require__(0);

var _fp = __webpack_require__(1);

var Me = _reduxOrm.Model.createClass({
  toString: function toString() {
    return 'Me: ' + this.name;
  },
  firstName: function firstName() {
    return this.name ? this.name.split(' ')[0] : null;
  },
  canModerate: function canModerate(community) {
    var memberships = this.memberships.toRefArray ? this.memberships.toRefArray() : this.memberships;
    var membership = (0, _fp.find)(function (m) {
      return m.community === (0, _fp.get)('id', community);
    }, memberships);
    return (0, _fp.get)('hasModeratorRole', membership);
  }
});

exports.default = Me;


Me.modelName = 'Me';
Me.fields = {
  isAdmin: (0, _reduxOrm.attr)(),
  name: (0, _reduxOrm.attr)(),
  posts: (0, _reduxOrm.many)('Post'),

  // strictly speaking, a membership belongs to a single person, so it's not a
  // many-to-many relationship. but putting this here ensures that when we have
  // a query on the current user that contains memberships, the data will be
  // properly extracted and stored for the user.
  memberships: (0, _reduxOrm.many)('Membership'),

  messageThreads: (0, _reduxOrm.many)('MessageThread'),
  notifications: (0, _reduxOrm.many)('Notification'),
  skills: (0, _reduxOrm.many)('Skill')
};

var DEFAULT_BANNER = exports.DEFAULT_BANNER = 'https://d3ngex8q79bk55.cloudfront.net/misc/default_user_banner.jpg';

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reduxOrm = __webpack_require__(0);

var Membership = _reduxOrm.Model.createClass({
  toString: function toString() {
    return 'Membership: ' + this.id;
  }
});

exports.default = Membership;


Membership.modelName = 'Membership';
Membership.fields = {
  id: (0, _reduxOrm.attr)(),
  community: (0, _reduxOrm.fk)('Community', 'memberships'),
  person: (0, _reduxOrm.fk)('Person', 'memberships'),
  newPostCount: (0, _reduxOrm.attr)()
};

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reduxOrm = __webpack_require__(0);

var Message = _reduxOrm.Model.createClass({
  toString: function toString() {
    return 'Message: ' + this.id;
  }
});

exports.default = Message;


Message.modelName = 'Message';

Message.fields = {
  id: (0, _reduxOrm.attr)(),
  text: (0, _reduxOrm.attr)(),
  creator: (0, _reduxOrm.fk)('Person'),
  createdAt: (0, _reduxOrm.attr)(),
  messageThread: (0, _reduxOrm.fk)('MessageThread', 'messages')
};

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.others = others;
exports.formatNames = formatNames;

var _reduxOrm = __webpack_require__(0);

var _fp = __webpack_require__(1);

var MessageThread = _reduxOrm.Model.createClass({
  isUnread: function isUnread() {
    return this.lastReadAt === undefined || new Date(this.lastReadAt) < new Date(this.updatedAt);
  },
  isUpdatedSince: function isUpdatedSince(date) {
    return new Date(this.updatedAt) > date;
  },
  toString: function toString() {
    return 'MessageThread: ' + this.id;
  },
  newMessageReceived: function newMessageReceived(bumpUnreadCount) {
    var update = bumpUnreadCount ? { unreadCount: this.unreadCount + 1, updatedAt: new Date().toString() } : { updatedAt: new Date().toString() };
    this.update(update);
    return this;
  },
  markAsRead: function markAsRead() {
    this.update({
      unreadCount: 0,
      lastReadAt: new Date().toString()
    });
    return this;
  },
  participantAttributes: function participantAttributes(currentUser, maxShown) {
    var currentUserId = (0, _fp.get)('id', currentUser);
    var participants = this.participants.toRefArray().filter(function (p) {
      return p.id !== currentUserId;
    });
    var names, avatarUrls;

    if ((0, _fp.isEmpty)(participants)) {
      avatarUrls = [(0, _fp.get)('avatarUrl', currentUser)];
      names = 'You';
    } else {
      avatarUrls = participants.map(function (p) {
        return p.avatarUrl;
      });
      names = formatNames(participants.map(function (p) {
        return p.name;
      }), maxShown);
    }

    return { names: names, avatarUrls: avatarUrls };
  }
});

function others(n) {
  if (n < 0) {
    return '';
  } else if (n === 1) {
    return '1 other';
  } else {
    return n + ' others';
  }
}

function formatNames(names, maxShown) {
  var length = names.length;
  var truncatedNames = maxShown && maxShown < length ? names.slice(0, maxShown).concat([others(length - maxShown)]) : names;

  var last = truncatedNames.pop();
  if ((0, _fp.isEmpty)(truncatedNames)) {
    return last;
  } else {
    return truncatedNames.join(', ') + (' and ' + last);
  }
}

exports.default = MessageThread;


MessageThread.modelName = 'MessageThread';

MessageThread.fields = {
  id: (0, _reduxOrm.attr)(),
  unreadCount: (0, _reduxOrm.attr)(),
  participants: (0, _reduxOrm.many)('Person'),
  updatedAt: (0, _reduxOrm.attr)(),
  lastReadAt: (0, _reduxOrm.attr)()
};

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DEFAULT_AVATAR = exports.DEFAULT_BANNER = exports.NetworkModerator = undefined;

var _reduxOrm = __webpack_require__(0);

var NetworkModerator = exports.NetworkModerator = _reduxOrm.Model.createClass({});
NetworkModerator.modelName = 'NetworkModerator';
NetworkModerator.fields = {
  network: (0, _reduxOrm.fk)('Network', 'networkmoderators'),
  moderator: (0, _reduxOrm.fk)('Person', 'networkmoderators')
};

var Network = _reduxOrm.Model.createClass({
  toString: function toString() {
    return 'Network: ' + this.name;
  }
});

exports.default = Network;


Network.modelName = 'Network';

Network.fields = {
  id: (0, _reduxOrm.attr)(),
  name: (0, _reduxOrm.attr)(),
  description: (0, _reduxOrm.attr)(),
  avatarUrl: (0, _reduxOrm.attr)(),
  bannerUrl: (0, _reduxOrm.attr)(),
  members: (0, _reduxOrm.many)('Person'),
  moderators: (0, _reduxOrm.many)({
    to: 'Person',
    relatedName: 'moderatedNetworks',
    through: 'NetworkModerator',
    throughFields: ['network', 'moderator']
  }),
  communities: (0, _reduxOrm.many)('Community'),
  posts: (0, _reduxOrm.many)('Post')
};

var DEFAULT_BANNER = exports.DEFAULT_BANNER = 'https://d3ngex8q79bk55.cloudfront.net/misc/default_community_banner.jpg';
var DEFAULT_AVATAR = exports.DEFAULT_AVATAR = 'https://d3ngex8q79bk55.cloudfront.net/misc/default_community_avatar.png';

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ACTION_COMMENT_MENTION = exports.ACTION_MENTION = exports.ACTION_APPROVED_JOIN_REQUEST = exports.ACTION_JOIN_REQUEST = exports.ACTION_TAG = exports.ACTION_NEW_COMMENT = undefined;

var _reduxOrm = __webpack_require__(0);

var Notification = _reduxOrm.Model.createClass({
  toString: function toString() {
    return 'Message: ' + this.id;
  }
});

exports.default = Notification;


Notification.modelName = 'Notification';

Notification.fields = {
  id: (0, _reduxOrm.attr)(),
  activity: (0, _reduxOrm.fk)('Activity'),
  createdAt: (0, _reduxOrm.attr)()
};

var ACTION_NEW_COMMENT = exports.ACTION_NEW_COMMENT = 'newComment';
var ACTION_TAG = exports.ACTION_TAG = 'tag';
var ACTION_JOIN_REQUEST = exports.ACTION_JOIN_REQUEST = 'joinRequest';
var ACTION_APPROVED_JOIN_REQUEST = exports.ACTION_APPROVED_JOIN_REQUEST = 'approvedJoinRequest';
var ACTION_MENTION = exports.ACTION_MENTION = 'mention';
var ACTION_COMMENT_MENTION = exports.ACTION_COMMENT_MENTION = 'commentMention';

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.firstName = undefined;

var _reduxOrm = __webpack_require__(0);

var Person = _reduxOrm.Model.createClass({
  toString: function toString() {
    return 'Person: ' + this.name;
  }
});

exports.default = Person;


Person.modelName = 'Person';

Person.fields = {
  id: (0, _reduxOrm.attr)(),
  name: (0, _reduxOrm.attr)(),
  bio: (0, _reduxOrm.attr)(),
  avatarUrl: (0, _reduxOrm.attr)(),
  bannerUrl: (0, _reduxOrm.attr)(),
  twitterName: (0, _reduxOrm.attr)(),
  facebookUrl: (0, _reduxOrm.attr)(),
  linkedinUrl: (0, _reduxOrm.attr)(),
  url: (0, _reduxOrm.attr)(),
  location: (0, _reduxOrm.attr)(),
  skills: (0, _reduxOrm.many)('Skill'),
  postsTotal: (0, _reduxOrm.attr)(),
  votesTotal: (0, _reduxOrm.attr)()
};

var firstName = exports.firstName = function firstName(person) {
  return person.name.split(' ')[0];
};

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reduxOrm = __webpack_require__(0);

var PersonConnection = _reduxOrm.Model.createClass({
  toString: function toString() {
    return 'PersonConnection: ' + this.type;
  }
});

exports.default = PersonConnection;


PersonConnection.modelName = 'PersonConnection';
PersonConnection.fields = {
  person: (0, _reduxOrm.fk)('Person'),
  type: (0, _reduxOrm.attr)(),
  createdAt: (0, _reduxOrm.attr)(),
  updatedAt: (0, _reduxOrm.attr)()
};

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PostCommenter = exports.PostFollower = undefined;

var _reduxOrm = __webpack_require__(0);

var PostFollower = exports.PostFollower = _reduxOrm.Model.createClass({});
PostFollower.modelName = 'PostFollower';
PostFollower.fields = {
  post: (0, _reduxOrm.fk)('Post', 'postfollowers'),
  follower: (0, _reduxOrm.fk)('Person', 'postfollowers')
};

var PostCommenter = exports.PostCommenter = _reduxOrm.Model.createClass({});
PostCommenter.modelName = 'PostCommenter';
PostCommenter.fields = {
  post: (0, _reduxOrm.fk)('Post', 'postcommenters'),
  commenter: (0, _reduxOrm.fk)('Person', 'postcommenters')
};

var Post = _reduxOrm.Model.createClass({
  toString: function toString() {
    return 'Post: ' + this.name;
  }
});

exports.default = Post;


Post.modelName = 'Post';
Post.fields = {
  id: (0, _reduxOrm.attr)(),
  title: (0, _reduxOrm.attr)(),
  type: (0, _reduxOrm.attr)(),
  details: (0, _reduxOrm.attr)(),
  linkPreview: (0, _reduxOrm.fk)('LinkPreview', 'posts'),
  creator: (0, _reduxOrm.fk)('Person', 'posts'),
  followers: (0, _reduxOrm.many)({
    to: 'Person',
    relatedName: 'postsFollowing',
    through: 'PostFollower',
    throughFields: ['post', 'follower']
  }),
  communities: (0, _reduxOrm.many)('Community'),
  postMemberships: (0, _reduxOrm.many)('PostMembership'),
  communitiesTotal: (0, _reduxOrm.attr)(),
  commenters: (0, _reduxOrm.many)({
    to: 'Person',
    relatedName: 'postsCommented',
    through: 'PostCommenter',
    throughFields: ['post', 'commenter']
  }),
  commentersTotal: (0, _reduxOrm.attr)(),
  createdAt: (0, _reduxOrm.attr)(),
  startsAt: (0, _reduxOrm.attr)(),
  endsAt: (0, _reduxOrm.attr)(),
  fulfilledAt: (0, _reduxOrm.attr)(),
  votesTotal: (0, _reduxOrm.attr)(),
  myVote: (0, _reduxOrm.attr)()
};

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reduxOrm = __webpack_require__(0);

var PostMembership = _reduxOrm.Model.createClass({
  toString: function toString() {
    return 'PostMembership: ' + this.id;
  }
});

exports.default = PostMembership;


PostMembership.modelName = 'PostMembership';
PostMembership.fields = {
  id: (0, _reduxOrm.attr)(),
  pinned: (0, _reduxOrm.attr)(),
  community: (0, _reduxOrm.fk)('Community', 'postMemberships')
};

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _reduxOrm = __webpack_require__(0);

var SearchResult = _reduxOrm.Model.createClass({
  toString: function toString() {
    return 'SearchResult: ' + this.id;
  },
  getContent: function getContent(session) {
    var _content$split = this.content.split('-'),
        _content$split2 = _slicedToArray(_content$split, 2),
        type = _content$split2[0],
        id = _content$split2[1];

    return session[type].withId(id);
  }
});

exports.default = SearchResult;


SearchResult.modelName = 'SearchResult';
SearchResult.fields = {
  id: (0, _reduxOrm.attr)(),
  // this is a polymorphicId, see getContent above
  content: (0, _reduxOrm.attr)()
};

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reduxOrm = __webpack_require__(0);

var Skill = _reduxOrm.Model.createClass({
  toString: function toString() {
    return 'Skill: ' + this.name;
  }
});

exports.default = Skill;


Skill.modelName = 'Skill';

Skill.fields = {
  id: (0, _reduxOrm.attr)(),
  name: (0, _reduxOrm.attr)()
};

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reduxOrm = __webpack_require__(0);

var Topic = _reduxOrm.Model.createClass({
  toString: function toString() {
    return 'Topic: ' + this.name;
  }
});

exports.default = Topic;


Topic.modelName = 'Topic';

Topic.fields = {
  id: (0, _reduxOrm.attr)(),
  name: (0, _reduxOrm.attr)(),
  postsTotal: (0, _reduxOrm.attr)(),
  followersTotal: (0, _reduxOrm.attr)()
};

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reduxOrm = __webpack_require__(0);

var Vote = _reduxOrm.Model.createClass({
  toString: function toString() {
    return 'Vote: ' + this.id;
  }
});

exports.default = Vote;


Vote.modelName = 'Vote';

Vote.fields = {
  id: (0, _reduxOrm.attr)(),
  post: (0, _reduxOrm.fk)('Post', 'votes'),
  voter: (0, _reduxOrm.fk)('Person', 'votes'),
  dateVoted: (0, _reduxOrm.attr)()
};

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _linkifyIt = __webpack_require__(45);

var _linkifyIt2 = _interopRequireDefault(_linkifyIt);

var _tlds = __webpack_require__(46);

var _tlds2 = _interopRequireDefault(_tlds);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var linkMatcher = (0, _linkifyIt2.default)();
linkMatcher.tlds(_tlds2.default);

exports.default = linkMatcher;

/***/ }),
/* 45 */
/***/ (function(module, exports) {

module.exports = require("linkify-it");

/***/ }),
/* 46 */
/***/ (function(module, exports) {

module.exports = require("tlds");

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getModeratorAutocomplete = exports.getCommunityAutocomplete = exports.getModeratorsPage = exports.getCommunitiesPage = exports.getCommunities = exports.getCommunitiesHasMore = exports.getCommunitiesTotal = exports.getCommunitiesResults = exports.getModerators = exports.getModeratorsTotal = exports.getModeratorResults = exports.getNetwork = exports.fetchCommunityAutocomplete = exports.fetchModeratorAutocomplete = exports.PAGE_SIZE = exports.AUTOCOMPLETE_SIZE = exports.UPDATE_NETWORK_SETTINGS = exports.SET_MODERATORS_PAGE = exports.SET_COMMUNITIES_PAGE = exports.REMOVE_NETWORK_MODERATOR_ROLE_PENDING = exports.REMOVE_NETWORK_MODERATOR_ROLE = exports.REMOVE_COMMUNITY_FROM_NETWORK_PENDING = exports.REMOVE_COMMUNITY_FROM_NETWORK = exports.FETCH_NETWORK_SETTINGS = exports.FETCH_MODERATORS = exports.FETCH_MODERATOR_AUTOCOMPLETE = exports.FETCH_COMMUNITY_AUTOCOMPLETE = exports.FETCH_COMMUNITIES = exports.ADD_NETWORK_MODERATOR_ROLE_PENDING = exports.ADD_NETWORK_MODERATOR_ROLE = exports.ADD_COMMUNITY_TO_NETWORK_PENDING = exports.ADD_COMMUNITY_TO_NETWORK = exports.MODULE_NAME = undefined;
exports.default = reducer;
exports.ormSessionReducer = ormSessionReducer;
exports.addCommunityToNetwork = addCommunityToNetwork;
exports.addNetworkModeratorRole = addNetworkModeratorRole;
exports.setModeratorsPage = setModeratorsPage;
exports.setCommunitiesPage = setCommunitiesPage;
exports.autocompleteQuery = autocompleteQuery;
exports.fetchNetworkSettings = fetchNetworkSettings;
exports.updateNetworkSettings = updateNetworkSettings;
exports.fetchModerators = fetchModerators;
exports.orderFromSort = orderFromSort;
exports.fetchCommunities = fetchCommunities;
exports.removeCommunityFromNetwork = removeCommunityFromNetwork;
exports.removeNetworkModeratorRole = removeNetworkModeratorRole;

var _reduxOrm = __webpack_require__(0);

var _reselect = __webpack_require__(7);

var _models = __webpack_require__(2);

var _models2 = _interopRequireDefault(_models);

var _queryResults = __webpack_require__(8);

var _fp = __webpack_require__(1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MODULE_NAME = exports.MODULE_NAME = 'NetworkSettings';

// Constants
var ADD_COMMUNITY_TO_NETWORK = exports.ADD_COMMUNITY_TO_NETWORK = MODULE_NAME + '/ADD_COMMUNITY_TO_NETWORK';
var ADD_COMMUNITY_TO_NETWORK_PENDING = exports.ADD_COMMUNITY_TO_NETWORK_PENDING = ADD_COMMUNITY_TO_NETWORK + '_PENDING';
var ADD_NETWORK_MODERATOR_ROLE = exports.ADD_NETWORK_MODERATOR_ROLE = MODULE_NAME + '/ADD_NETWORK_MODERATOR_ROLE';
var ADD_NETWORK_MODERATOR_ROLE_PENDING = exports.ADD_NETWORK_MODERATOR_ROLE_PENDING = ADD_NETWORK_MODERATOR_ROLE + '_PENDING';
var FETCH_COMMUNITIES = exports.FETCH_COMMUNITIES = MODULE_NAME + '/FETCH_COMMUNITIES';
var FETCH_COMMUNITY_AUTOCOMPLETE = exports.FETCH_COMMUNITY_AUTOCOMPLETE = MODULE_NAME + '/FETCH_COMMUNITY_AUTOCOMPLETE';
var FETCH_MODERATOR_AUTOCOMPLETE = exports.FETCH_MODERATOR_AUTOCOMPLETE = MODULE_NAME + '/FETCH_MODERATOR_AUTOCOMPLETE';
var FETCH_MODERATORS = exports.FETCH_MODERATORS = MODULE_NAME + '/FETCH_MODERATORS';
var FETCH_NETWORK_SETTINGS = exports.FETCH_NETWORK_SETTINGS = MODULE_NAME + '/FETCH_NETWORK_SETTINGS';
var REMOVE_COMMUNITY_FROM_NETWORK = exports.REMOVE_COMMUNITY_FROM_NETWORK = MODULE_NAME + '/REMOVE_COMMUNITY_FROM_NETWORK';
var REMOVE_COMMUNITY_FROM_NETWORK_PENDING = exports.REMOVE_COMMUNITY_FROM_NETWORK_PENDING = REMOVE_COMMUNITY_FROM_NETWORK + '_PENDING';
var REMOVE_NETWORK_MODERATOR_ROLE = exports.REMOVE_NETWORK_MODERATOR_ROLE = MODULE_NAME + '/REMOVE_NETWORK_MODERATOR_ROLE';
var REMOVE_NETWORK_MODERATOR_ROLE_PENDING = exports.REMOVE_NETWORK_MODERATOR_ROLE_PENDING = REMOVE_NETWORK_MODERATOR_ROLE + '_PENDING';
var SET_COMMUNITIES_PAGE = exports.SET_COMMUNITIES_PAGE = MODULE_NAME + '/SET_COMMUNITIES_PAGE';
var SET_MODERATORS_PAGE = exports.SET_MODERATORS_PAGE = MODULE_NAME + '/SET_MODERATORS_PAGE';
var UPDATE_NETWORK_SETTINGS = exports.UPDATE_NETWORK_SETTINGS = MODULE_NAME + '/UPDATE_NETWORK_SETTINGS';

var AUTOCOMPLETE_SIZE = exports.AUTOCOMPLETE_SIZE = 20;
var PAGE_SIZE = exports.PAGE_SIZE = 1000;

var defaultState = {
  moderatorsPage: 0,
  communitiesPage: 0
};

function reducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultState;
  var action = arguments[1];
  var error = action.error,
      type = action.type,
      payload = action.payload;

  if (error) return state;

  switch (type) {
    case FETCH_MODERATOR_AUTOCOMPLETE:
      return Object.assign({}, state, {
        moderatorAutocomplete: payload.data.people.items
      });

    case FETCH_COMMUNITY_AUTOCOMPLETE:
      return Object.assign({}, state, {
        communityAutocomplete: payload.data.communities.items
      });

    case SET_MODERATORS_PAGE:
      return Object.assign({}, state, {
        moderatorsPage: payload
      });

    case SET_COMMUNITIES_PAGE:
      return Object.assign({}, state, {
        communitiesPage: payload
      });

    default:
      return state;
  }
}

function ormSessionReducer(_ref, _ref2) {
  var Network = _ref.Network,
      Community = _ref.Community,
      Person = _ref.Person;
  var meta = _ref2.meta,
      type = _ref2.type;

  if (type === REMOVE_COMMUNITY_FROM_NETWORK_PENDING) {
    if (Network.hasId(meta.networkId)) {
      var network = Network.withId(meta.networkId);
      network.update({
        communities: network.communities.toModelArray().filter(function (c) {
          return c.id !== meta.communityId;
        })
      });
    }
    if (Community.hasId(meta.communityId)) {
      var community = Community.withId(meta.communityId);
      community.update({ network: null });
    }
  }

  if (type === REMOVE_NETWORK_MODERATOR_ROLE_PENDING) {
    if (Network.hasId(meta.networkId)) {
      var _network = Network.withId(meta.networkId);
      _network.update({
        moderators: _network.moderators.toModelArray().filter(function (m) {
          return m.id !== meta.personId;
        })
      });
    }
  }

  if (type === ADD_NETWORK_MODERATOR_ROLE) {
    if (Network.hasId(meta.networkId)) {
      var person = Person.withId(meta.personId);
      Network.withId(meta.networkId).updateAppending({ moderators: [person] });
    }
  }

  if (type === ADD_COMMUNITY_TO_NETWORK) {
    if (Network.hasId(meta.networkId) && Community.hasId(meta.communityId)) {
      var _network2 = Network.withId(meta.networkId);
      var _community = Community.withId(meta.communityId);
      _network2.updateAppending({ communities: [_community] });
      _community.update({ network: _network2 });
    }
  }
}

// Action Creators

function addCommunityToNetwork(communityId, networkId) {
  return {
    type: ADD_COMMUNITY_TO_NETWORK,
    graphql: {
      query: 'mutation ($communityId: ID, $networkId: ID) {\n        addCommunityToNetwork(communityId: $communityId, networkId: $networkId) {\n          id\n          communities {\n            items {\n              id\n              name\n              slug\n              avatarUrl\n            }\n          }\n        }\n      }',
      variables: {
        communityId: communityId,
        networkId: networkId
      }
    },
    meta: {
      extractModel: [{
        modelName: 'Community',
        getRoot: (0, _fp.get)('addCommunityToNetwork.communities.items')
      }],
      networkId: networkId,
      communityId: communityId
    }
  };
}

function addNetworkModeratorRole(personId, networkId) {
  return {
    type: ADD_NETWORK_MODERATOR_ROLE,
    graphql: {
      query: 'mutation ($personId: ID, $networkId: ID) {\n        addNetworkModeratorRole(personId: $personId, networkId: $networkId) {\n          id\n          moderators {\n            items {\n              id\n              name\n              avatarUrl\n            }\n          }\n        }\n      }',
      variables: {
        personId: personId,
        networkId: networkId
      }
    },
    meta: {
      extractModel: [{
        modelName: 'Person',
        getRoot: (0, _fp.get)('addNetworkModeratorRole.moderators.items')
      }],
      networkId: networkId,
      personId: personId
    }
  };
}

function setModeratorsPage(page) {
  return {
    type: SET_MODERATORS_PAGE,
    payload: page
  };
}

function setCommunitiesPage(page) {
  return {
    type: SET_COMMUNITIES_PAGE,
    payload: page
  };
}

// If we do an extractModel off this, we likely end up with a large set of
// unnecessary entities in the front end (especially if user is admin).
// Better to just house them in the module's store temporarily (see reducer).
function autocompleteQuery(queryName, type) {
  return function (autocomplete) {
    var first = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : AUTOCOMPLETE_SIZE;
    var offset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    return {
      type: type,
      graphql: {
        query: 'query ($autocomplete: String, $first: Int, $offset: Int) {\n        ' + queryName + ' (autocomplete: $autocomplete, first: $first, offset: $offset) {\n          total\n          hasMore\n          items {\n            id\n            name\n            avatarUrl\n          }\n        }\n      }',
        variables: {
          autocomplete: autocomplete,
          first: first,
          offset: offset
        }
      }
    };
  };
}

var fetchModeratorAutocomplete = exports.fetchModeratorAutocomplete = autocompleteQuery('people', FETCH_MODERATOR_AUTOCOMPLETE);

var fetchCommunityAutocomplete = exports.fetchCommunityAutocomplete = autocompleteQuery('communities', FETCH_COMMUNITY_AUTOCOMPLETE);

function fetchNetworkSettings(slug) {
  var pageSize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : PAGE_SIZE;

  return {
    type: FETCH_NETWORK_SETTINGS,
    graphql: {
      query: 'query ($slug: String) {\n        network (slug: $slug) {\n          id\n          slug\n          name\n          description\n          avatarUrl\n          bannerUrl\n          createdAt\n          communities (first: ' + pageSize + ', sortBy: "name")  {\n            total\n            hasMore\n            items {\n              id\n              slug\n              name\n              avatarUrl\n            }\n          }\n          moderators (first: ' + pageSize + ', sortBy: "name") {\n            total\n            hasMore\n            items {\n              id\n              name\n              avatarUrl\n            }\n          }\n        }\n      }',
      variables: {
        slug: slug
      }
    },
    meta: {
      extractModel: 'Network',
      page: 0
    }
  };
}

function updateNetworkSettings(id, data) {
  return {
    type: UPDATE_NETWORK_SETTINGS,
    graphql: {
      query: 'mutation ($id: ID, $data: NetworkInput) {\n        updateNetwork(id: $id, data: $data) {\n          id\n        }\n      }',
      variables: {
        id: id, data: data
      }
    },
    meta: {
      id: id,
      data: data,
      optimistic: true
    }
  };
}

function fetchModerators(slug, page) {
  var offset = page * PAGE_SIZE;
  return {
    type: FETCH_MODERATORS,
    graphql: {
      query: 'query ($slug: String, $offset: Int) {\n        network (slug: $slug) {\n          id\n          moderators (first: ' + PAGE_SIZE + ', sortBy: "name", offset: $offset) {\n            total\n            hasMore\n            items {\n              id\n              name\n              avatarUrl\n            }\n          }\n        }\n      }',
      variables: {
        slug: slug,
        offset: offset
      }
    },
    meta: {
      extractModel: 'Network',
      // we use page for the queryResults reducer
      page: page
    }
  };
}

function orderFromSort(sortBy) {
  if (sortBy === 'name') return 'asc';
  return 'desc';
}

function fetchCommunities(_ref3) {
  var slug = _ref3.slug,
      page = _ref3.page,
      offset = _ref3.offset,
      _ref3$sortBy = _ref3.sortBy,
      sortBy = _ref3$sortBy === undefined ? 'name' : _ref3$sortBy,
      order = _ref3.order,
      search = _ref3.search,
      _ref3$pageSize = _ref3.pageSize,
      pageSize = _ref3$pageSize === undefined ? PAGE_SIZE : _ref3$pageSize;

  offset = offset || page * pageSize;
  order = order || orderFromSort(sortBy);
  return {
    type: FETCH_COMMUNITIES,
    graphql: {
      query: 'query ($slug: String, $offset: Int, $sortBy: String, $order: String, $search: String) {\n        network (slug: $slug) {\n          id\n          communities (first: ' + pageSize + ', sortBy: $sortBy, order: $order, offset: $offset, search: $search) {\n            total\n            hasMore\n            items {\n              id\n              name\n              slug\n              avatarUrl\n            }\n          }\n        }\n      }',
      variables: {
        slug: slug,
        offset: offset,
        sortBy: sortBy,
        order: order,
        search: search
      }
    },
    meta: {
      extractModel: 'Network',
      // we use page for the queryResults reducer
      page: page
    }
  };
}

function removeCommunityFromNetwork(communityId, networkId) {
  var pageSize = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : PAGE_SIZE;

  return {
    type: REMOVE_COMMUNITY_FROM_NETWORK,
    graphql: {
      query: 'mutation ($communityId: ID, $networkId: ID) {\n        removeCommunityFromNetwork(communityId: $communityId, networkId: $networkId) {\n          id\n          communities (first: ' + pageSize + ') {\n            items {\n              id\n              name\n              slug\n              avatarUrl\n            }\n          }\n        }\n      }',
      variables: {
        communityId: communityId,
        networkId: networkId
      }
    },
    meta: {
      communityId: communityId,
      extractModel: 'Network',
      networkId: networkId
    }
  };
}

function removeNetworkModeratorRole(personId, networkId) {
  return {
    type: REMOVE_NETWORK_MODERATOR_ROLE,
    graphql: {
      query: 'mutation ($personId: ID, $networkId: ID) {\n        removeNetworkModeratorRole(personId: $personId, networkId: $networkId) {\n          id\n          moderators {\n            items {\n              id\n              name\n              avatarUrl\n            }\n          }\n        }\n      }',
      variables: {
        personId: personId,
        networkId: networkId
      }
    },
    meta: {
      extractModel: 'Network',
      personId: personId,
      networkId: networkId
    }
  };
}

// Selectors
var getNetwork = exports.getNetwork = (0, _reduxOrm.createSelector)(_models2.default, function (state) {
  return state.orm;
}, function (state, _ref4) {
  var slug = _ref4.slug;
  return slug;
}, function (session, slug) {
  var network = session.Network.safeGet({ slug: slug });
  if (network) {
    return Object.assign({}, network.ref, {
      communities: network.communities.orderBy(function (c) {
        return c.name;
      }).toModelArray(),
      moderators: network.moderators.orderBy(function (m) {
        return m.name;
      }).toModelArray()
    });
  }
  return null;
});

var getModeratorResults = exports.getModeratorResults = (0, _queryResults.makeGetQueryResults)(FETCH_MODERATORS);
var getModeratorsTotal = exports.getModeratorsTotal = (0, _reselect.createSelector)(getModeratorResults, (0, _fp.get)('total'));

var getModerators = exports.getModerators = (0, _queryResults.makeQueryResultsModelSelector)(getModeratorResults, 'Person');

var getCommunitiesResults = exports.getCommunitiesResults = (0, _queryResults.makeGetQueryResults)(FETCH_COMMUNITIES);
var getCommunitiesTotal = exports.getCommunitiesTotal = (0, _reselect.createSelector)(getCommunitiesResults, (0, _fp.get)('total'));
var getCommunitiesHasMore = exports.getCommunitiesHasMore = (0, _reselect.createSelector)(getCommunitiesResults, (0, _fp.get)('hasMore'));

var getCommunities = exports.getCommunities = (0, _reduxOrm.createSelector)(_models2.default, function (state) {
  return state.orm;
}, getCommunitiesResults, function (session, results) {
  if ((0, _fp.isEmpty)(results) || (0, _fp.isEmpty)(results.ids)) return [];
  return session.Community.all().filter(function (x) {
    return (0, _fp.includes)(x.id, results.ids);
  }).orderBy(function (x) {
    return results.ids.indexOf(x.id);
  }).toModelArray();
});

var getCommunitiesPage = exports.getCommunitiesPage = function getCommunitiesPage(state) {
  return state[MODULE_NAME].communitiesPage;
};
var getModeratorsPage = exports.getModeratorsPage = function getModeratorsPage(state) {
  return state[MODULE_NAME].moderatorsPage;
};
var getCommunityAutocomplete = exports.getCommunityAutocomplete = function getCommunityAutocomplete(state) {
  return state[MODULE_NAME].communityAutocomplete;
};
var getModeratorAutocomplete = exports.getModeratorAutocomplete = function getModeratorAutocomplete(state) {
  return state[MODULE_NAME].moderatorAutocomplete;
};

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCommunity = exports.PIN_POST_PENDING = exports.PIN_POST = exports.REMOVE_POST_PENDING = exports.REMOVE_POST = exports.DELETE_POST_PENDING = exports.DELETE_POST = exports.MODULE_NAME = undefined;
exports.deletePost = deletePost;
exports.removePost = removePost;
exports.pinPost = pinPost;
exports.ormSessionReducer = ormSessionReducer;

var _models = __webpack_require__(2);

var _models2 = _interopRequireDefault(_models);

var _reduxOrm = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MODULE_NAME = exports.MODULE_NAME = 'PostHeader';

// Constants
var DELETE_POST = exports.DELETE_POST = MODULE_NAME + '/DELETE_POST';
var DELETE_POST_PENDING = exports.DELETE_POST_PENDING = DELETE_POST + '_PENDING';
var REMOVE_POST = exports.REMOVE_POST = MODULE_NAME + '/REMOVE_POST';
var REMOVE_POST_PENDING = exports.REMOVE_POST_PENDING = REMOVE_POST + '_PENDING';
var PIN_POST = exports.PIN_POST = MODULE_NAME + '/PIN_POST';
var PIN_POST_PENDING = exports.PIN_POST_PENDING = PIN_POST + '_PENDING';

// Action Creators
function deletePost(id) {
  return {
    type: DELETE_POST,
    graphql: {
      query: 'mutation ($id: ID) {\n        deletePost(id: $id) {\n          success\n        }\n      }',
      variables: {
        id: id
      }
    },
    meta: {
      optimistic: true,
      id: id
    }
  };
}

function removePost(postId, slug) {
  return {
    type: REMOVE_POST,
    graphql: {
      query: 'mutation ($postId: ID, $slug: String) {\n        removePost(postId: $postId, slug: $slug) {\n          success\n        }\n      }',
      variables: {
        postId: postId,
        slug: slug
      }
    },
    meta: {
      optimistic: true,
      postId: postId,
      slug: slug
    }
  };
}

function pinPost(postId, communityId) {
  return {
    type: PIN_POST,
    graphql: {
      query: 'mutation ($postId: ID, $communityId: ID) {\n        pinPost(postId: $postId, communityId: $communityId) {\n          success\n        }\n      }',
      variables: {
        postId: postId,
        communityId: communityId
      }
    },
    meta: {
      optimistic: true,
      postId: postId,
      communityId: communityId
    }
  };
}

var getCommunity = exports.getCommunity = (0, _reduxOrm.createSelector)(_models2.default, function (state) {
  return state.orm;
}, function (_, _ref) {
  var slug = _ref.slug;
  return slug;
}, function (session, slug) {
  return session.Community.safeGet({ slug: slug });
});

function ormSessionReducer(_ref2, _ref3) {
  var Post = _ref2.Post;
  var type = _ref3.type,
      meta = _ref3.meta;

  var post;
  switch (type) {
    case DELETE_POST_PENDING:
      Post.withId(meta.id).delete();
      break;

    case REMOVE_POST_PENDING:
      post = Post.withId(meta.postId);
      var communities = post.communities.filter(function (c) {
        return c.slug !== meta.slug;
      }).toModelArray();
      post.update({ communities: communities });
      break;

    case PIN_POST_PENDING:
      post = Post.withId(meta.postId);
      // this line is to clear the selector memoization
      post.update({ _invalidate: (post._invalidate || 0) + 1 });
      var postMembership = post.postMemberships.filter(function (p) {
        return Number(p.community) === Number(meta.communityId);
      }).toModelArray()[0];
      postMembership && postMembership.update({ pinned: !postMembership.pinned });
  }
}

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.receiveMessage = receiveMessage;
exports.receiveComment = receiveComment;
exports.receiveThread = receiveThread;
exports.receivePost = receivePost;
exports.receiveNotification = receiveNotification;
exports.ormSessionReducer = ormSessionReducer;
var MODULE_NAME = 'SocketListener';
var RECEIVE_MESSAGE = exports.RECEIVE_MESSAGE = MODULE_NAME + '/RECEIVE_MESSAGE';
var RECEIVE_COMMENT = exports.RECEIVE_COMMENT = MODULE_NAME + '/RECEIVE_COMMENT';
var RECEIVE_POST = exports.RECEIVE_POST = MODULE_NAME + '/RECEIVE_POST';
var RECEIVE_THREAD = exports.RECEIVE_THREAD = MODULE_NAME + '/RECEIVE_THREAD';
var RECEIVE_NOTIFICATION = exports.RECEIVE_NOTIFICATION = MODULE_NAME + '/RECEIVE_NOTIFICATION';

function receiveMessage(message) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  return {
    type: RECEIVE_MESSAGE,
    payload: {
      data: {
        message: message
      }
    },
    meta: {
      extractModel: 'Message',
      bumpUnreadCount: opts.bumpUnreadCount
    }
  };
}

function receiveComment(comment) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  return {
    type: RECEIVE_COMMENT,
    payload: {
      data: {
        comment: comment
      }
    },
    meta: {
      extractModel: 'Comment'
    }
  };
}

function receiveThread(thread) {
  return {
    type: RECEIVE_THREAD,
    payload: {
      data: {
        thread: thread
      }
    },
    meta: {
      extractModel: 'MessageThread'
    }
  };
}

function receivePost(data, communityId) {
  return {
    type: RECEIVE_POST,
    payload: {
      topics: data.tags,
      creatorId: data.creatorId,
      communityId: communityId
    }
  };
}

function receiveNotification(notification) {
  return {
    type: RECEIVE_NOTIFICATION,
    payload: {
      data: {
        notification: notification
      }
    },
    meta: {
      extractModel: 'Notification'
    }
  };
}

function ormSessionReducer(session, _ref) {
  var meta = _ref.meta,
      type = _ref.type,
      payload = _ref.payload;
  var MessageThread = session.MessageThread,
      Membership = session.Membership,
      CommunityTopic = session.CommunityTopic,
      Me = session.Me;

  var currentUser = void 0;

  switch (type) {
    case RECEIVE_MESSAGE:
      var id = payload.data.message.messageThread;
      if (!MessageThread.hasId(id)) {
        MessageThread.create({
          id: id,
          updatedAt: new Date().toString(),
          lastReadAt: 0,
          unreadCount: 0
        });
      }
      MessageThread.withId(id).newMessageReceived(meta.bumpUnreadCount);
      break;

    case RECEIVE_POST:
      currentUser = Me.first();
      if (currentUser && payload.creatorId !== currentUser.id) {
        var increment = function increment(obj) {
          return obj && obj.update({
            newPostCount: (obj.newPostCount || 0) + 1
          });
        };

        payload.topics.forEach(function (topicId) {
          increment(CommunityTopic.safeGet({
            topic: topicId, community: payload.communityId
          }));
        });

        increment(Membership.filter(function (m) {
          return !m.person && m.community === payload.communityId;
        }).first());
      }
      break;

    case RECEIVE_NOTIFICATION:
      currentUser = Me.first();
      currentUser.update({
        newNotificationCount: currentUser.newNotificationCount + 1
      });
      break;
  }
}

/***/ }),
/* 50 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = seedCommunities;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash_fp__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash_fp___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_lodash_fp__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__api__ = __webpack_require__(4);
/* global MEMBER_COUNT */





async function seedCommunities (page, userBatch) {
  const api = Object(__WEBPACK_IMPORTED_MODULE_1__api__["a" /* default */])(page)

  // Only use communities with an ID
  const communities = userBatch.reduce((acc, user) => {
    if (user.community.id) {
      return [ ...acc, user.community ]
    }
    return acc
  }, [])

  for (let community of communities) {
    process.stdout.write(`\n  Adding members to ${community.name}...`)
    const members = Object(__WEBPACK_IMPORTED_MODULE_0_lodash_fp__["sampleSize"])(5, userBatch)

    for (let member of members) {
      // Don't add if they're the owner
      if (community.id === member.community.id) continue

      // This one isn't in the front-end yet, exposed as an admin-only mutation
      // on the server.
      const mutation = {
        graphql: {
          query: `mutation { 
            addMemberToCommunity (personId: ${member.id}, communityId: ${community.id}) {
              community {
                id
              }
            }
          }`
        }
      }
      const membership = await api.graphql(mutation)
      if (!member.memberships) member.memberships = []
      member.memberships.push(membership.data.addMemberToCommunity.community.id)
    }
    process.stdout.write(' ✓')
  }

  // Don't let anyone through without being a member of at least one community:
  // if they don't have any, add 'em to the first one, usually test-community.
  userBatch
    .filter(u => !u.memberships)
    .forEach(u => { u.memberships = [ communities[0].id ] })
}


/***/ }),
/* 51 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = seedPosts;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_faker__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_faker___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_faker__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__api__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_components_PostEditor_PostEditor_store__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_components_PostEditor_PostEditor_store___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_components_PostEditor_PostEditor_store__);
/* global POST_COUNT */





async function seedPosts (page, userBatch) {
  const api = Object(__WEBPACK_IMPORTED_MODULE_1__api__["a" /* default */])(page)

  // Only use communities with an ID
  const communities = userBatch.reduce((acc, user) => {
    if (user.community.id) {
      return [ ...acc, user.community ]
    }
    return acc
  }, [])

  const posts = []
  for (let community of communities) {
    process.stdout.write(`\n  Adding posts to ${community.name}...`)
    const members = userBatch.reduce((acc, user) => {
      if (user.memberships.includes(community.id) || user.community.id === community.id) {
        return [ ...acc, user ]
      }
      return acc
    }, [])

    // This is slow, with a lot of logging in and out, but it means no two posts
    // from each user are adjacent. Shame there's no easy way to fake the
    // timestamps though...
    for (let i = 0; i < 3; i++) {
      for (let member of members) {
        // Let the login dance begin!
        await api.request('/noo/login', member)
        const post = await api.graphql(Object(__WEBPACK_IMPORTED_MODULE_2_components_PostEditor_PostEditor_store__["createPost"])({
          type: 'discussion',
          title: __WEBPACK_IMPORTED_MODULE_0_faker___default.a.lorem.sentence(),
          details: __WEBPACK_IMPORTED_MODULE_0_faker___default.a.lorem.paragraph(),
          communities: [ community ]
        }))
        if (!post.errors) {
          posts.push(post)
        }
        await api.logout()
      }
    }

    process.stdout.write(' ✓')
  }

  return posts
}


/***/ }),
/* 52 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = users;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_faker__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_faker___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_faker__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash_fp__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash_fp___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_lodash_fp__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__api__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__utils__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_routes_Signup_AddSkills_AddSkills_store__ = __webpack_require__(53);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_routes_Signup_AddSkills_AddSkills_store___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_routes_Signup_AddSkills_AddSkills_store__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_routes_CreateCommunity_Review_Review_store__ = __webpack_require__(54);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_routes_CreateCommunity_Review_Review_store___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_routes_CreateCommunity_Review_Review_store__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_store_actions_updateUserSettings__ = __webpack_require__(55);
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
    skills: [ ...new Array(Object(__WEBPACK_IMPORTED_MODULE_3__utils__["d" /* oneTo */])(5)) ].map(__WEBPACK_IMPORTED_MODULE_0_faker___default.a.hacker.ingverb),
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
    process.stdout.write('\n  Creating user, logging in, ')
    await api.request('/noo/user', user)

    process.stdout.write('faking data, ')
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

    process.stdout.write('skills, ')
    for (let skill of user.skills || []) {
      await api.graphql(Object(__WEBPACK_IMPORTED_MODULE_4_routes_Signup_AddSkills_AddSkills_store__["addSkill"])(skill))
    }

    if (Math.random() < 0.3 || user.email.endsWith('@hylo.com')) {
      process.stdout.write('community, ')
      const community = await api.graphql(Object(__WEBPACK_IMPORTED_MODULE_5_routes_CreateCommunity_Review_Review_store__["createCommunity"])(user.community.name, user.community.slug))
      user.community.id = community.data.createCommunity.community.id
    }

    process.stdout.write('logging out. ✓')
    await api.logout()
  }

  return userBatch
}


/***/ }),
/* 53 */
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
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getNetwork = exports.CREATE_COMMUNITY = exports.MODULE_NAME = undefined;
exports.createCommunity = createCommunity;

var _models = __webpack_require__(2);

var _models2 = _interopRequireDefault(_models);

var _reduxOrm = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MODULE_NAME = exports.MODULE_NAME = 'Review';
var CREATE_COMMUNITY = exports.CREATE_COMMUNITY = MODULE_NAME + '/CREATE_COMMUNITY';

function createCommunity(name, slug, networkId) {
  var data = {
    name: name,
    slug: slug
  };

  if (networkId) {
    data.networkId = networkId;
  }

  return {
    type: CREATE_COMMUNITY,
    graphql: {
      query: 'mutation ($data: CommunityInput) {\n        createCommunity(data: $data) {\n          id\n          hasModeratorRole\n          community {\n            id\n            name\n            slug\n            network {\n              id\n            }\n          }\n        }\n      }\n      ',
      variables: {
        data: data
      }
    },
    meta: Object.assign({
      extractModel: 'Membership'
    }, data)
  };
}

var getNetwork = exports.getNetwork = (0, _reduxOrm.createSelector)(_models2.default, function (state) {
  return state.orm;
}, function (state, _ref) {
  var networkId = _ref.networkId;
  return networkId;
}, function (session, networkId) {
  var network = session.Network.safeGet({ id: networkId });
  if (network) {
    return network;
  }
  return null;
});

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateUserSettings = updateUserSettings;

var _constants = __webpack_require__(6);

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

/***/ })
/******/ ]);