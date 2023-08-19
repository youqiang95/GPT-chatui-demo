# build browser
FROM node:16 AS browser-builder
WORKDIR /app/browser
COPY browser /app/browser
RUN yarn && yarn build

# python
FROM python:3.10-slim
WORKDIR /app/server
COPY server /app/server
COPY --from=browser-builder /app/browser/build /app/server/build  
RUN pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple && \
    /usr/local/bin/python -m pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

EXPOSE 9000
CMD [ "python", "app.py" ]