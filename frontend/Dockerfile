FROM node:16.13.1 as react-builder
WORKDIR /usr/index
COPY ./frontend/package*.json ./frontend/jsconfig*.json ./frontend/yarn.lock ./
RUN yarn install --pure-lockfile
COPY ./frontend ./
RUN yarn build

FROM node:16.13.1
ARG FRONT_PORT
WORKDIR /usr/index
COPY --from=react-builder /usr/index/build ./build
RUN yarn global add serve
USER node
CMD ["serve", "-l", ${FRONT_PORT}, "-s", "build"]
