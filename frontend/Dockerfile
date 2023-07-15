FROM node:16.13.1 as react-builder
WORKDIR /usr/index
COPY package*.json jsconfig*.json yarn.lock ./
# ENV NODE_ENV=production
RUN yarn install --pure-lockfile
ENV REACT_APP_VERSION=v1.1.2
ENV GENERATE_SOURCEMAP=false
COPY . ./
RUN yarn build

FROM node:16.13.1
WORKDIR /usr/index
COPY --from=react-builder /usr/index/build ./build
RUN yarn global add serve
ENV REACT_APP_VERSION=v1.1.2
ENV GENERATE_SOURCEMAP=false
USER node
CMD ["serve", "-s", "build"]



# FROM node:18-alpine
# WORKDIR /usr/index
# ENV IS_DOCKER=1
# ENV TZ=Asia/Seoul
# ENV NODE_ENV=production
# COPY --from=ts-remover /usr/index ./
# RUN chmod -R 777 /usr/index
# USER node
# CMD ["npm", "run", "start"]