FROM wordpress:apache

COPY ./ /var/www/html/wp-content/plugins/wp-crypto-plugin

ENV WORDPRESS_DB_HOST=db
ENV WORDPRESS_DB_USER=wordpress
ENV WORDPRESS_DB_PASSWORD=wordpress
ENV WORDPRESS_DB_NAME=wordpress

EXPOSE 80

CMD ./start-web.sh