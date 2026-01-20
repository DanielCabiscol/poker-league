import {IPlayer, ISeason, StandingsProps} from '../../domain/interfaces';
import {
  getPlayerSeasonBestGamesPointsV2,
  getPlayerSeasonGamesCount,
  getPlayerSeasonKOPointsV2,
  getPlayerSeasonPointsPerGamePercentage,
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
          <div className="grid grid-cols-[40px_1fr_50px_50px_60px_70px_70px_70px] gap-1 px-3 py-2 text-xs font-bold uppercase">
            <div>#</div>
            <div>Jugador</div>
            <div className="text-center">Part.</div>
            <div className="text-center">%P/J</div>
            <div className="text-center">KOs</div>
            <div className="text-center">Pts KO</div>
            <div className="text-center">Pts Pos</div>
            <div className="text-right">Mejor {props.season.bestGames}</div>
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
            const ppg = getPlayerSeasonPointsPerGamePercentage(props.season, player.id);

            return (
              <div
                key={player.id}
                className={`grid grid-cols-[40px_1fr_50px_50px_60px_70px_70px_70px] gap-1 px-3 py-1.5 items-center border-l-4 hover:bg-slate-50 transition-colors ${getPositionStyle(
                  index
                )}`}
              >
                {/* Position */}
                <div>
                  <span className="font-bold text-sm text-slate-700">{index + 1}</span>
                </div>

                {/* Player */}
                <div className="flex items-center gap-1 min-w-0">
                  <span className="font-bold text-sm text-slate-800 truncate">
                    {player.nickname}
                    <span className="hidden sm:inline text-slate-500 font-normal"> ({player.name} {player.surname})</span>
                  </span>
                  {koRank >= 0 && koRank < 3 && <KOKingBadge rank={koRank} />}
                </div>

                {/* Games */}
                <div className="text-center text-sm text-slate-600">
                  {getPlayerSeasonGamesCount(props.season, player.id)}
                </div>

                {/* %P/J */}
                <div className="text-center text-sm text-slate-500">
                  {ppg}
                </div>

                {/* KOs count */}
                <div className="text-center">
                  <span className="inline-flex items-center gap-0.5 text-sm text-red-600 font-medium">
                    🎯 {totalKOs}
                  </span>
                </div>

                {/* KO Points */}
                <div className="text-center text-sm">
                  <span className="font-bold text-emerald-600">{koPoints}</span>
                  {koKingBonus > 0 && (
                    <span className="ml-0.5 text-amber-500 font-bold text-xs">+{koKingBonus}</span>
                  )}
                </div>

                {/* Position points */}
                <div className="text-center text-sm text-slate-600">{bestGamesPoints}</div>

                {/* Total */}
                <div className="text-right">
                  <span className="text-base font-bold text-indigo-700">{totalPoints}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="bg-slate-50 px-3 py-2 text-xs text-slate-500 flex flex-wrap gap-3">
          <span><strong>Part.</strong> = Partidas jugadas</span>
          <span><strong>%P/J</strong> = Media puntos/partida</span>
          <span><strong>Pts KO</strong> = KO progresivo x bounty (todas)</span>
          <span><strong>Pts Pos</strong> = Puntos posicion (mejor {props.season.bestGames})</span>
          <span><strong>Mejor {props.season.bestGames}</strong> = Pts Pos + Pts KO + Bonus</span>
          <span>👑🥈🥉 = Bonus KO King (+15/+10/+5)</span>
        </div>
      </div>
    </div>
  );
}
