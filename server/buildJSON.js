const buildJSON = (gameData) => {
    let result = []
    gameData.forEach(element => {
        obj = {id: element.id, 
        period: 'Final',
        clock: null,
        homeTeam: {
            name: element.homeTeam,
            points: element.homePoints
        },
        awayTeam: {
            name: element.awayTeam,
            points: element.awayPoints
        }
    }
        result.push(obj);
    });

    return result;
}

module.exports = {buildJSON}