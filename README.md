# forum-api 

### Falih Fauzan

## Envrionment Variables
```
# HTTP SERVER
HOST=localhost
PORT=5000

# POSTGRES
PGHOST=localhost
PGUSER=developer
PGDATABASE=forumapi
PGPASSWORD=123456
PGPORT=5432

# POSTGRES TEST
PGHOST_TEST=localhost
PGUSER_TEST=developer
PGDATABASE_TEST=forumapi_test
PGPASSWORD_TEST=123456
PGPORT_TEST=5432

# TOKENIZE
ACCESS_TOKEN_KEY=8b7b4ef375716ab08b2a3951b29d52fc00b1c855f9d1a847229b8c5935bef56d9d271e76a9cf08e614300395c3b90ebe559cf968a0741b18c9505549394b2c70
REFRESH_TOKEN_KEY=5078605e074a462b1460608fcbe0d0963c644402e04ad334455ff5a856cb43fd99825861dde02957d5e3184c90c532ca7d0249df20fe93d535632f3d11be7bad
ACCCESS_TOKEN_AGE=3000
```

## Config file for test database
Location: `config/test.json`
```
{
  "user": "developer",
  "password": "123456",
  "host": "localhost",
  "port": 5432,
  "database": "forumapi_test"
}

```

## How to run
1. Install all dependencies
```
npm install
```

2. Apply migration
```
npm run migrate up
npm run migrate:test up
```

3. Run the server
```
npm run start
```