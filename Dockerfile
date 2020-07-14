FROM debian:10.4

# replace shell with bash so we can source files
RUN rm /bin/sh && ln -s /bin/bash /bin/sh

# Create application directory
WORKDIR /noip-auto-renew-service

# update the repository sources list
# and install dependencies
RUN apt-get update \
    && apt-get install -y curl

ENV NVM_DIR /usr/local/nvm
ENV NODE_VERSION lts/erbium
ENV NVM_VERSION 0.35.3


# Install nvm
RUN mkdir /usr/local/nvm \
    && curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v$NVM_VERSION/install.sh | bash 

# Install node and npm
RUN source $NVM_DIR/nvm.sh \
    && nvm install $NODE_VERSION \
    && nvm alias default $NODE_VERSION \
    && nvm use default

ENV NODE_PATH $NVM_DIR/v$NODE_VERSION/lib/node_modules
ENV PATH $NVM_DIR/v$NODE_VERSION/bin:$PATH

# Copy application files
COPY . .

# Install application dependecies
RUN source $NVM_DIR/nvm.sh \
    && nvm use default \
    && npm install

CMD ["node", "app.js"]