JS_FILES = \
		src/image.js \
		src/map.js \
		src/svg.js

all: ism.js

ism.js: $(JS_FILES) Makefile
	rm -f ism.js
	echo "var ism = {};" > $@
	cat $(JS_FILES) >> $@
	chmod 444 ism.js

clean:
	rm -f ism.js ism.min.js
