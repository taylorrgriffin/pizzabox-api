# pizzabox-api

## Setup

Create SSL certificate for https with `./create_cert.sh`<br/>

## Usage

Build and run with `docker-compose up --build`<br/>
Run latest build with `docker-compose up`

## Cleanup

Clear database with `docker-compose down`

## Endpoints

### Test API connection

`GET https://localhost:8080/`

### Get db info

`GET https://localhost:8080/dbInfo?apiKey=`

### Fetch all games

`GET https://localhost:8080/game?apiKey=`

### Fetch game by id

`GET https://localhost:8080/game/:gameId?apiKey=`

### Create a new game

`POST https://localhost:8080/game`

Request body example: 
```
{
  "game": {
    "gameId": "A1P0",
    "players": [],
    "rules": [],
    "turn": 0
  }
}
```

## Add a player to a game

`PUT https://localhost:8080/game/:gameId`

Request body example: 
```
{
  "player": "p1"
}
```

### Delete a game by id

`DELETE https://localhost:8080/game/:gameId`

### Delete all games

`DELETE https://localhost:8080/game`