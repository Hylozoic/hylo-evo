# hylo-evo

## Getting Started

1. `git clone git@github.com:Hylozoic/hylo-evo.git`
2. `cd hylo-evo`

## Running local:

1. `yarn install`
2. `yarn start`
3. Setup [hylo-node](https://github.com/Hylozoic/hylo-node) and run that locally as well.
4. Run hylo-node

## Building for standard Hylo API deployment

1. Run `yarn build`
2. Once complete Hylo is ready to be served at `<projectRoot>/build`

## Build with the Storybook

1. A storybook as been added to the project, yay!
2. Almost no components have been added, que triste!
3. If you are building a new UI component, please add :)
4. Run the storybook with `yarn storybook`

## Develop with SSL locally

1. Create a local certificate and make sure your computer trusts it. Here are some up to date instructions for macOS: https://deliciousbrains.com/ssl-certificate-authority-for-local-https-development/
2. Create a directory `config/ssl` and copy the .crt, key and .pem (CA certificate) files you generated above to it. Make sure they all have the same filename e.g. localhost.crt, localhost.key and localhost.pem
3. Update your `.env` with:

```
HTTPS=true
LOCAL_CERT=localhost (this should be the root filename used for your certificate files above)
```

## Further documentation

So long as this repo remains private, remaining docs are available in [Confluence](https://hylozoic.atlassian.net/wiki/spaces/DEV/pages/87195649/Web+Client).
