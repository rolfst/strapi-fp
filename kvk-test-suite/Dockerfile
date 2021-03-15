# ---- Base Python ----
FROM python:3.7.4-alpine
# Create app directory

ARG BUILD_DATE
ARG VCS_REF

LABEL org.label-schema.build-date=$BUILD_DATE \
      org.label-schema.description="Chrome running in headless mode in a tiny Alpine image" \
      org.label-schema.name="alpine-chrome" \
      org.label-schema.schema-version="1.0.0-rc1" \
      org.label-schema.usage="https://github.com/Zenika/alpine-chrome/blob/master/README.md" \
      org.label-schema.vcs-url="https://github.com/Zenika/alpine-chrome" \
      org.label-schema.vcs-ref=$VCS_REF \
      org.label-schema.vendor="Zenika" \
      org.label-schema.version="latest"

# Installs latest Chromium package.
RUN echo @edge http://nl.alpinelinux.org/alpine/edge/community >> /etc/apk/repositories \
    && echo @edge http://nl.alpinelinux.org/alpine/edge/main >> /etc/apk/repositories \
    && apk add --no-cache \
    chromium@edge \
    harfbuzz@edge \
    nss@edge \
    freetype@edge \
    ttf-freefont@edge \
    && rm -rf /var/cache/* \
    && mkdir /var/cache/apk

# Add Chrome as a user
RUN mkdir -p /opt/test \
    && addgroup chrome \
    && addgroup worker \
    && adduser -D -G worker worker \
    && addgroup worker chrome \
    && addgroup worker wheel \
    && chown -R worker:worker /opt/test
# Run Chrome as non-privileged

RUN pip install --upgrade pip

WORKDIR /opt/test


#RUN groupadd -r python && useradd --no-log-init -r worker
#ENV CHROME_BIN=/usr/bin/chromium-browser \
#    CHROME_PATH=/usr/lib/chromium/

COPY --chown=worker:worker . .
USER worker
ENV PATH="/home/worker/.local/bin:/opt/test/config/drivers:${PATH}"

# ---- Dependencies ----
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# install app dependencies including 'devDependencies'
#RUN pip install --user -r requirements.txt
RUN pip install --user -r requirements.txt \
  && python download_dependencies.py \
  && chmod 777 ./config/drivers/chromedriver


# optional
#CMD ["robot", "-v", "device:$DEVICE_ENV", "-v", "browser:$BROWSER_ENV", "testsuites"]

