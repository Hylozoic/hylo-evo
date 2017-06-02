# hylo-evo

## A note on SOCKET_HOST

If you don't set `SOCKET_HOST`, you will be sad that some things do not work as expected! Copy `.env.example` to `.env` and make it look something like this:

```
SOCKET_HOST=http://localhost:3001
```

This is only required for the development/testing environment.
