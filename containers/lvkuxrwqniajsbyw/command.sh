docker run \
    --name lvkuxrwqniajsbyw \
    -e POSTGRES_DB=lvkuxrwqniajsbyw \
    -e POSTGRES_PASSWORD=secret \
    -v C:/Users/HP/Desktop/M.DIA/WORKSPACE/cloudbase/containers/lvkuxrwqniajsbyw/init.sql:/docker-entrypoint-initdb.d/init.sql \
    -p 30000:5432 \
    -d postgres:16.3;
