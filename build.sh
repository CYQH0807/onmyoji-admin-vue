
# 编译项目
npm run build


rm -rf target
mkdir target


# # 复制dockerfile文件到target目录
cp "./Dockerfile" "./target/Dockerfile"
cp "./nginx.conf" "./target/nginx.conf"
cp -r "./dist" "./target"


# #切换目录到target
cd "./target"

echo "构建镜像"

# 构建镜像
docker build -t kyou0807/onmyoji-admin-vue:latest .


docker login -u kyou0807


# 推送镜像
docker push kyou0807/onmyoji-admin-vue:latest