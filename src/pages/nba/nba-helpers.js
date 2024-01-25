export function formatPlayerData (data){
    var playerData = [];
    data.forEach(function(item) {
      playerData.push({
        id:item.id.toString(),
        player_name:item.player_name,
        team:item.team,
        PTS:parseFloat(item.PTS),
        PTSPERGAME: Math.trunc(item.PTS / item.games),
        THREEPTSPERGAME:Math.trunc(item.three_fg / item.games),
        THREEPERCENT:Math.floor(item.three_percent * 100),
        ORB:parseFloat(item.ORB),
        DRB:parseFloat(item.DRB),
        TRB:parseFloat(item.TRB),
        AST:parseFloat(item.AST),
        STL:parseFloat(item.STL),
        BLK:parseFloat(item.BLK),
        TOV:parseFloat(item.TOV),
      })
    });
    return playerData;
  }