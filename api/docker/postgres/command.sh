docker run \
    --name $name \
    -e POSTGRES_DB=$database \
    -e POSTGRES_PASSWORD=$password \
    -v $PWD/init.sql:/docker-entrypoint-initdb.d/init.sql \
    -p $port:5432 \
    -d postgres:16.3;
