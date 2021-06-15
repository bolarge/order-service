FROM 334236250727.dkr.ecr.us-west-2.amazonaws.com/carbon-golden-containers/node:v12
LABEL maintainer="Carbon Developers <developers@getcarbon.co>"

RUN mkdir -p /order-service

RUN cd /order-service && rm -rf *
WORKDIR /order-service
ADD package.json /order-service/package.json
RUN npm install -g
COPY . /order-service

RUN chown -R appuser:appuser /order-service
EXPOSE 5000
USER appuser

CMD ["node", "app.js"]