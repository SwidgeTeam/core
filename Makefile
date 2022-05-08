
-include .make.cfg

CONTRACTS=${CORE} ${BRIDGES} ${EXCHANGES}

TEMP_ENV_FILE := $(shell mktemp -t ".env.XXXXXX")

$(shell echo -n "DEPLOY_COMMANDS=" >> ${TEMP_ENV_FILE})
$(foreach net, ${NETWORKS}, $(eval _ := $(shell \
    $(foreach contract, ${CONTRACTS}, $(eval _ := $(shell \
        echo -n "${net}-${contract} " \
        >> ${TEMP_ENV_FILE} \
    ))) \
)))

$(shell echo >> ${TEMP_ENV_FILE})

$(shell echo -n "BRIDGE_COMMANDS=" >> ${TEMP_ENV_FILE})
$(foreach net, ${NETWORKS}, $(eval _ := $(shell \
    $(foreach contract, ${BRIDGES}, $(eval _ := $(shell \
        echo -n "${net}-${contract} " \
        >> ${TEMP_ENV_FILE} \
    ))) \
)))

$(shell echo >> ${TEMP_ENV_FILE})

$(shell echo -n "EXCHANGE_COMMANDS=" >> ${TEMP_ENV_FILE})
$(foreach net, ${NETWORKS}, $(eval _ := $(shell \
    $(foreach contract, ${EXCHANGES}, $(eval _ := $(shell \
        echo -n "${net}-${contract} " \
        >> ${TEMP_ENV_FILE} \
    ))) \
)))

-include ${TEMP_ENV_FILE}

REMOVE_TEMP_ENV_FILE := $(shell unlink ${TEMP_ENV_FILE})

.PHONY: deploy

BROWNIE = brownie
BROWNIE_NETWORKS = ${BROWNIE} networks $(1)
BROWNIE_COMPILE = ${BROWNIE} compile $(1)

HARDHAT = npx hardhat
DEPLOY = ${HARDHAT} --network $(1) deploy --tags $(2)

$(addprefix deploy-, ${DEPLOY_COMMANDS}): deploy-%:
	@$(call DEPLOY,$(shell echo $* | cut -d'-' -f 1),$(shell echo $* | cut -d'-' -f 2-))

import:
	@${call BROWNIE_NETWORKS, import network-config.yaml true}

compile:
	@${call BROWNIE_COMPILE, --all}