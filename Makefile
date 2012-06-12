JS_FILES = \
		src/start.js \
		src/svg.js \
		src/image.js \
		src/map.js

all: ism.js

ism.js: $(JS_FILES) Makefile
	rm -rf $@
	cat $(JS_FILES) > $@

clean:
	rm -f ism.js ism.min.js
