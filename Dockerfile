# Dockerfile (tag: v3)
FROM node:8

# Install node_modules in the image client/ folder
WORKDIR /django-mjml-server
COPY ./packag*.json /django-mjml-server/
RUN npm install

# Copy the server module.
COPY .venv/lib/python3.6/site-packages/mjml/node/tcpserver.js /django-mjml-server/

ENTRYPOINT ["npm"]
CMD ["start"]

EXPOSE 28101
