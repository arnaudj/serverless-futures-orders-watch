# Readme

# Setup

Create parameters to store the secrets in https://console.aws.amazon.com/systems-manager/parameters/ with the following keys:

Exchange credentials:

- `APIKEY`
- `APISECRET`

Telegram credentials:

How to: https://wk0.medium.com/send-and-receive-messages-with-the-telegram-api-17de9102ab78

- `TELEGRAM_BOTTOKEN`
- `TELEGRAM_CHATID`

## Cheat sheet

### Deploy

`sls deploy`

### Start whole app locally

`SLS_DEBUG=* sls offline start`

### Invoke a single lambda locally

`serverless invoke local -f crawl`
