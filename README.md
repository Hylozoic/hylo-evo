# hylo-evo

So long as this repo remains private, the docs are in [Confluence](https://hylozoic.atlassian.net/wiki/spaces/DEV/pages/87195649/Web+Client).

---

## Docker setup:

* Currently package.json#proxy is tied-to staging API URL.

~~~~
git clone git@github.com:Hylozoic/hylo-evo.git
docker build -t hylo-evo-docker .
docker run -it \
  --name hylo-evo-docker \
  -v ${PWD}:/usr/src/app \
  -v /usr/src/app/node_modules \
  -p 9000:9000 \
  --rm \
  hylo-evo-docker
~~~~

also to get into the shell for the container:

`docker container run --rm -it hylo-evo-docker bash`