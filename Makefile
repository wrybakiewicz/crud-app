.PHONY: test

accounts:
	npx hardhat accounts

compile:
	npx hardhat compile

test:
	npx hardhat test

deploy:
	npx hardhat run scripts/deploy-crud.script.js --network localhost

node:
	npx hardhat node