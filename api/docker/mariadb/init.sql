CREATE USER '$username'@'%' IDENTIFIED BY '$password';

CREATE DATABASE IF NOT EXISTS $database;

GRANT ALL PRIVILEGES ON $database.* TO '$username'@'%';

FLUSH PRIVILEGES;