import React from 'react';

// Define the interface for the props
interface Player {
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
}

interface TableProps {
  filteredData: Player[];
  handleSort: (key: string) => void;
}

export function Table({ filteredData, handleSort }: TableProps) {
  return (
    <table className="fl-table">
      <thead>
        <tr>
          <th onClick={() => handleSort('player_name')}>Player</th>
          <th onClick={() => handleSort('team')}>Team</th>
          <th onClick={() => handleSort('PTS')}>Total Points</th>
          <th onClick={() => handleSort('PTSPERGAME')}>Points/game</th>
          <th onClick={() => handleSort('THREEPTSPERGAME')}>3pt/game</th>
          <th onClick={() => handleSort('THREEPERCENT')}>3pt%</th>
          <th onClick={() => handleSort('ORB')}>ORB</th>
          <th onClick={() => handleSort('DRB')}>DRB</th>
          <th onClick={() => handleSort('TRB')}>TRB</th>
          <th onClick={() => handleSort('AST')}>AST</th>
          <th onClick={() => handleSort('STL')}>STL</th>
          <th onClick={() => handleSort('BLK')}>BLK</th>
          <th onClick={() => handleSort('TOV')}>TOV</th>
        </tr>
      </thead>
      <tbody>
        {filteredData.length > 0  && filteredData.map((player) => (
          <tr key={player.id}>
            <td>{player.player_name}</td>
            <td>{player.team}</td>
            <td>{player.PTS}</td>
            <td>{player.PTSPERGAME}</td>
            <td>{player.THREEPTSPERGAME}</td>
            <td>{player.THREEPERCENT}</td>
            <td>{player.ORB}</td>
            <td>{player.DRB}</td>
            <td>{player.TRB}</td>
            <td>{player.AST}</td>
            <td>{player.STL}</td>
            <td>{player.BLK}</td>
            <td>{player.TOV}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default Table;
