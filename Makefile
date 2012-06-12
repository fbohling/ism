all: ism.js

ism.js: Makefile
	echo "var ism = {};" > $@
	cat src/* >> $@

clean:
	rm -f ism.js ism.min.js
