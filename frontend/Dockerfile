FROM node:16.13.1 as react-builder
WORKDIR /usr/index
COPY ./frontend/package*.json ./frontend/jsconfig*.json ./frontend/yarn.lock ./
RUN yarn install --pure-lockfile
COPY . ./
RUN yarn build

FROM node:16.13.1
WORKDIR /usr/index
COPY --from=react-builder /usr/index/build ./build
RUN yarn global add serve
USER node
CMD ["serve", "-l", "3000", "-s", "build"]
