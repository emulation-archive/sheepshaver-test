FROM registry.gitlab.com/emulation-as-a-service/emulators/emulators-base
FROM registry.gitlab.com/emulation-as-a-service/emulators/macemu-eaas-sheepshaver
RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y xterm

COPY setup setup
RUN ./setup

LABEL "EAAS_EMULATOR_TYPE"="test"

LABEL "EAAS_EMULATOR_TYPE"="sheepshaver"
LABEL "EAAS_EMULATOR_VERSION"="sheepshaver-ld"

# prepare EAAS runtime

WORKDIR /eaas
COPY init .
COPY init.js .
COPY lib lib
COPY framework.js .
COPY emulator.js .
WORKDIR /

RUN ln -fs /eaas/init /
COPY metadata.json .
COPY metadata metadata

# Metadata boilerplate
#ARG OCI_URL
#RUN jq '.ociSourceUrl = env.OCI_URL' /metadata/metadata.json > /metadata/metadata.json.new && \
#  mv /metadata/metadata.json.new /metadata/metadata.json
