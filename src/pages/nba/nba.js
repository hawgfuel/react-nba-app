import React, {useState, useEffect} from 'react';
import {getData} from '../../clients/getData';
import Search from '../../components/search/search';
import Dropdown from '../../components/dropdown/dropdown';
import SlidingPanel from '../../components/sliding-panel/sliding-panel';
import {formatPlayerData} from './nba-helpers';
import './nba.css';

const startYear = 2011;
const rsPointsUrl = 'playerdata/topscorers/total/season/';
const rsAssistsUrl = 'top_assists/totals/';
const rsReboundsUrl = 'top_rebounds/totals/';
const poPointsUrl = 'playerdata/topscorers/playoffs/';
const poAssistsUrl = 'top_assists/playoffs/';
const baseUrl = 'https://nba-stats-db.herokuapp.com/api/';
const rsPointsLabel = 'Regular season point leaders';
const rsAssistsLabel = 'Regular season assist leaders';
const rsReboundsLabel = 'Regular season rebound leaders';
const poPointsLabel = 'Playoff point leaders';
const poAssistsLabel = 'Playoff assist leaders';
const tabContent = [poPointsLabel, poAssistsLabel, rsPointsLabel, rsAssistsLabel, rsReboundsLabel];

export function NBA() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [urlYear, setUrlYear] = useState(2023);
  const [categoryUrl, setCategoryUrl]= useState(poPointsUrl);
  const [categoryLabel, setCategoryLabel]= useState(poPointsLabel);
  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [isActive, setIsActive] = useState('tab-0');
  const currentYear = new Date().getFullYear();
  const yearArr = Array.from({length: currentYear - startYear}, (_, index) => startYear + index);

  // fetch function
  useEffect(() => {
    const url = `${baseUrl}${categoryUrl}${urlYear}/`;
    getData(url, 'GET', 'force-cache').then((data) => setData(data.results))
        .catch((e) => console.log('error'));// create error messaging
  }, [categoryUrl, urlYear]);

  useEffect(() => {
    if (data.length > 0) {
      const newData = formatPlayerData(data);
      setFilteredData(newData);
    }
  }, [data]);

  const handleSearch = (searchTerm) => {
    const filtered = data.filter((player) =>
      player.player_name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredData(filtered);
  };

  const handleSort = (key) => {
    let order = sortOrder;
    if (sortKey === key) {
      order = sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      order = 'asc';
    }

    const sortedData = [...filteredData].sort((a, b) => {
      if (order === 'asc') {
        return a[key] > b[key] ? 1 : -1;
      } else {
        return a[key] < b[key] ? 1 : -1;
      }
    });

    setSortKey(key);
    setSortOrder(order);
    setFilteredData(sortedData);
  };

  // passed to drop down component
  const handleYearSelect = (selectedYear) => {
    setUrlYear(selectedYear);
  };

  const selectedTab = (key) =>{
    setIsActive('tab-' + key);
    switch (key) {
      case 0:
        setCategoryUrl(poPointsUrl);
        setCategoryLabel(poPointsLabel);
        break;
      case 1:
        setCategoryUrl(poAssistsUrl);
        setCategoryLabel(poAssistsLabel);
        break;
      case 2:
        setCategoryUrl(rsPointsUrl);
        setCategoryLabel(rsPointsLabel);
        break;
      case 3:
        setCategoryUrl(rsAssistsUrl);
        setCategoryLabel(rsAssistsLabel);
        break;
      case 4:
        setCategoryUrl(rsReboundsUrl);
        setCategoryLabel(rsReboundsLabel);
        break;
      default:
        setCategoryUrl(poPointsUrl);
        setCategoryLabel(poPointsLabel);
    }
  };

  return (
    <section>
      {Array.isArray(data) ? (
        <div className="table-wrapper">
          <h1 className='margin-bottom-sm'>NBA {urlYear} {categoryLabel} - (top 200)</h1>
          <div className='margin-bottom-sm filters'>
            <Search setFilteredData={handleSearch} data={data} />
            <Dropdown options={yearArr} defaultSelection={yearArr[yearArr.length -1]} onSelect={handleYearSelect} label='Select a year:' className='selectYear' />
          </div>
          <div role='tablist' aria-orientation="horizontal">
            {tabContent.map((tab, index) => (
              <button className={'button-nba ' + (isActive === `tab-${index}` ? 'isActive' : '')} role="tab" type="button"
                aria-selected={isActive === `tab-${index}` ? 'true' : 'false'}
                id={`tab-${index}`} key={index} onClick={() => selectedTab(index)}>{tab}</button>
            ))}
          </div>
          <SlidingPanel yearArr={yearArr}><h1>Shot chart</h1></SlidingPanel>
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
              {filteredData.map((player) => (
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
        </div>
      ) : (
        <p className="content">No data available</p>
      )}
    </section>
  );
}
