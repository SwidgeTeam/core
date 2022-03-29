
-include .make.cfg

CONTRACTS=${CORE} ${BRIDGES} ${EXCHANGES}

TEMP_ENV_FILE := $(shell mktemp -t ".env.XXXXXX")

$(shell echo -n "DEPLOY_COMMANDS=" > ${TEMP_ENV_FILE})
$(foreach net, ${NETWORKS}, $(eval _ := $(shell \
    $(foreach contract, ${CONTRACTS}, $(eval _ := $(shell \
        echo -n "${net}-${contract} " \
        >> ${TEMP_ENV_FILE} \
    ))) \
)))

$(shell echo -n "BRIDGE_COMMANDS=" > ${TEMP_ENV_FILE})
$(foreach net, ${NETWORKS}, $(eval _ := $(shell \
    $(foreach contract, ${BRIDGES}, $(eval _ := $(shell \
        echo -n "${net}-${contract} " \
        >> ${TEMP_ENV_FILE} \
    ))) \
)))

-include ${TEMP_ENV_FILE}

REMOVE_TEMP_ENV_FILE := $(shell unlink ${TEMP_ENV_FILE})

.PHONY: deploy

HARDHAT = npx hardhat
DEPLOY = ${HARDHAT} --network $(1) deploy --tags $(2)
UPDATE_PROXY = ${HARDHAT} --network $(1) update-proxy
VERIFY_BRIDGE = ${HARDHAT} --network $(1) verify-bridge --bridge $(2)
UPDATE_BRIDGE_ROUTER = ${HARDHAT} --network $(1) update-bridge-router --bridge $(2)

$(addprefix deploy-, ${DEPLOY_COMMANDS}): deploy-%:
	@$(call DEPLOY,$(shell echo $* | cut -d'-' -f 1),$(shell echo $* | cut -d'-' -f 2-))

$(addprefix update-proxy-, ${NETWORKS}): update-proxy-%:
	@$(call UPDATE_PROXY, $*)

$(addprefix verify-bridge-, ${BRIDGE_COMMANDS}): verify-bridge-%:
	@$(call VERIFY_BRIDGE,$(shell echo $* | cut -d'-' -f 1),$(shell echo $* | cut -d'-' -f 2-))

$(addprefix update-router-, ${BRIDGE_COMMANDS}): update-router-%:
	@$(call UPDATE_BRIDGE_ROUTER,$(shell echo $* | cut -d'-' -f 1),$(shell echo $* | cut -d'-' -f 2-))