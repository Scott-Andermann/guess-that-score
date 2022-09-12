# Guess That Score!

Guess That Score is a game that my friends and I play during college football season where we try to guess the current score of games throughout the day only knowing the time remaining in the game.  It's hard to pay attention to all the games going on at once and this is a fun way for us to keep up with them all.  Guess That Score is purely about bragging rights, luck, and excitement of the possibility of an upset that are so common in CFB.  Usually one person moderates the game and the others guess.  This app automates the moderation and serves the score of a random game after a set interval.

Currently a work in progress.
TODO:
✔️ Serve single random game to all users
✔️ Countdown indicator until next game is served
✔️ Add game logic
✔️ Update API call every 5 mins
- User login
- Force single guess per user
✔️ Websocket that pushes closest guess for each game
- Add off-day functionality - guess score of completed games
✔️ condense server to single websocket server

Future improvements:
- Push text notifications to users that opt in during live games
- Improve styling
- User Login and performance tracking


To start:
'npm start' in root directory
'npm start' in server directory in a separate terminal instance

