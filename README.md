# hylo-evo

## Getting Started

1. `git clone git@github.com:Hylozoic/hylo-evo.git`
2. `cd hylo-evo`

### Using the default Hylo Staging API configuration

  * From the root of the project run: `cp .env.staging .env`

## Running local:

1. `yarn install`
2. `yarn start`

## Running using Docker:

1. Build the docker container: `docker build -t hylo-evo-docker .`
2. Run the docker container: 
~~~
docker run -it \
  -v ${PWD}:/usr/src/app \
  -v /usr/src/app/node_modules \
  -p 9000:9000 \
  --rm \
  hylo-evo-docker`
~~~

## Further documentation

So long as this repo remains private, remaining docs are available in [Confluence](https://hylozoic.atlassian.net/wiki/spaces/DEV/pages/87195649/Web+Client).
