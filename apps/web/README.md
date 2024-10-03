# hylo-evo

## Getting Started

1. `git clone git@github.com:Hylozoic/hylo-evo.git`
2. `cd hylo-evo`
3. Setup your .env file by copying `.env.example` to `.env`. You will need to ask a Hylo dev team member for API keys or tokens for Filepicker, Intercom, MapBox and Mixpanel as needed.

## Running local:

1. `yarn install`
2. `yarn dev`
3. Setup [hylo-node](https://github.com/Hylozoic/hylo-node) and run that locally as well.
4. Run hylo-node

## Building for standard Hylo API deployment

1. Run `yarn build`
2. Once complete Hylo is ready to be served at `<projectRoot>/build`

## Develop with SSL locally

1. Create a local certificate and make sure your computer trusts it. Here are some up to date instructions for macOS: https://deliciousbrains.com/ssl-certificate-authority-for-local-https-development/
2. Create a directory `config/ssl` and copy the .crt, key and .pem (CA certificate) files you generated above to it. Make sure they all have the same filename e.g. localhost.crt, localhost.key and localhost.pem
3. Update your `.env` with:

```
HTTPS=true
LOCAL_CERT=localhost (this should be the root filename used for your certificate files above)

API_HOST=https://localhost:3001
SOCKET_HOST=https://localhost:3001
```
## Contributions and Code of Conduct

Please review our [Contribution Guide](CONTRIBUTING.md) and [Code of Conduct](CODE_OF_CONDUCT.md) to step into co-creative stewardship with us.
## Data fetching and storage

The application's series of Redux middlewares take care of *MOST* of the data fetching for the application. Data fetching side-effects are triggered by dispatching specific redux actions, as with most redux setups. Instead of custom or specific request handlers, however, Evo uses a series of middleware handlers to handle all fetching to the platform backend. These actions conform to the flux-standard-action pattern, with some additions to handle the application's edge cases.

[The order of these middlewares matters](https://github.com/Hylozoic/hylo-evo/blob/dev/src/store/middleware/index.js). In sequence, actions will pass through the middlewares, with each checking for certain properties, conditionally triggering a side-effect (editing the action, firing off another action, making a request, etc) and then passing the action down the sequence via the `next` call.
- The graphql middleware mutates any graphql action to format it for an API call.
- The api middleware makes any api fetch requests to the backend, as specified by the `api` property on the action, and adds the fetch requests `promise` return value to the `payload` property of the action.
- The error middleware checks for any errors thrown by the other middleware
- The 'optimistic' middleware optimistically updates the local store for edited or created data while the application waits for the data to be saved in the backend
- The 'pending' middleware spots any payloads with a `promise` and then dispatches a `_PENDING` version of that action, so that the rest of the application knows there is async data loading occuring
- The 'promise' middleware checks for any payloads with a `promise` and then will dispatch a copy of that action based on whether the promise is resolved or rejected. It also returns a separate promise to the caller function, so that the caller can act specifically on the resolution of the async activity

And how does the data end up in the store? Evo has many redux-ORM models for its entities, defined and hooked into the main reducer (which is obviously also having all the actions pass through it). When an `api` fetch is returned, and its promise resolves, there is both a promise returned to the original caller (so it has direct access to the api response) and an cloned-from-the-original action dispatched with the response payload attached. When this last action hits the reducer, if the original action also included a `meta.extractModel` property, it will be picked up by [the ormReducer](https://github.com/Hylozoic/hylo-evo/blob/d3dc9a0ac336242b35187701388ec364b3213338/src/store/reducers/ormReducer/index.js#L104) and inserted into the local store.

So to recap, if you want to interact with the backend and ensure some data is available to a part of the application, you need to dispatch an action that:
- has a graphql query attached to it (or in rare cases, just a appropriate `api` property attached)
- has an appropriate `meta.modelExtractor`
- optionally includes a `meta.optimistic === true` property if you want to optimisitically update the local store

### Non-logged in Routing
For users that are not logged in can see public posts and groups via routes like

`/groups/:groupSlug` => Group Detail view
`/public/groups` => Group Explorer
`/post/:postId` => Post Detail
`/public/map` => Map Explorer (public)

`/groups/:groupSlug/:view/post/:postId` => `/post/:postId`
`/public/post/:postId` => `/post/:postId`

### Translations
We use i18next to handle translations of platform strings (no translations of user content at this time).

The `i18next-extract` config details in the `babel.config.cjs` file determines how all language keys are extracted and what languages are supported. Whenever babel runs, it will comb the entire repo for js/jsx files, and anytime it finds a t('example-key') function, it will pull every key into each of the translation files. It is disabled in the babel.config by default: when it runs, it generates keys for missing translations. It also sometimes overwrites newly added translations, causing a lot of finicky editing if its on by default. When you add a new translation, uncomment the config, restart webpack (yarn start)  and it should pick up the key for every locale file.

If using vscode, there is a really fantastic extension for working with i18n; [i18n-ally](https://github.com/lokalise/i18n-ally)
They have a 8 minute setup and feature [demo video](https://www.youtube.com/watch?v=kowM-MoGVns).


### Sockets

Chat, in-app notifications and comments use sockets to update users in real-time. In the future, new posts will also use sockets to show up in real-time.

### Data access via Redux

Much of the application still uses Class Components (As of 2022/01/18). Thus to access data, we still rely on the Redux patterns of `mapStateToProps`, `mapDispatchToProps` and using `connect` from the React-Redux library. However, increasingly we are adding and switching components to Function Components, that rely on React Hooks to manage their state, and in turn, combinations of `useSelector` and `useDispatch` from React-Redux. A new pattern being introduced for the application is the addition of `useEnsureX`, which is a custom hook that handles both selecting `X` from the store and, if it isn't present, also handles the fetching of that data.
