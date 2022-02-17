# Makefile for Bento-Public

# import global variables
env ?= server.env

#>>>
# set default shell
#<<<
SHELL = bash

include $(env)
export $(shell sed 's/=.*//' $(env))


run-public:
	docker-compose -f docker-compose.yaml up -d public
run-public-dev: 
	docker-compose -f docker-compose.dev.yaml up -d public

clean-public:
	docker rm ${BENTO_PUBLIC_CONTAINER_NAME} --force; \
	docker rmi ${BENTO_PUBLIC_IMAGE}:${BENTO_PUBLIC_VERSION} --force;