# hylo-evo

## Getting Started

## This setup uses Docker and relies upon the Hylo Staging API

1. `git clone git@github.com:Hylozoic/hylo-evo.git`
2. `cd hylo-evo`
3. Make the following two file changes:
  * `cp .env.staging .env`
  * Change last line of `package.json` from `"proxy": "http://localhost:3001"` to `"proxy": "https://api-staging.hylo.com"`
3. Build the docker container: `docker build -t hylo-evo-docker .`
4. Run the docker container: 
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
