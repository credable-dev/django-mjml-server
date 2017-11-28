PYTHON_BIN := .venv/bin

all: install

.PHONY: install clean build

install: venv

venv: $(PYTHON_BIN)/activate

$(PYTHON_BIN)/activate: requirements.txt
	test -d $(PYTHON_BIN) || virtualenv -p python3 .venv
	$(PYTHON_BIN)/pip install -Ur requirements.txt
	touch $(PYTHON_BIN)/activate

clean:
	rm -rf .venv

build: venv
	$(eval VERSION := $(shell pip list --format columns | grep mjml | awk '{print $$2}'))
	@echo 'django-mjml version is: $(VERSION)'
	docker build --pull -t django-mjml-server:$(VERSION) .
	docker tag django-mjml-server:$(VERSION) credable/django-mjml-server:$(VERSION)
	docker tag django-mjml-server:$(VERSION) credable/django-mjml-server:latest
	docker push credable/django-mjml-server:$(VERSION)
	docker push credable/django-mjml-server:latest
