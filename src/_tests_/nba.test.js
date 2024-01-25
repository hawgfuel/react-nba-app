/* eslint-disable linebreak-style */

import React from 'react';
import {render} from '@testing-library/react';
import {NBA} from '../pages/nba/nba';
import {getData} from '../clients/getData';
import {year2023PlayoffLeaders, year2011PlayoffLeaders} from '../pages/nba/nbamocks';


test('Renders Home section', () => {
  const {getAllByText} = render(
      <NBA />,
  );
  expect(getAllByText('Playoff point leaders')).NBA;
});

describe('GET NBA API', () => {
  it('Should successfully get data from API for top scorers in 2023 playoffs', async () => {
    const url = 'https://nba-stats-db.herokuapp.com/api/playerdata/topscorers/playoffs/2023/';
    await expect(getData(url, 'GET', 'force-cache')).resolves.toEqual(year2023PlayoffLeaders);
  });
});

describe('GET NBA API', () => {
  it('Should successfully get data from API for top scorers in 2011 playoffs', async () => {
    const url = 'https://nba-stats-db.herokuapp.com/api/playerdata/topscorers/playoffs/2011/';
    await expect(getData(url, 'GET', 'force-cache')).resolves.toEqual(year2011PlayoffLeaders);
  });
});
