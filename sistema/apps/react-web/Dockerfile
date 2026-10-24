# Imagem do site do Nex_TI (React + Vite servido pelo Nginx). O contexto do build é a pasta sistema/:
#   docker build -f apps/react-web/Dockerfile -t nexti-web .
# VITE_API_URL é lida no build: é o endereço da API visto pelo navegador.

# 1) Gera o build de produção com o Node
FROM node:22-alpine AS build
WORKDIR /src
COPY . .
RUN npm ci --workspace @nexti/react-web --include-workspace-root=false
ARG VITE_API_URL=http://localhost:5000/api
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build --workspace @nexti/react-web

# 2) Serve os arquivos estáticos com o Nginx
FROM nginx:1.27-alpine
COPY apps/react-web/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /src/apps/react-web/dist /usr/share/nginx/html
EXPOSE 80
