import {IPlayer, ISeason, StandingsProps} from '../../domain/interfaces';
import {
  getPlayerSeasonBestGamesPointsV2,
  getPlayerSeasonGamesCount,
  getPlayerSeasonKOPointsV2,
  getPlayerTotalSeasonKos,
  getKOKingBonus,
  getSeasonKORanking,
  sortPlayersByTotalSeasonPointsDesc,
  getPlayerGamePoints,
} from '../../domain/shared';
import {usePlayersStore} from '../../state/players';

function KOKingBadge({rank}: {rank: number}) {
  if (rank === 0) return <span title="KO King - 1ro (+15 pts)">👑</span>;
  if (rank === 1) return <span title="KO King - 2do (+10 pts)">🥈</span>;
  if (rank === 2) return <span title="KO King - 3ro (+5 pts)">🥉</span>;
  return null;
}

function getPositionStyle(index: number): string {
  if (index === 0) return 'bg-gradient-to-r from-amber-50 to-yellow-50 border-l-amber-500';
  if (index === 1) return 'bg-gradient-to-r from-slate-50 to-gray-50 border-l-slate-400';
  if (index === 2) return 'bg-gradient-to-r from-orange-50 to-amber-50 border-l-orange-400';
  return 'border-l-slate-200';
}

function StatsCard({
  label,
  value,
  subValue,
  color = 'slate',
}: {
  label: string;
  value: string | number;
  subValue?: string;
  color?: string;
}) {
  const colorClasses: Record<string, string> = {
    slate: 'bg-slate-100 text-slate-800',
    emerald: 'bg-emerald-100 text-emerald-800',
    amber: 'bg-amber-100 text-amber-800',
    indigo: 'bg-indigo-100 text-indigo-800',
  };

  return (
    <div className={`rounded-lg p-3 ${colorClasses[color]}`}>
      <div className="text-xs font-medium opacity-70">{label}</div>
      <div className="text-xl font-bold">{value}</div>
      {subValue && <div className="text-xs opacity-60">{subValue}</div>}
    </div>
  );
}

