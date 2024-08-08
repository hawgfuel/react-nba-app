import React, { useState, useRef, useEffect } from "react";
import PropTypes from 'prop-types';
import { getData } from '../../clients/getData';
import Dropdown from '../../components/dropdown/dropdown';
import './sliding-panel.css';
import court from '../../images/nbahalfcourt.png';
import markerGreen from '../../images/basketball.png';  // Green marker image
import markerRed from '../../images/basketball-grey.png';  // Red marker image

const SlidingPanel = ({ yearArr }) => {
  SlidingPanel.propTypes = {
    yearArr: PropTypes.array.isRequired,
    onSelect: PropTypes.func
  }

  const [isOpen, setIsOpen] = useState(false);
  const [coordinates, setCoordinates] = useState([]);
  const [filteredCoordinates, setFilteredCoordinates] = useState([]);
  const [uniqueDates, setUniqueDates] = useState([]);
  const [previousPage, setPreviousPage]= useState('');
  const [nextPage, setNextPage]= useState('');
  const [gameDate, setGameDate] = useState(null);
  const [gameStats, setGameStats] = useState({'totalShots': 0, 'totalMadeShots':0, 'team': '', 'opponent': '' })
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const baseUrl = 'https://nba-stats-db.herokuapp.com/api/shot_chart_data/';
  const playerArr = ['Lebron James', 'James Harden', 'Stephen Curry'];
  const [playerName, setPlayerName] = useState(playerArr[0]);
  const [urlYear, setUrlYear] = useState(yearArr[yearArr.length - 1]);
  const [url, setUrl] = useState(`${baseUrl}${playerName}/${urlYear}/`);

  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  // passed to drop down component
  const handleYearSelect = (selectedYear) => {
    setUrlYear(selectedYear);
  };

  // passed to drop down component
  const handleDateSelect = (selectedDate) => {
    setGameDate(selectedDate);
  };

  useEffect(() =>{
    setUrl(`${baseUrl}${playerName}/${urlYear}/`);
   }, [playerName, urlYear]);

  // fetch function
  useEffect(() => {
    const fetchData = async () => {
      if (!isOpen) return;
      try {
          const data = await getData(url, 'GET', 'force-cache');
          setCoordinates(data.results);
          const dates = data.results.map(item => item.date);
          const uniqueDatesArray = [...new Set(dates)];
          setPreviousPage(data.previous);
          setNextPage(data.next);
          setUniqueDates(uniqueDatesArray);
          setGameDate(uniqueDatesArray[0]); // Set initial selected date
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };
    fetchData();
  }, [isOpen, url]);

  // Filter coordinates based on selected game date
  useEffect(() => {
    if (!coordinates.length) return;
    if (gameDate) {
      const filtered = coordinates.filter(coord => coord.date === gameDate);
      setFilteredCoordinates(filtered);

      // Update total made shot counts (green shots)
      const totalMade = filtered.reduce((acc, curr) => {
        return curr.color === 'green' ? acc + 1 : acc;
      }, 0);
      setGameStats({'totalShots': filtered.length, 'totalMadeShots': totalMade, 'team': filtered[0].team, 'opponent': filtered[0].opponent})
      setFilteredCoordinates(filtered);
    }
  }, [gameDate, coordinates]);

  useEffect(() => {
    if (!filteredCoordinates.length) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const courtImage = imageRef.current;

    const drawImage = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(courtImage, 0, 0, canvas.width, canvas.height);

      // Load marker images
      const markerGreenImage = new Image();
      const markerRedImage = new Image();
      markerGreenImage.src = markerGreen;
      markerRedImage.src = markerRed;

      // Draw markers
      filteredCoordinates.forEach(coord => {
        const markerImage = coord.color === 'green' ? markerGreenImage : markerRedImage;
        ctx.drawImage(markerImage, coord.left - 9, coord.top - 9, 18, 18); // Adjust the size of the marker
      });
    };

    if (courtImage.complete) {
      drawImage();
    } else {
      courtImage.onload = drawImage;
    }
  }, [filteredCoordinates]);

  return (
    <div className="sliding-panel" style={{ backgroundColor: '#f0f0f0' }}>
      <button onClick={togglePanel}>Shot chart</button>
      <div className={`panel-content ${isOpen ? 'show' : ''}`}>
        <div className="shotChartfilters">
          <h3>{playerName}</h3>
          <div><Dropdown options={playerArr} onSelect={setPlayerName} defaultSelection={playerArr[0]} label='Select a player:' className='selectPlayer' /></div>
          <div>
            <Dropdown options={yearArr} onSelect={handleYearSelect} defaultSelection={yearArr[yearArr.length - 1].toString()} label='Select season ending year:' className='selectSeason' /> 
          </div>
          <div className="selectGame">
            <button type='button' disabled={!previousPage} onClick={() => setUrl(previousPage)}>&lt; Previous</button>
              {uniqueDates.length > 0 && (
                <Dropdown options={uniqueDates} onSelect={handleDateSelect} defaultSelection={uniqueDates[0]} label='Game date:' className='selectDate' />
              )}
              <button type='button' disabled={!nextPage} onClick={() => setUrl(nextPage)}>Next &gt;</button>
            </div>
        </div>
        <div className="canvas-container">
          <img ref={imageRef} src={court} className="canvas-background" alt="Basketball Court" />
          <canvas ref={canvasRef} width={500} height={500}></canvas>
          <div className="gameStats">
            <span><label>Total Shots:</label> {gameStats.totalShots}</span>
            <span><label>Total Made Shots:</label> {gameStats.totalMadeShots}</span>
            <span><label>Shooting:</label> {Math.round(gameStats.totalMadeShots/gameStats.totalShots * 100)}%</span>
            <span><label>Team:</label> {gameStats.team}</span>
            <span><label>Opponent:</label> {gameStats.opponent}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlidingPanel;
