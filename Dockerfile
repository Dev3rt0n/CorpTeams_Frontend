FROM nginx:latest
USER root

COPY nginx.conf /etc/nginx/nginx.conf
COPY static /usr/share/nginx/html

EXPOSE 80/tcp
CMD nginx -g 'daemon off;'