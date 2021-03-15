PHONY: dev test clean prod all debug

dirs := open-challengeplatform-frontend open-challengeplatform-backend

all:
	dev

clean: $(dirs)
	$(MAKE)--directory=$@ $(TARGET)

install: $(dirs)
	cd $(PWD)/open-challengeplatform-frontend && npm i
	cd $(PWD)/open-challengeplatform-backend && npm i
	cd $(PWD)/open-challengeplatform-stubby/ && npm i


stub:
	docker-compose -f docker-compose-stub.yml up -d
prod:
	docker-compose -f docker-compose-prod.yml up -d

dev:
	docker-compose -f docker-compose-stub.yml -f docker-compose-common.yml -f docker-compose-dev.yml up -d

debug:
	docker-compose -f docker-compose-stub.yml -f docker-compose-common.yml -f docker-compose-dev.yml -f docker-compose-debug.yml up -d

test:
	docker-compose -f docker-compose-stub.yml -f docker-compose-common.yml -f docker-compose-prod.yml -f docker-compose-test.yml up

shutdown:
	docker-compose down

db:
	docker-compose -f docker-local-mongodb.yml up -d

backend:
	docker-compose -f docker-compose-common.yml -f docker-compose-dev.yml up business_challenge_backend
