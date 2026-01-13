import {Route, Routes} from 'react-router-dom';
import {Schedule} from '../views/Schedule';
import {HomePage} from '../views/HomePage/HomePage';
import {Players} from '../views/Players';
import {Rules} from '../views/Rules';
import {PointSystem} from '../views/PointSystem';

export const HOME = '/';
export const PLAYERS = '/players';
export const CALENDAR = '/schedule';
export const RULES = '/rules';
export const POINTS = '/points';

export const mainRoute = '/';
export const routes = {
  jugadores: '/players',
  calendario: '/schedule',
  reglas: '/rules',
  puntos: '/points',
};

export const AppRouter = () => {
  return (
    <Routes>
      <Route path={mainRoute} element={<HomePage />} />
      <Route path={routes.jugadores} element={<Players />} />
      <Route path={routes.reglas} element={<Rules />} />
      <Route path={routes.calendario} element={<Schedule />} />
      <Route path={routes.puntos} element={<PointSystem />} />
      {/* <Route path="*" element={<PageNotFound />} /> */}
      {/* <Route path={ERROR} element={<ErrorPage />} /> */}
    </Routes>
  );
};
