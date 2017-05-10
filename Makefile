bin := node_modules/.bin/
nodeversion := 7.10.0

all: compile

compile: install apidocs.json
	@$(bin)babel src -q --extensions .es --source-maps both --out-dir src

# In layman's terms: node_modules directory depends on the state of package.json
# Make will compare their timestamps and only if package.json is newer, it will run this target.
node_modules: package.json
	@npm install

apidocs.json:
	@curl -s https://nodejs.org/docs/v$(nodeversion)/api/all.json -o "$@"

module: compile
	@mkdir -p module \
	&& cp README.md LICENSE package.json module/ \
	&& node src/generate \
	&& $(bin)eslint --fix module

install: node_modules

lint: apidocs.json
	@$(bin)eslint --ext .es .

lint-module:
	@$(bin)eslint module

# Delete all the .js and .js.map files (excluding any potential dotfiles with .js extension)
distclean:
	@rm -r module
	@find src \
		\( \
			-name '*.js' \
			-or -name '*.js.map' \
		\) \
		-not -name '.*.js' \
		-print -delete

.PHONY:
	compile
	lint
	distclean
