import React, {useState, useEffect} from 'react';
import {getData} from '../../clients/getData';
import Search from '../../components/search/search';
import Dropdown from '../../components/dropdown/dropdown';
import SlidingPanel from '../../components/sliding-panel/sliding-panel';
import Table from '../../components/table/table';
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
    const fetchData = async () => {
      try {
        const url = `${baseUrl}${categoryUrl}${urlYear}/`;
        const data = await getData(url, 'GET', 'force-cache');
        setData(data.results)
        }
        catch (error) {
        console.error('Fetch error:', error);
      }
    }
    fetchData();
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
    const newData = formatPlayerData(filtered);
    setFilteredData(newData);
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
            <Dropdown options={yearArr} defaultSelection={yearArr[yearArr.length -1].toString()} onSelect={handleYearSelect} label='Select a year:' className='selectYear' />
          </div>
          <div role='tablist' aria-orientation="horizontal">
            {tabContent.map((tab, index) => (
              <button className={'button-nba ' + (isActive === `tab-${index}` ? 'isActive' : '')} role="tab" type="button"
                aria-selected={isActive === `tab-${index}` ? 'true' : 'false'}
                id={`tab-${index}`} key={index} onClick={() => selectedTab(index)}>{tab}</button>
            ))}
          </div>
          <SlidingPanel yearArr={yearArr}><h1>Shot chart</h1></SlidingPanel>
          <Table filteredData={filteredData} handleSort={handleSort} />
        </div>
      ) : (
        <p className="content">No data available</p>
      )}
    </section>
  );
}
