# This makefile provides helper targets for building and running the project.
# Run `make help` to print out all the available targets.

.PHONY: run-services
run-services: ## Run the services.
	@echo "To clean up and shut down all resources associated with this project, run 'make clean'"
	@cd ./dev-harness && make deps
	@cd ./dev-harness && tilt up

.PHONY: generate
generate: ## Generate code.
	@echo "Generating code..."
	@cd ./graphene-backend && make generate
	@cd ./fastapi-backend && make generate
	@cd ./go-graphql-backend && make generate
	@cd ./gateway && make generate

.PHONY: port-doctor
port-doctor: ## Check if the required ports are available.
	@echo "Checking if the required ports are available..."
	@./scripts/port-doctor.sh \
		3000 4000 8000 8080 \
		5432 \
		6379 6380 \
		4317 4318 \
		16686 14268

.PHONY: port-doctor-kevorkian
port-doctor-kevorkian: ## Attempt to kill processes that are using the required ports.
	@echo "Checking if the required ports are available..."
	@./scripts/port-doctor.sh -k \
		3000 4000 8000 8080 \
		5432 \
		6379 6380 \
		4317 4318 \
		16686 14268

.PHONY: run-load-generator
run-load-generator: ## Run the load generator.
	@echo "Running the load generator..."
	@cd ./load-generation && make run

.PHONY: clean
clean: ## Cleans up and shuts down resources assocaited with this project.
	@cd ./dev-harness && tilt down

.PHONY: help
help: ## Show help for each of the Makefile recipes.
	@# This shell prints out the help for each target in this Makefile.
	@grep -E '^[a-zA-Z0-9 -]+:.*##'  Makefile | sort | while read -r l; do printf "\033[1;32m$$(echo $$l | cut -f 1 -d':')\033[00m:$$(echo $$l | cut -f 2- -d'#')\n"; done

.DEFAULT_GOAL := help
