# hylo-evo

So long as this repo remains private, the docs are in [Confluence](https://hylozoic.atlassian.net/wiki/spaces/DEV/pages/87195649/Web+Client).

---

## Docker setup

* Currently package.json#proxy is tied-to staging API URL.

~~~~
git clone git@github.com:Hylozoic/hylo-evo.git
docker build -t hylo-evo-docker .
docker run -it \
  -v ${PWD}:/usr/src/app \
  -v /usr/src/app/node_modules \
  -p 9000:9000 \
  --rm \
  hylo-evo-docker
~~~~

To get a command shell on the container

1. Add `--name hylo-evo-docker \` to `docker run` command above
2. Run `docker container run --rm -it hylo-evo-docker bash`
