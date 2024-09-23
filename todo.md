## TODO's

-   [x] Setup create error util function or service
-   [x] Setup global error handler and respond back in structure
-   [ ] Rate limiting

## Things to keep in mind

-   Create http errors with the CreateHttpError object only, or atleast catch error which is not made from http-error library and modify it and then transfer it through next()

