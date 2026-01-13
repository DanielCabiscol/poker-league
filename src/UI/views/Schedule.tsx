import {format, formatDistanceToNowStrict, isPast, isToday, isFuture} from 'date-fns';
import {es} from 'date-fns/locale';
import {IGameSchedule, IPlayer, ISeason} from '../../domain/interfaces';
import {getGameWinner} from '../../domain/player';
import {useGamesScheduleStore} from '../../state/games-schedule';
import {usePlayersStore} from '../../state/players';
import {useSeasonsStore} from '../../state/seasons';

const CURRENT_SEASON_ID = 7;

function getGameStatus(date: Date, gameId: number, season: ISeason | undefined) {
  const game = season?.games.find(g => g.id === gameId);
  if (game) return 'completed';
  if (isPast(date)) return 'awaiting-results';
  if (isToday(date)) return 'today';
  return 'upcoming';
}

function GameCard({
  schedule,
  players,
  season,
  isNext,
}: {
  schedule: IGameSchedule;
  players: IPlayer[];
  season: ISeason | undefined;
  isNext: boolean;
}) {
  const date = new Date(schedule.date);
  const status = getGameStatus(date, schedule.id, season);
  const game = season?.games.find(g => g.id === schedule.id);
  const winner = game ? players.find(p => p.id === game.standings[0]) : null;
  const seasons = useSeasonsStore.getState().seasons;

  const statusConfig = {
    completed: {
      bg: 'bg-emerald-50 border-emerald-200',
      badge: 'bg-emerald-500',
      badgeText: 'Completada',
      icon: '✅',
    },
    'awaiting-results': {
      bg: 'bg-amber-50 border-amber-200',
      badge: 'bg-amber-500',
      badgeText: 'Pendiente',
      icon: '⏳',
    },
    today: {
      bg: 'bg-red-50 border-red-300 ring-2 ring-red-400',
      badge: 'bg-red-500',
      badgeText: 'HOY',
      icon: '🔴',
    },
    upcoming: {
      bg: 'bg-slate-50 border-slate-200',
      badge: 'bg-slate-400',
      badgeText: 'Proxima',
      icon: '📅',
    },
  };

  const config = statusConfig[status];

  return (
    <div
      className={`relative rounded-xl border-2 p-4 transition-all hover:shadow-lg ${config.bg} ${
        isNext ? 'ring-2 ring-indigo-400 shadow-lg' : ''
      }`}
    >
      {/* Status badge */}
      <div
        className={`absolute -top-2 -right-2 px-2 py-1 rounded-full text-xs font-bold text-white ${config.badge}`}
      >
        {config.badgeText}
      </div>

      {/* Game number */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-lg">
          {schedule.id}
        </div>
        <div>
          <div className="font-bold text-slate-800">Jornada {schedule.id}</div>
          <div className="text-sm text-slate-500">
            {schedule.id === 20 && '🏆 Final x1.5'}
          </div>
        </div>
      </div>

      {/* Date and time */}
      <div className="flex items-center gap-2 mb-3 text-slate-600">
        <span className="text-lg">📅</span>
        <div>
          <div className="font-medium capitalize">
            {format(date, "EEEE d 'de' MMMM", {locale: es})}
          </div>
          <div className="text-sm text-slate-500">{format(date, 'HH:mm')}h</div>
        </div>
      </div>

      {/* Winner or countdown */}
      {status === 'completed' && winner && (
        <div className="flex items-center gap-2 p-2 bg-emerald-100 rounded-lg">
          <span className="text-2xl">👑</span>
          <div>
            <div className="text-xs text-emerald-600 font-medium">Ganador</div>
            <div className="font-bold text-emerald-800">{winner.nickname}</div>
          </div>
        </div>
      )}

      {status === 'awaiting-results' && (
        <div className="flex items-center gap-2 p-2 bg-amber-100 rounded-lg">
          <span className="text-2xl">⏳</span>
          <div className="text-sm text-amber-700">Esperando resultados...</div>
        </div>
      )}

      {(status === 'upcoming' || status === 'today') && (
        <div className="flex items-center gap-2 p-2 bg-indigo-100 rounded-lg">
          <span className="text-2xl">⏰</span>
          <div>
            <div className="text-xs text-indigo-600 font-medium">
              {status === 'today' ? 'Empieza en' : 'Faltan'}
            </div>
            <div className="font-bold text-indigo-800">
              {formatDistanceToNowStrict(date, {locale: es})}
            </div>
          </div>
        </div>
      )}

      {/* KO stats if completed */}
      {status === 'completed' && game && game.kos && (
        <div className="mt-3 pt-3 border-t border-emerald-200">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span>🎯</span>
            <span>
              {game.kos.reduce((acc, ko) => acc + ko.count, 0)} KOs en esta partida
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function NextGameHighlight({schedule, season}: {schedule: IGameSchedule; season: ISeason | undefined}) {
  const date = new Date(schedule.date);
  const isLive = isToday(date) && isPast(date);

  return (
    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="text-indigo-200 text-sm font-medium mb-1">
            {isLive ? '🔴 EN VIVO' : 'Proxima partida'}
          </div>
          <h2 className="text-3xl font-bold mb-2">Jornada {schedule.id}</h2>
          <div className="flex items-center gap-4 text-indigo-100">
            <span className="capitalize">
              {format(date, "EEEE d 'de' MMMM", {locale: es})}
            </span>
            <span className="px-2 py-1 bg-white/20 rounded-full text-sm">
              {format(date, 'HH:mm')}h
            </span>
          </div>
        </div>

        <div className="text-center md:text-right">
          <div className="text-indigo-200 text-sm mb-1">
            {isLive ? 'Partida en curso' : 'Cuenta atras'}
          </div>
          <div className="text-4xl font-bold">
            {isLive ? '🎮 LIVE' : formatDistanceToNowStrict(date, {locale: es})}
          </div>
        </div>
      </div>
    </div>
  );
}

function SeasonProgress({season, total}: {season: ISeason | undefined; total: number}) {
  const completed = season?.games.length || 0;
  const percentage = (completed / total) * 100;

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="font-medium text-slate-700">Progreso de temporada</span>
        <span className="text-sm text-slate-500">
          {completed} de {total} partidas
        </span>
      </div>
      <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all duration-500"
          style={{width: `${percentage}%`}}
        />
      </div>
      <div className="flex justify-between text-xs text-slate-500 mt-1">
        <span>Inicio</span>
        <span>{Math.round(percentage)}%</span>
        <span>Final</span>
      </div>
    </div>
  );
}

function MonthGroup({
  month,
  games,
  players,
  season,
  nextGameId,
}: {
  month: string;
  games: IGameSchedule[];
  players: IPlayer[];
  season: ISeason | undefined;
  nextGameId: number | null;
}) {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-bold text-slate-700 mb-4 capitalize flex items-center gap-2">
        <span className="w-8 h-8 bg-slate-800 text-white rounded-lg flex items-center justify-center text-sm">
          {games.length}
        </span>
        {month}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {games.map(g => (
          <GameCard
            key={g.id}
            schedule={g}
            players={players}
            season={season}
            isNext={g.id === nextGameId}
          />
        ))}
      </div>
    </div>
  );
}

export function Schedule() {
  const gamesSchedule: IGameSchedule[] = useGamesScheduleStore.getState().gamesSchedule;
  const players: IPlayer[] = usePlayersStore.getState().players;
  const seasons: ISeason[] = useSeasonsStore.getState().seasons;
  const currentSeason = seasons.find(s => s.id === CURRENT_SEASON_ID);

  // Find next game
  const nextGame = gamesSchedule.find(g => {
    const date = new Date(g.date);
    return isFuture(date) || isToday(date);
  });

  // Group by month
  const gamesByMonth = gamesSchedule.reduce((acc, game) => {
    const month = format(new Date(game.date), 'MMMM yyyy', {locale: es});
    if (!acc[month]) acc[month] = [];
    acc[month].push(game);
    return acc;
  }, {} as Record<string, IGameSchedule[]>);

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white p-8">
        <h1 className="text-3xl font-bold mb-2">Calendario Season 7</h1>
        <p className="text-slate-300">
          20 partidas · Todos los lunes a las 21:00h · Sistema KO Progresivo
        </p>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Progress */}
        <SeasonProgress season={currentSeason} total={20} />

        {/* Next game highlight */}
        {nextGame && <NextGameHighlight schedule={nextGame} season={currentSeason} />}

        {/* Stats summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm text-center">
            <div className="text-3xl font-bold text-emerald-600">
              {currentSeason?.games.length || 0}
            </div>
            <div className="text-sm text-slate-500">Completadas</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm text-center">
            <div className="text-3xl font-bold text-amber-600">
              {20 - (currentSeason?.games.length || 0)}
            </div>
            <div className="text-sm text-slate-500">Pendientes</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm text-center">
            <div className="text-3xl font-bold text-indigo-600">
              {currentSeason?.games.reduce(
                (acc, g) => acc + (g.kos?.reduce((a, k) => a + k.count, 0) || 0),
                0
              ) || 0}
            </div>
            <div className="text-sm text-slate-500">KOs totales</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm text-center">
            <div className="text-3xl font-bold text-purple-600">
              {nextGame ? nextGame.id : '-'}
            </div>
            <div className="text-sm text-slate-500">Proxima jornada</div>
          </div>
        </div>

        {/* Games by month */}
        {Object.entries(gamesByMonth).map(([month, games]) => (
          <MonthGroup
            key={month}
            month={month}
            games={games}
            players={players}
            season={currentSeason}
            nextGameId={nextGame?.id || null}
          />
        ))}
      </div>
    </div>
  );
}
