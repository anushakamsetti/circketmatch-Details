const express = require("express");
const app = express();
app.use(express.json());

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const path = require("path");
const dbpath = path.join(__dirname, "cricketMatchDetails.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbpath,
      driven: sqlite3.Database,
    });

    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(e.message);
  }
};

app.get("/player/", async (request, response) => {
  const getPlayerQuery = `
            SELECT 
               player_id AS playerId,
               player_name AS playerName
            FROM
               player_details;`;

  const playerArray = await db.all(getPlayerQuery);
  response.send(playerArray);
});


app.get("/player/:playerId/", async (request, response) => {
  const { playerId } request.params;
  const getPlayerQuery = `
            SELECT 
               player_id AS playerId,
               player_name AS playerName
            FROM
               player_details
            WHERE
              player_id = ${playerId}
            ;`;

  const playerArray = await db.all(getPlayerQuery);
  response.send(player);
});


app.put("/player/:playerId", async (request, response) => {
    const { playerId } = request.params;
    const playerDetails = request.body;
    const { playerName } = playerDetails;
    const updatePlayerQuery = `
      UPDATE 
         player_details
      SET 
         player_name = `${playerName}`
      WHERE 
        player_id = ${playerId}
      ;`;
    await db.run(updatePlayerQuery);
    response.send("player Details updated");
});


app.get("/matches/:matchId/", async (request, response) => {
  const { matchId } request.params;
  const getMatchDetailsQuery = `
            SELECT 
               match_id AS matchId,
               match
               year
            FROM
               match_details
            WHERE
              match_id = ${matchId}
            ;`;

  const matchDetails = await db.get(getMatchDetailsQuery);
  response.send(matchDetails);
});


app.get("/players/:playerId/matches/", async (request, response) => {
  const { playerId } request.params;
  const getPlayerMatchesQuery = `
            SELECT 
               match_id AS matchId,
               match,
               year
            FROM
               player_match_score NATURAL JOIN match_details
            WHERE
              player_id = ${playerId}
            ;`;

  const playerMatchesArray = await db.all(getPlayerMatchesQuery);
  response.send(playerMatchesArray);
});


app.get("/matches/:matchId/players", async (request, response) => {
  const { matchId } request.params;
  const getMatchDetailsQuery = `
            SELECT 
               player_match_score.player_id AS playerId,
               player_name AS playerName
            FROM
               player_details INNER JOIN player_match_score ON player_details.player_id=player_match_score.player_id
            WHERE
              match_id = ${matchId}
            ;`;

  const matchPlayers = await db.all(getMatchPlayersQuery);
  response.send(matchplayes);
});

app.get("/players/:playerId/playerScore/", async (request, response) => {
  const { playerId } request.params;
  const getPlayerScoreQuery = `
      SELECT
         player_details.player_id AS playerId,
         player_details.player_name AS playerName,
         SUM(player_match_score.score) AS totalScore,
         SUM(fours) AS totalFours,
         SUM(sixes) AS totalSixes
      FROM
        player_details INNER JOIN player_match_score ON player_details.player_id= player_match_score.player_id
      WHERE 
        player_details.player_id ${playerId} 
      ;`;

  const playerScore = await db.get(getPlayerScoreQuery);
  response.send(playerScores);
});

module.exports = app;


