### routing
- URL and history routing is exclusively done through use of React Router (see documentation here)[https://v5.reactrouter.com/web/guides/quick-start] and all components that handle routes are under the `src/routes` directory (there may be a few small exceptions)
- All routes are passed through `RootRouter` which if not-authorized renders either `NonAuthLayoutRouter` or `PublicLayoutRouter` components, and `AuthLayoutRouter` when authorized. Each of these top-level *layout routers* (meaning they render multiple routes in a layout on the page) include many sub-routes and child routers contained either at the root or within subdirectories under `src/routes`
- Key layout aspects of the `AuthLayoutRouter` include:
    - `Drawer` which renders navigating to move betwee your groups, etc
    - `TopNav` which renders the top bar, Drawer toggle, user settings, search, etc)
    - `Navigation` which renders context-specific navigation (i.e. current group)
    - `div.center` which contains routes which match to the appropriate components to render the central content of the page
