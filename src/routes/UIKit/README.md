# Hylo UI Kit

A living stylesheet derived from the mock-ups for hylo-app.

## What you need to know

* We are using React CSS Modules, optional global styles, SASS and Bootstrap as our basic CSS "stack" (see below for more detail)
* Look at the components in the "pod" pattern in this project to see examples of how to apply a React CSS Module stylesheet to a component
* Apply module styles using styleName ``<div styleName='myStyle'></div>`` and global and Bootstrap styles to className (as always)

## Stylesheet guidelines

* CSS selector naming: use this camelCase modified [BEM](http://getbem.com) style, strict in anything global or shared (so anything kept in css), in CSS modules it can be loose but it is strongly advised to stay with the convention there too:

  ``myBlock-myElement—-myModifier``

* Start local: All new CSS probably starts in a module and is later extracted to globals. Learn about CSS Module "composition" ("composes: ...") and apply this where appropriate.

* Sizing and spacing: Use the defined REM-based spacing units for all margins, padding, height and width attributes. See ``src/css/_variables.scss`` and ``src/hylo-app/css/_variables.scss``. _If it's a size (2px, 1rem, etc), it should probably be a variable reference or soon to become one._

* Know the variables: New variables or mixins are added within ``src/css/_variables.scss``. We will break this into smaller files if need be at some point for clarity, but for now let's accumulate them here. Be very thoughtful about any spacing/sizing variables and try and work with what has been set up already, we're trying to catalyze as simple and consistent of system as possible.

* Use SASS nesting for convienance and clarity when constructing proper BEM named classes for anything global, don't nest actual selectors. (It's good to do this also within Component CSS Module stylesheets for the sake of consistency, but in no way critical):

````
// Good:
.myClass {
  &-myThingInThisClass {
    // this results in myClass-myThingInThisClass
    // which would be applied as styleName='myClass myClass-myThingInThisClass'
  }
  &--red {
    // this results in myClass--red
    // which would be applied as styleName='myClass myClass-red'
  }
}

// Bad:
.myClass {
  &.myThingInThisClass {}
  &.red {}
}
````

##### ...and also:

* Bootstrap Layout: We're planning to use Bootstrap Layout and Grid classes for the overarching site layout to ensure the best practice and most versatile responsive layout options:
[Bootstrap Layout](http://v4-alpha.getbootstrap.com/layout/grid)

* Bootstrap Flexbox: Consider utilizing Bootstrap Flexbox utility classes for the sake of simplicity and standardization of our application of Flexbox: [Bootstrap Flexbox utilities](https://v4-alpha.getbootstrap.com/utilities/flexbox/)

* Bootstrap Spacing: Get familiar with and consider using Bootstrap Spacing utilities for at least an initial pass when building a component. The Bootstrap spacing units are configured to map to our base unit of 0.25rem. These can be pretty helpful as at least an intermediate way of layout out a component:
[Bootstrap 4 Spacing utilities](https://v4-alpha.getbootstrap.com/utilities/spacing)

## Our CSS "Stack"

- [babel-plugin-react-css-modules](https://github.com/gajus/babel-plugin-react-css-modules)
- [SASS](http://sass-lang.com/) used for all variables and mixins at this stage (it is required for Bootstrap 4 either way)
- [Bootstrap v4.0 alpha 6 (final alpha release)](https://v4-alpha.getbootstrap.com) configured to match our spacing requirements and to include only the following modules:
  - Core variables and mixins
    - variables
    - mixins
  - Reset and dependencies
    - normalize
    - print
  - Core CSS
    - reboot
    - type
    - images
    - code
    - grid
    - tables
    - forms
    - buttons
  - Components (TBD)
    - card (currently used in OfferCard experiment)
  - Utility classes
    - utilities
- [PostCSS](https://github.com/postcss/postcss) there are many things we can do with PostCSS but currently we're only using it to plug-in CSSNext which gives access to all actual and pending CSS 3 and 4 spec features:
  - [postcss-cssnext](http://cssnext.io/)

---

## Webpack

** NOTE: configuration for production build ``config/webpack.config.prod.js`` is currently out of date

#### CSS Loaders Explanation (just FYI)
* **sass-resources** makes SASS variables from designated files available. Currently ``src/css/_variables.scss`` and ``src/css/hylo-app/_variables.scss`` (see "sassResources" in webpack config)
* **sass** compiles CSS from SASS files
* **postcss** does all the post css things (see "postcss" in webpack config)
* **css** resolves paths in CSS and adds assets as dependencies
* **style** turns CSS either into a file or a style tag:
  - in prod, a single bundle.css file is generated
  - in dev "style" tags are created in header to enables easy in-browser editing of CSS

---

## WIP: Creating new component guidelines

* Create components as:

    MyComponent.js
    MyComponent.test.js
    MyComponent.connector.js
    MyComponent.connector.test.js
    MyComponent.css

    _or as a pod_

    MyComponent/component.js
    MyComponent/component.test.js    
    MyComponent/component.css
    MyComponent/connector.js
    MyComponent/connector.test.js
    MyComponent/index.js

    _(or as a pod in this format -- TBD)_

    MyComponent/MyComponent.js
    MyComponent/MyComponent.test.js
    MyComponent/MyComponent.connector.js
    MyComponent/MyComponent.connector.test.js
    MyComponent/MyComponent.css
    MyComponent/index.js

* Use a pod if:
  * The component is Redux connected (for clear separation and testability of connection related functions found)
  * The component has child components with their own stylesheets
