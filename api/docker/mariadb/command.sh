docker run \
    --name $name \
    -e MARIADB_DATABASE=$database \
    -e MARIADB_ROOT_PASSWORD=$password \
    -v $PWD/init.sql:/docker-entrypoint-initdb.d/init.sql \
    -p $port:3306 \
    -d mariadb:10.5;
