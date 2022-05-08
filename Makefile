-include .make.cfg

TEMP_ENV_FILE := $(shell mktemp -t ".env.XXXXXX")

$(shell echo -n "DEPLOY_COMMANDS=" >> ${TEMP_ENV_FILE})
$(foreach net, ${NETWORKS}, $(eval _ := $(shell \
    $(foreach contract, ${CONTRACTS}, $(eval _ := $(shell \
        echo -n "${contract}.${net} " \
        >> ${TEMP_ENV_FILE} \
    ))) \
)))

-include ${TEMP_ENV_FILE}

REMOVE_TEMP_ENV_FILE := $(shell unlink ${TEMP_ENV_FILE})

BROWNIE = brownie
BROWNIE_NETWORKS = ${BROWNIE} networks $(1)
BROWNIE_COMPILE = ${BROWNIE} compile $(1)
BROWNIE_RUN = ${BROWNIE} run --network $(1) $(2)

BROWNIE_DEPLOY = $(call BROWNIE_RUN, $(2), scripts/deploy.py main $(1))

$(addprefix deploy., ${DEPLOY_COMMANDS}): deploy.%:
	@$(call BROWNIE_DEPLOY,$(shell echo $* | cut -d'.' -f 1),$(shell echo $* | cut -d'.' -f 2))

import:
	@${call BROWNIE_NETWORKS, import network-config.yaml true}

compile:
	@${call BROWNIE_COMPILE, --all}