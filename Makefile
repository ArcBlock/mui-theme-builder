init: install dep
	@echo "Init project successfully!"

install:
	@echo "Install software required for this repo..."

dep:
	@echo "Install dependencies required for this repo..."
	@pnpm install

include .makefiles/*.mk

.PHONY: bump-version
