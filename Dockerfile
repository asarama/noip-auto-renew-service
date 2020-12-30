FROM debian:10.4

# replace shell with bash so we can source files
RUN rm /bin/sh && ln -s /bin/bash /bin/sh

# update the repository sources list
# and install dependencies
RUN apt-get update \
    && apt-get install -y curl chromium sudo

ARG APP_DIRECTORY=/home/docker/workspace
ENV APP_DIRECTORY ${APP_DIRECTORY}

ENV NVM_DIR /usr/local/nvm
ENV NODE_VERSION lts/erbium
ENV NVM_VERSION 0.35.3

# Install nvm
RUN sudo mkdir /usr/local/nvm \
    && curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v$NVM_VERSION/install.sh | bash 

# Install node and npm
RUN source $NVM_DIR/nvm.sh \
    && nvm install $NODE_VERSION \
    && nvm alias default $NODE_VERSION \
    && nvm use default

ENV NODE_PATH $NVM_DIR/v$NODE_VERSION/lib/node_modules
ENV PATH $NVM_DIR/v$NODE_VERSION/bin:$PATH

# Copy application files
COPY . ${APP_DIRECTORY}

# Install application dependecies
RUN source $NVM_DIR/nvm.sh \
    && nvm use default \
    && cd ${APP_DIRECTORY} \
    && npm install

RUN useradd -m docker && echo "docker:docker" | chpasswd && adduser docker sudo
RUN chown -R docker:docker ${APP_DIRECTORY}

CMD ["./docker/start.sh"]

# Create application directory
WORKDIR ${APP_DIRECTORY}