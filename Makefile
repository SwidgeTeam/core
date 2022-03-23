
.PHONY: deploy

DEPLOY = npx hardhat --network $(1) deploy --tags $(2)

deploy-mumbai-router:
	@$(call DEPLOY, mumbai, router)

deploy-mumbai-proxy-admin:
	@$(call DEPLOY, mumbai, proxy-admin)

deploy-mumbai-proxy:
	@$(call DEPLOY, mumbai, proxy)

deploy-matic-router:
	@$(call DEPLOY, matic, router)

deploy-matic-proxy-admin:
	@$(call DEPLOY, matic, proxy-admin)

deploy-matic-proxy:
	@$(call DEPLOY, matic, proxy)

deploy:
	@$(call DEPLOY, ${NET}, ${TAG})