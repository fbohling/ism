JS_FILES = \
		src/image.js \
		src/map.js \
		src/svg.js

all: ism.js

ism.js: $(JS_FILES) Makefile
	echo "var ism = {};" > $@
	cat $(JS_FILES) >> $@

clean:
	rm -f ism.js ism.min.js