function SeasonSummary({season, players}: {season: ISeason; players: IPlayer[]}) {
  const koRanking = getSeasonKORanking(season, players);
  const totalKOs = koRanking.reduce((acc, r) => acc + r.totalKOs, 0);
  const gamesPlayed = season.games.length;
  const isFinished = gamesPlayed >= season.lastGame;

  return (
    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white mb-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-2xl font-bold">{season.description}</h2>
          <p className="text-indigo-200">
            Sistema de KO Progresivo + Bounty + KO King
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold">
            {gamesPlayed}/{season.lastGame}
          </div>
          <div className="text-indigo-200 text-sm">partidas jugadas</div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white/10 rounded-lg p-3">
          <div className="text-indigo-200 text-xs">Total KOs</div>
          <div className="text-2xl font-bold">{totalKOs}</div>
        </div>
        <div className="bg-white/10 rounded-lg p-3">
          <div className="text-indigo-200 text-xs">Mejores partidas</div>
          <div className="text-2xl font-bold">{season.bestGames}</div>
        </div>
        <div className="bg-white/10 rounded-lg p-3">
          <div className="text-indigo-200 text-xs">Multiplicador final</div>
          <div className="text-2xl font-bold">x{season.lastGameMultiplier}</div>
        </div>
        <div className="bg-white/10 rounded-lg p-3">
          <div className="text-indigo-200 text-xs">Estado</div>
          <div className="text-2xl font-bold">{isFinished ? '✅' : '🔄'}</div>
        </div>
      </div>

      {koRanking.length > 0 && (
        <div className="mt-4 pt-4 border-t border-white/20">
          <div className="text-indigo-200 text-sm mb-2">Top KO Hunters</div>
          <div className="flex gap-4">
            {koRanking.slice(0, 3).map((r, idx) => {
              const player = players.find(p => p.id === r.playerId);
              return (
                <div key={r.playerId} className="flex items-center gap-2">
                  <span>{idx === 0 ? '👑' : idx === 1 ? '🥈' : '🥉'}</span>
                  <span className="font-medium">{player?.nickname}</span>
                  <span className="text-indigo-200">({r.totalKOs} KOs)</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export function StandingsBest15V2(props: StandingsProps) {
  const players = usePlayersStore.getState().players;
  const sortedPlayers = sortPlayersByTotalSeasonPointsDesc(props.season, players);
  const isSeasonFinished = props.season.games.length >= props.season.lastGame;
  const koRanking = getSeasonKORanking(props.season, players);

  const getKORank = (playerId: number): number => {
    return koRanking.findIndex(r => r.playerId === playerId);
  };

  const getBestGamesPoints = (playerId: number): number => {
    const gamePointsArray = props.season.games.map(game =>
      getPlayerGamePoints(game, playerId, props.season)
    );
    const sorted = [...gamePointsArray].sort((a, b) => b - a);
    return sorted.slice(0, props.season.bestGames).reduce((a, b) => a + b, 0);
  };

  return (
    <div className="space-y-4">
      <SeasonSummary season={props.season} players={sortedPlayers} />

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-slate-800 text-white">
          <div className="grid grid-cols-12 gap-2 p-4 text-xs font-bold uppercase">
            <div className="col-span-1">Pos</div>
            <div className="col-span-3">Jugador</div>
            <div className="col-span-1 text-center">J</div>
            <div className="col-span-2 text-center">KOs</div>
            <div className="col-span-2 text-center" title="Puntos de KO (progresivo + bounty)">
              KO Pts
            </div>
            <div className="col-span-1 text-center" title="Puntos por posicion (mejores 15)">
              Pos
            </div>
            <div className="col-span-2 text-right font-bold">Total</div>
          </div>
        </div>

        {/* Body */}
        <div className="divide-y divide-slate-100">
          {sortedPlayers.map((player: IPlayer, index) => {
            const koKingBonus = isSeasonFinished
              ? getKOKingBonus(props.season, player.id, sortedPlayers)
              : 0;
            const koRank = getKORank(player.id);
            const totalKOs = getPlayerTotalSeasonKos(props.season, player.id);
            const koPoints = getPlayerSeasonKOPointsV2(props.season, player.id);
            const bestGamesPoints = getBestGamesPoints(player.id);
            const totalPoints = getPlayerSeasonBestGamesPointsV2(
              props.season,
              player.id,
              sortedPlayers
            );

            return (
              <div
                key={player.id}
                className={`grid grid-cols-12 gap-2 p-4 items-center border-l-4 hover:bg-slate-50 transition-colors ${getPositionStyle(
                  index
                )}`}
              >
                {/* Position */}
                <div className="col-span-1">
                  <span className="font-bold text-lg text-slate-700">{index + 1}</span>
                </div>

                {/* Player */}
                <div className="col-span-3 flex items-center gap-2">
                  <span className="font-bold text-slate-800 truncate">{player.nickname}</span>
                  {koRank >= 0 && koRank < 3 && <KOKingBadge rank={koRank} />}
                </div>

                {/* Games */}
                <div className="col-span-1 text-center text-slate-600">
                  {getPlayerSeasonGamesCount(props.season, player.id)}
                </div>

                {/* KOs count */}
                <div className="col-span-2 text-center">
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-50 text-red-700 rounded-full text-sm font-medium">
                    🎯 {totalKOs}
                  </span>
                </div>

                {/* KO Points */}
                <div className="col-span-2 text-center">
                  <span className="font-bold text-emerald-600">{koPoints}</span>
                  {koKingBonus > 0 && (
                    <span className="ml-1 text-amber-500 font-bold">+{koKingBonus}</span>
                  )}
                </div>

                {/* Position points */}
                <div className="col-span-1 text-center text-slate-600">{bestGamesPoints}</div>

                {/* Total */}
                <div className="col-span-2 text-right">
                  <span className="text-xl font-bold text-indigo-700">{totalPoints}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="bg-slate-50 p-4 text-xs text-slate-500 flex flex-wrap gap-4">
          <span>
            <strong>J</strong> = Partidas jugadas
          </span>
          <span>
            <strong>KOs</strong> = Eliminaciones totales
          </span>
          <span>
            <strong>KO Pts</strong> = Puntos de KO (progresivo x bounty)
          </span>
          <span>
            <strong>Pos</strong> = Puntos por posicion (mejores {props.season.bestGames})
          </span>
          <span>👑🥈🥉 = Bonus KO King</span>
        </div>
      </div>
    </div>
  );
}
