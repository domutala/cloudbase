docker run \
    --name $name \
    -e MYSQL_DATABASE=$database \
    -e MYSQL_ROOT_PASSWORD=$password \
    -v $PWD/init.sql:/docker-entrypoint-initdb.d/init.sql \
    -p $port:3306 \
    -d mysql:8.4;
