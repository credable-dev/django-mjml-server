VERSION := '1.0.0'

all: build

.PHONY: build

install: venv

build:
	@echo 'django-mjml version is: $(VERSION)'
	docker build --pull -t django-mjml-server:$(VERSION) .
	docker tag django-mjml-server:$(VERSION) credable/django-mjml-server:$(VERSION)
	docker tag django-mjml-server:$(VERSION) credable/django-mjml-server:latest
	docker push credable/django-mjml-server:$(VERSION)
	docker push credable/django-mjml-server:latest
