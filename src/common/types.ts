export interface FilteredPlayerData {
    id: string;
    player_name: string;
    team: string;
    PTS: number;
    PTSPERGAME: number;
    THREEPTSPERGAME: number;
    THREEPERCENT: number;
    ORB: number;
    DRB: number;
    TRB: number;
    AST: number;
    STL: number;
    BLK: number;
    TOV: number;
    [key: string]: string | number; // Index signature
  }

  export interface PlayerData {
    id: string;
    player_name: string;
    team: string;
    PTS: number;
    three_attempts: number;
    three_percent: string;
    THREEPERCENT: number;
    ORB: number;
    DRB: number;
    TRB: number;
    AST: number;
    STL: number;
    BLK: number;
    TOV: number;
    games?: number;
  }
  