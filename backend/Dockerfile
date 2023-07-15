FROM node:18-alpine as ts-compiler
WORKDIR /usr/index
COPY package*.json tsconfig*.json yarn.lock ./
RUN yarn install --pure-lockfile
COPY . ./
RUN yarn build

FROM node:18-alpine as ts-remover
WORKDIR /usr/index
COPY --from=ts-compiler /usr/index/package*.json /usr/index/yarn.lock ./
COPY --from=ts-compiler /usr/index/build ./build
RUN yarn install --only=production --pure-lockfile

FROM node:18-alpine
WORKDIR /usr/index
ENV TZ=Asia/Seoul
ENV NODE_ENV=production
COPY --from=ts-remover /usr/index ./
RUN chmod -R 777 /usr/index
USER node
CMD ["npm", "run", "start"]