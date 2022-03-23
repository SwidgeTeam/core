
-include .make.cfg

TEMP_ENV_FILE := $(shell mktemp -t ".env.XXXXXX")

$(shell echo -n "COMMANDS=" > ${TEMP_ENV_FILE})

$(foreach net, ${NETWORKS}, $(eval _ := $(shell \
    $(foreach contract, ${CONTRACTS}, $(eval _ := $(shell \
        echo -n "${net}.${contract} " \
        >> ${TEMP_ENV_FILE} \
    ))) \
)))

-include ${TEMP_ENV_FILE}

REMOVE_TEMP_ENV_FILE := $(shell unlink ${TEMP_ENV_FILE})

.PHONY: deploy

HARDHAT = npx hardhat
DEPLOY = ${HARDHAT} --network $(1) deploy --tags $(2)

$(addprefix deploy., ${COMMANDS}): deploy.%:
	@$(call DEPLOY,$(shell echo $* | cut -d'.' -f 1),$(shell echo $* | cut -d'.' -f 2))
