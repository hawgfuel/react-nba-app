import React, { useState, useRef, useEffect } from "react";
import PropTypes from 'prop-types';
import { getData } from '../../clients/getData';
import Dropdown from '../../components/dropdown/dropdown';
import './sliding-panel.css';
import court from '../../images/nbahalfcourt.png';
import marker from '../../images/basketball.png';  // Add your marker image here

const SlidingPanel = ({ yearArr }) => {
  SlidingPanel.propTypes = {
    yearArr: PropTypes.array.isRequired,
    onSelect: PropTypes.func
  }

  const [isOpen, setIsOpen] = useState(false);
  const [coordinates, setCoordinates] = useState([]);
  const [filteredCoordinates, setFilteredCoordinates] = useState([]);
  const [uniqueDates, setUniqueDates] = useState([]);
  const [gameDate, setGameDate] = useState(null);
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const markerRef = useRef(null);  // Add reference for the marker image
  const baseUrl = 'https://nba-stats-db.herokuapp.com/api/shot_chart_data/';
  const playerArr = ['Lebron James', 'James Harden', 'Stephen Curry']
  const [playerName, setPlayerName] = useState(playerArr[0]);
  const [urlYear, setUrlYear] = useState(yearArr[yearArr.length - 1]);
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

  // fetch function
  useEffect(() => {
    if (isOpen) {
      const url = `${baseUrl}${playerName}/${urlYear}/`;
      getData(url, 'GET', 'force-cache').then((data) => {
        setCoordinates(data.results);
        const dates = data.results.map(item => item.date);
        const uniqueDatesArray = [...new Set(dates)];
        setUniqueDates(uniqueDatesArray);
        setGameDate(uniqueDatesArray[0]); // Set initial selected date
      }).catch((e) => console.log('error')); // create error messaging
    }
  }, [playerName, urlYear, isOpen]);

  // Filter coordinates based on selected game date
  useEffect(() => {
    if (gameDate) {
      const filtered = coordinates.filter(coord => coord.date === gameDate);
      setFilteredCoordinates(filtered);
    }
  }, [gameDate, coordinates]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const courtImage = imageRef.current;
    const markerImage = markerRef.current;

    const drawImage = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(courtImage, 0, 0, canvas.width, canvas.height);

      // Loop through filtered coordinates array and draw each marker image
      filteredCoordinates.forEach(coord => {
        ctx.drawImage(markerImage, coord.left - 12.5, coord.top - 12.5, 10, 10); // Adjust the coordinates to center the marker
      });
    };

    if (courtImage.complete && markerImage.complete) {
      drawImage();
    } else {
      courtImage.onload = drawImage;
      markerImage.onload = drawImage;
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
            <Dropdown options={yearArr} onSelect={handleYearSelect} defaultSelection={yearArr[yearArr.length - 1]} label='Select season ending year:' className='selectSeason' /> 
          </div>
          <div>
              {uniqueDates.length > 0 && (
                <Dropdown options={uniqueDates} onSelect={handleDateSelect} defaultSelection={uniqueDates[0]} label='Select game day:' className='selectDate' />
              )}
            </div>
        </div>
        <div className="canvas-container">
          <img ref={imageRef} src={court} className="canvas-background" alt="Basketball Court" />
          <img ref={markerRef} src={marker} className="marker" alt="Marker" style={{ display: 'none' }} /> {/* Hidden marker image for drawing */}
          <canvas ref={canvasRef} width={500} height={500}></canvas>
        </div>
      </div>
    </div>
  );
};

export default SlidingPanel;
