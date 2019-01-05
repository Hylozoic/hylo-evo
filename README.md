# hylo-evo

So long as this repo remains private, the docs are in [Confluence](https://hylozoic.atlassian.net/wiki/spaces/DEV/pages/87195649/Web+Client).

---

## Docker setup:

* Currently package.json#proxy is tied-to staging API URL.

~~~~
docker build -t hylo-evo-docker .
docker run -it \
  -v ${PWD}:/usr/src/app \
  -v /usr/src/app/node_modules \
  -p 9000:9000 \
  --rm \
  hylo-evo-docker
~~~~