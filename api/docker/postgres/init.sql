CREATE USER $username WITH PASSWORD '$password';

ALTER DATABASE $database OWNER TO $username;

GRANT ALL PRIVILEGES ON DATABASE $database TO $username;