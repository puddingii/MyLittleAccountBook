FROM node:16.13.1 as react-builder
WORKDIR /usr/index
ARG REACT_APP_VERSION
ARG GENERATE_SOURCEMAP
ARG REACT_APP_BACKEND_API
ARG REACT_APP_SOCKET_SERVER
ENV REACT_APP_VERSION=$REACT_APP_VERSION
ENV GENERATE_SOURCEMAP=$GENERATE_SOURCEMAP
ENV REACT_APP_BACKEND_API=$REACT_APP_BACKEND_API
ENV REACT_APP_SOCKET_SERVER=$REACT_APP_SOCKET_SERVER

COPY ./frontend/package*.json ./frontend/jsconfig*.json ./frontend/yarn.lock ./
RUN yarn install --pure-lockfile
COPY ./frontend ./
RUN yarn build

FROM node:16.13.1
ARG FRONT_PORT
ENV FRONT_PORT ${FRONT_PORT}
WORKDIR /usr/index
COPY --from=react-builder /usr/index/build ./build
RUN yarn global add serve
USER node
CMD serve -l ${FRONT_PORT} -s build
