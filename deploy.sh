#!/bin/bash
cd server && zip -r -q -o ../gpt-chatui-demo-deploy.zip ./* && ossutil64 cp ../gpt-chatui-demo-deploy.zip oss://sql-generator-code/gpt-chatui-demo-deploy.zip