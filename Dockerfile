FROM registry.gitlab.com/emulation-as-a-service/emulators/emulators-base

LABEL "EAAS_EMULATOR_TYPE"="test"

# prepare EAAS runtime
COPY init .
COPY init.js .
COPY lib .
RUN /setup

# Metadata boilerplate
COPY metadata /metadata/
ARG OCI_URL
RUN jq '.ociSourceUrl = env.OCI_URL' /metadata/metadata.json > /metadata/metadata.json.new && \
  mv /metadata/metadata.json.new /metadata/metadata.json
