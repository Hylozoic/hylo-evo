# HyloShared - Hylo shared modules

The purpose of this library is the sharing of critical code between the Hylo Web and Mobile front-ends and the backend. A primary focus at this time is text handling to ensure consistency of storage and presentation across the apps.

## For Development

1. Edit code in `src/` and build using `yarn build` (or `yarn start` to continuously build)
2. `yarn test` to run tests
3. To test changes in a project run `yarn link` in the root of this project, then in the root of the target project (e.g. `hylo-evo` or `HyloReactNative`) run `yarn link hylo-shared`. Your changes should now be available within that project wherever you've imported this library. 

## For Release

1. Run tests and make sure they're all passing: `yarn test`
2. Run `yarn build` 
3. Commit changes and `git push`
4. Run `npm version <patch|minor|major>`. **⚠️ patch versions should never have breaking changes from previous version**
5. Run `git push --tags` to push the version tags to the origin
6. Run `npm publish` to publish this new version to the NPM registry. This should be published under the `hylodevs` NPM account (see password manager for needed credentials)
7. Update dependency pinned version in all related projects
