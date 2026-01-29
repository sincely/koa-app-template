#!/bin/bash

# 配置部分
LOCAL_APP_PATH="/Users/chenchen501/study/cms-server-node"  # 本地应用程序路径
REMOTE_USER="root"         # 远程服务器用户名
REMOTE_HOST="116.198.34.49"        # 远程服务器地址
REMOTE_PATH="/var/www/cms/backend"          # 远程服务器路径
ARCHIVE_NAME="cms.tar.gz"        # 压缩文件名 

# 压缩文件
echo "压缩文件..."
tar --exclude="node_modules" --exclude="package-lock.json" -czvf $ARCHIVE_NAME -C $LOCAL_APP_PATH .

# 上传文件
echo "上传文件..."
scp $ARCHIVE_NAME $REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH

# 解压文件并清理
echo "解压文件并清理..."
ssh $REMOTE_USER@$REMOTE_HOST << EOF
  cd $REMOTE_PATH
  tar -xzvf $ARCHIVE_NAME
  rm $ARCHIVE_NAME
  npm install --registry=https://registry.npmmirror.com
  pm2 startOrRestart ecosystem.config.js
EOF

# 清理本地压缩文件
echo "清理本地压缩文件..."
rm $ARCHIVE_NAME

echo "上传完成！"