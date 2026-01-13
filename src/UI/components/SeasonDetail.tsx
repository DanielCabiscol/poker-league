import {useState} from 'react';
import {IGame, IPlayer, ISeason} from '../../domain/interfaces';
import {
  getPlayerGameKos,
  getPlayerGamePoints,
  getPlayerGamePosition,
  getGameTotalKOs,
  getPlayerGameKOPointsV2,
} from '../../domain/shared';
import {usePlayersStore} from '../../state/players';

interface SeasonDetailProps {
  season: ISeason;
}

function getPositionStyle(position: number): string {
  if (position === 1) return 'bg-gradient-to-r from-amber-100 to-yellow-50 border-l-amber-500';
  if (position === 2) return 'bg-gradient-to-r from-slate-100 to-gray-50 border-l-slate-400';
  if (position === 3) return 'bg-gradient-to-r from-orange-100 to-amber-50 border-l-orange-400';
  return 'bg-white border-l-slate-200';
}

function getPositionBadgeStyle(position: number): string {
  if (position === 1) return 'bg-amber-500 text-white';
  if (position === 2) return 'bg-slate-400 text-white';
  if (position === 3) return 'bg-orange-400 text-white';
  return 'bg-slate-200 text-slate-700';
}

interface GameCardProps {
  game: IGame;
  season: ISeason;
  players: IPlayer[];
  isLastGame: boolean;
}

function GameCard({game, season, players, isLastGame}: GameCardProps) {
  const [expanded, setExpanded] = useState(false);
  const winner = players.find(p => p.id === game.standings[0]);
  const totalKOs = getGameTotalKOs(game);
  const isTypeV2 = season.type === 6;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Header */}
      <div
        onClick={() => setExpanded(!expanded)}
        className="cursor-pointer"
      >
        {/* Top bar with game number */}
        <div className="flex items-center justify-between bg-slate-800 text-white px-4 py-2">
          <div className="flex items-center gap-2">
            <span className="font-bold">Jornada {game.id}</span>
            {isLastGame && (
              <span className="px-2 py-0.5 text-xs font-bold bg-amber-500 rounded-full">
                x{season.lastGameMultiplier}
              </span>
            )}
          </div>
          <span className="text-slate-400 text-sm">
            {game.standings.length} jugadores
          </span>
        </div>

        {/* Winner and stats */}
        <div className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">👑</span>
            <div>
              <div className="text-xs text-slate-500 font-medium">Ganador</div>
              <div className="font-bold text-slate-800">{winner?.nickname || 'N/A'}</div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm">
            {totalKOs > 0 && (
              <div className="flex items-center gap-1 px-2 py-1 bg-red-50 text-red-700 rounded-full">
                <span>🎯</span>
                <span className="font-medium">{totalKOs} KOs</span>
              </div>
            )}
            <button
              className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
            >
              {expanded ? '▲ Ocultar' : '▼ Ver resultados'}
            </button>
          </div>
        </div>
      </div>

      {/* Expanded standings */}
      {expanded && (
        <div className="border-t border-slate-100">
          {game.standings.map((playerId, index) => {
            const player = players.find(p => p.id === playerId);
            const position = index + 1;
            const points = getPlayerGamePoints(game, playerId, season);
            const kos = getPlayerGameKos(game, playerId);
            const koPointsV2 = isTypeV2 ? getPlayerGameKOPointsV2(game, playerId) : kos;

            return (
              <div
                key={playerId}
                className={`flex items-center gap-3 px-4 py-2 border-l-4 ${getPositionStyle(position)}`}
              >
                {/* Position badge */}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${getPositionBadgeStyle(position)}`}
                >
                  {position}
                </div>

                {/* Player name */}
                <div className="flex-1 font-medium text-slate-800 truncate">
                  {player?.nickname || `Player ${playerId}`}
                </div>

                {/* Points */}
                <div className="text-right">
                  <span className="font-bold text-indigo-700">{points}</span>
                  <span className="text-slate-400 text-xs ml-1">pts</span>
                </div>

                {/* KOs */}
                {kos > 0 && (
                  <div className="text-right min-w-[70px]">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-50 text-red-600 rounded-full text-xs font-medium">
                      🎯 {kos}
                      {isTypeV2 && (
                        <span className="text-emerald-600 font-bold">+{koPointsV2}</span>
                      )}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function SeasonSummary({season}: {season: ISeason}) {
  const totalKOs = season.games.reduce((acc, game) => acc + getGameTotalKOs(game), 0);
  const totalGames = season.games.length;
  const maxGames = season.lastGame;

  return (
    <div className="bg-gradient-to-r from-slate-700 to-slate-800 rounded-xl p-4 text-white mb-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold">Detalle de Jornadas</h3>
          <p className="text-slate-300 text-sm">
            Haz click en cada jornada para ver los resultados completos
          </p>
        </div>
        <div className="flex gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold">{totalGames}/{maxGames}</div>
            <div className="text-xs text-slate-400">partidas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-400">{totalKOs}</div>
            <div className="text-xs text-slate-400">KOs totales</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SeasonDetail(props: SeasonDetailProps) {
  const players = usePlayersStore.getState().players;
  const nonDeactivatedPlayers = players.filter(
    (p: IPlayer) => !p.deactivatedFromSeason || props.season.id < p.deactivatedFromSeason
  );

  if (props.season.games.length === 0) {
    return (
      <div className="bg-slate-100 rounded-xl p-8 text-center text-slate-500">
        <div className="text-4xl mb-2">📅</div>
        <p>Todavia no hay partidas jugadas en esta temporada</p>
      </div>
    );
  }

  return (
    <div>
      <SeasonSummary season={props.season} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {props.season.games.map((game: IGame) => (
          <GameCard
            key={game.id}
            game={game}
            season={props.season}
            players={nonDeactivatedPlayers}
            isLastGame={game.id === props.season.lastGame}
          />
        ))}
      </div>
    </div>
  );
}
