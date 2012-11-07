JS_FILES = \
		src/drag.js \
		src/image.js \
		src/map.js \
		src/tiled.js \
		src/util.js \
		src/vector.js \
		src/wheel.js

all: ism.js

ism.js: $(JS_FILES) Makefile
	rm -f ism.js
	echo "var ism = {};" > $@
	cat $(JS_FILES) >> $@
	chmod 444 ism.js

clean:
	rm -f ism.js ism.min.js
