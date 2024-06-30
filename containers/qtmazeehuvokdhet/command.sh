docker run \
    --name qtmazeehuvokdhet \
    -e POSTGRES_DB=qtmazeehuvokdhet \
    -e POSTGRES_PASSWORD=secret \
    -v C:/Users/HP/Desktop/M.DIA/WORKSPACE/cloudbase/containers/qtmazeehuvokdhet/init.sql:/docker-entrypoint-initdb.d/init.sql \
    -p 30001:5432 \
    -d postgres:16.3;
