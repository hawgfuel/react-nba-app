import React, { useState, useRef, useEffect } from "react";
import { getData } from '../../clients/getData';
import Dropdown from '../../components/dropdown/dropdown';
import './sliding-panel.css';
import court from '../../images/nbahalfcourt.png';
import markerGreen from '../../images/basketball.png';
import markerRed from '../../images/basketball-grey.png';

interface SlidingPanelProps {
  yearArr: number[];
  children?: React.ReactNode;
}

interface Coordinate {
  date: string;
  color: 'green' | 'red';
  left: number;
  top: number;
  team: string;
  opponent: string;
}

interface GameStats {
  totalShots: number;
  totalMadeShots: number;
  team: string;
  opponent: string;
}

const SlidingPanel = ({ yearArr }: SlidingPanelProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [coordinates, setCoordinates] = useState<Coordinate[]>([]);
  const [filteredCoordinates, setFilteredCoordinates] = useState<Coordinate[]>([]);
  const [uniqueDates, setUniqueDates] = useState<string[]>([]);
  const [previousPage, setPreviousPage] = useState<string | null>(null);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [gameDate, setGameDate] = useState<string | null>(null);
  const [gameStats, setGameStats] = useState<GameStats>({ totalShots: 0, totalMadeShots: 0, team: '', opponent: '' });
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const baseUrl = 'https://nba-stats-db.herokuapp.com/api/shot_chart_data/';
  const playerArr = ['Lebron James', 'James Harden', 'Stephen Curry'];
  const [playerName, setPlayerName] = useState<string | number>(playerArr[0]);
  const [urlYear, setUrlYear] = useState(yearArr[yearArr.length - 1]);
  const [url, setUrl] = useState<string>(`${baseUrl}${playerName}/${urlYear}/`);

  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  const handleYearSelect = (selectedYear: string | number) => {
    setUrlYear(Number(selectedYear));
  };

  const handleDateSelect = (selectedDate: string | number) => {
    setGameDate(selectedDate.toString());
  };

  useEffect(() => {
    setUrl(`${baseUrl}${playerName}/${urlYear}/`);
  }, [playerName, urlYear]);

  useEffect(() => {
    const fetchData = async () => {
      if (!isOpen) return;
      try {
        const data = await getData({ url, verb: 'GET', cache: 'force-cache' }) as { results: Coordinate[]; previous: string | null; next: string | null };
        setCoordinates(data.results);
        const dates: string[] = data.results.map((item: Coordinate) => item.date);
        const uniqueDatesArray: string[] = [...new Set(dates)];
        setPreviousPage(data.previous);
        setNextPage(data.next);
        setUniqueDates(uniqueDatesArray);
        setGameDate(uniqueDatesArray[0] || null);
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };
    fetchData();
  }, [isOpen, url]);

  useEffect(() => {
    if (!coordinates.length) return;
    if (gameDate) {
      const filtered = coordinates.filter(coord => coord.date === gameDate);
      setFilteredCoordinates(filtered);

      const totalMade = filtered.reduce((acc, curr) => curr.color === 'green' ? acc + 1 : acc, 0);
      setGameStats({ 
        totalShots: filtered.length, totalMadeShots: totalMade, 
        team: filtered[0].team, opponent: filtered[0].opponent 
      });
    }
  }, [gameDate, coordinates]);

  useEffect(() => {
    if (!filteredCoordinates.length || !canvasRef.current || !imageRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const courtImage = imageRef.current;

    const drawImage = () => {
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(courtImage, 0, 0, canvas.width, canvas.height);

        const markerGreenImage = new Image();
        const markerRedImage = new Image();
        markerGreenImage.src = markerGreen;
        markerRedImage.src = markerRed;

        filteredCoordinates.forEach(coord => {
          const markerImage = coord.color === 'green' ? markerGreenImage : markerRedImage;
          markerImage.onload = () => ctx?.drawImage(markerImage, coord.left - 9, coord.top - 9, 18, 18);
        });
      }
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
          <div>
            <Dropdown 
              options={playerArr} 
              onSelect={setPlayerName} 
              defaultSelection={playerArr[0]} 
              label='Select a player:' 
              className='selectPlayer' />
            </div>
          <div>
            <Dropdown 
              options={yearArr} 
              onSelect={handleYearSelect} 
              defaultSelection={yearArr[yearArr.length - 1]} 
              label='Select season ending year:' 
              className='selectSeason' /> 
          </div>
          <div className="selectGame">
            <button type='button' disabled={!previousPage} onClick={() => previousPage && setUrl(previousPage)}>&lt; Previous</button>
            {uniqueDates.length > 0 && (
              <Dropdown 
                options={uniqueDates} 
                onSelect={handleDateSelect} 
                defaultSelection={uniqueDates[0]} label='Game date:' className='selectDate' />
            )}
            <button type='button' disabled={!nextPage} onClick={() => nextPage && setUrl(nextPage)}>Next &gt;</button>
          </div>
        </div>
        <div className="canvas-container">
          <img ref={imageRef} src={court} className="canvas-background" alt="Basketball Court" />
          <canvas ref={canvasRef} width={500} height={500}></canvas>
          <div className="gameStats">
            <span><label>Total Shots:</label> {gameStats.totalShots}</span>
            <span><label>Total Made Shots:</label> {gameStats.totalMadeShots}</span>
            <span><label>Shooting:</label> {Math.round(gameStats.totalMadeShots / gameStats.totalShots * 100)}%</span>
            <span><label>Team:</label> {gameStats.team}</span>
            <span><label>Opponent:</label> {gameStats.opponent}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlidingPanel;
