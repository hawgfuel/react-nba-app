
import {FilteredPlayerData, PlayerData} from './types';

export function formatPlayerData(data: PlayerData[]): FilteredPlayerData[] {
  return data.map((item) => ({
    id: item.id,
    player_name: item.player_name,
    team: item.team,
    PTS: item.PTS,
    PTSPERGAME:item.games ? Math.trunc(item.PTS / item.games) : 0,
    THREEPTSPERGAME: item.games ? Math.trunc(item.THREEPERCENT / item.games) : 0,
    THREEPERCENT: Math.floor(item.THREEPERCENT * 100),
    ORB: item.ORB,
    DRB: item.DRB,
    TRB: item.TRB,
    AST: item.AST,
    STL: item.STL,
    BLK: item.BLK,
    TOV: item.TOV,
  }));
}
