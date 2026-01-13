import {IGame, IHandicap, IKO, IPlayer, ISeason, TPointsByPosition} from './interfaces';
import {isInvalidPlayer} from './player';
import {maxBy, sortBy} from './util';
import {validateGame, validatePlayer, validateSeason} from './validations';
import {pointSystem} from './point-system';

export const getPointsByPosition = (
  playersCount: number,
  position: number,
  pointsSystem: TPointsByPosition
) => {
  return pointsSystem[playersCount][position];
};

export const getPlayerTotalSeasonKos = (season: ISeason, playerId: number) => {
  return season.games.reduce((prev, curr) => {
    return (curr.kos?.find(k => k.playerId === playerId)?.count || 0) + prev;
  }, 0);
};

export const getPlayerGameKos = (game: IGame, playerId: number): number => {
  if (!game?.standings) {
    throw new Error('Game must be defined');
  } else if (isInvalidPlayer(playerId)) {
    throw new Error('Invalid playerId. Must be defined and a number greater than or equal to');
  } else {
    return game.kos?.find((ko: IKO) => ko.playerId === playerId)?.count || 0;
  }
};

// Obtiene el total de KOs de una partida
export const getGameTotalKOs = (game: IGame): number => {
  if (!game?.kos) return 0;
  return game.kos.reduce((acc, ko) => acc + ko.count, 0);
};

export const getPlayerGamePosition = (game: IGame, playerId: number): number | null => {
  if (!game?.standings) {
    throw new Error('Game must be defined');
  } else if (isInvalidPlayer(playerId)) {
    throw new Error('Invalid playerId. Must be defined and a number greater than or equal to');
  } else {
    const index = game.standings.findIndex((id: number) => id === playerId);
    const position = index != -1 ? index + 1 : null;
    return position;
  }
};

export const getPlayerSeasonGamesCount = (season: ISeason, playerId: number) => {
  const totalGames = season?.games.reduce((acc: number, curr: IGame) => {
    const index = curr.standings.findIndex(id => id === playerId);
    return (acc += index != -1 ? 1 : 0);
  }, 0);
  return totalGames || 0;
};

export const getPlayerSeasonHandicap = (season: ISeason, playerId: number) => {
  if (isInvalidPlayer(playerId)) {
    throw new Error('Invalid playerId. Must be defined and a number greater than or equal to');
  } else if (!season) {
    throw new Error('Season must be defined');
  } else {
    return season.handicaps?.find((h: IHandicap) => h.playerId === playerId)?.points || 0;
  }
};

export const getTotalSeasonKOs = (season: ISeason, playerId: number) => {
  const totalKOs = season?.games.reduce((acc: number, curr: IGame) => {
    const gameKOS = curr.kos?.find((ko: IKO) => ko.playerId === playerId)?.count || 0;
    return (acc += gameKOS);
  }, 0);
  return totalKOs || 0;
};

// ============ SEASON 7+ KO SYSTEM (Type 6) ============

// Calcula puntos progresivos de KO: 1+2+3+...+n = n(n+1)/2
export const getProgressiveKOPoints = (koCount: number): number => {
  return (koCount * (koCount + 1)) / 2;
};

// Calcula el multiplicador de bounty basado en posición final
export const getBountyMultiplier = (position: number): number => {
  if (position === 1) return 1.5;
  if (position === 2) return 1.25;
  return 1.0;
};

// Calcula puntos de KO para una partida con sistema V2 (progresivo + bounty)
export const getPlayerGameKOPointsV2 = (game: IGame, playerId: number): number => {
  const koCount = getPlayerGameKos(game, playerId);
  if (koCount === 0) return 0;

  const position = getPlayerGamePosition(game, playerId);
  if (!position) return 0;

  const progressivePoints = getProgressiveKOPoints(koCount);
  const bountyMultiplier = getBountyMultiplier(position);

  return Math.round(progressivePoints * bountyMultiplier);
};

// Calcula el total de puntos de KO de la temporada con sistema V2
export const getPlayerSeasonKOPointsV2 = (season: ISeason, playerId: number): number => {
  return season.games.reduce((acc, game) => {
    return acc + getPlayerGameKOPointsV2(game, playerId);
  }, 0);
};

// Obtiene el ranking de KOs de la temporada (para KO King)
export const getSeasonKORanking = (season: ISeason, players: IPlayer[]): {playerId: number, totalKOs: number}[] => {
  const koRanking = players
    .map(player => ({
      playerId: player.id,
      totalKOs: getPlayerTotalSeasonKos(season, player.id)
    }))
    .filter(p => p.totalKOs > 0)
    .sort((a, b) => b.totalKOs - a.totalKOs);

  return koRanking;
};

// Calcula el bonus de KO King (+15/+10/+5)
export const getKOKingBonus = (season: ISeason, playerId: number, players: IPlayer[]): number => {
  const ranking = getSeasonKORanking(season, players);
  const playerRank = ranking.findIndex(r => r.playerId === playerId);

  if (playerRank === 0) return 15;
  if (playerRank === 1) return 10;
  if (playerRank === 2) return 5;
  return 0;
};

export const getPlayerGamePoints = (game: IGame, playerId: number, season: ISeason): number => {
  validatePlayer(playerId);
  validateGame(game);
  const position = getPlayerGamePosition(game, playerId);
  if (!position) return 0;
  const pointsByPosition = getPointsByPosition(
    game.standings.length,
    position,
    pointSystem[season.pointsByPosition]
  );
  /*   const kos = getPlayerGameKos(game, playerId);
  return game.id === season.lastGame
    ? (pointsByPosition + kos) * season.lastGameMultiplier
    : pointsByPosition + kos; */
  return game.id === season.lastGame
    ? pointsByPosition * season.lastGameMultiplier
    : pointsByPosition;
};

export const getPlayerSeasonPoints = (season: ISeason, playerId: number) => {
  validatePlayer(playerId);
  validateSeason(season);
  const totalPoints = season?.games.reduce((acc: number, curr: IGame) => {
    const points = getPlayerGamePoints(curr, playerId, season);
    return (acc += points);
  }, 0);
  const totalKOS = getPlayerTotalSeasonKos(season, playerId);
  return totalPoints + totalKOS;
};

export const getPlayerSeasonBestGamesPointsWithHandicap = (season: ISeason, playerId: number) => {
  validatePlayer(playerId);
  validateSeason(season);
  const gamePointsArray = season?.games.map((game: IGame) =>
    getPlayerGamePoints(game, playerId, season)
  );
  const sortedGamePointsArray = gamePointsArray.sort((a, b) => b - a);
  const bestGames = sortedGamePointsArray.slice(0, season.bestGames);
  const bestGamesPoints = bestGames?.reduce((acc, curr) => (acc += curr), 0) || 0;
  const handicapPoints = getPlayerSeasonHandicap(season, playerId);
  const totalKOS = getPlayerTotalSeasonKos(season, playerId);
  return bestGamesPoints + handicapPoints + totalKOS;
};

// Versión V2 para Season 7+ (type 6) con KO progresivo, bounty y KO King
export const getPlayerSeasonBestGamesPointsV2 = (
  season: ISeason,
  playerId: number,
  players: IPlayer[]
): number => {
  validatePlayer(playerId);
  validateSeason(season);

  // Puntos por posición (mejores 15 partidas)
  const gamePointsArray = season?.games.map((game: IGame) =>
    getPlayerGamePoints(game, playerId, season)
  );
  const sortedGamePointsArray = gamePointsArray.sort((a, b) => b - a);
  const bestGames = sortedGamePointsArray.slice(0, season.bestGames);
  const bestGamesPoints = bestGames?.reduce((acc, curr) => (acc += curr), 0) || 0;

  // Puntos de KO con sistema V2 (progresivo + bounty) - de TODAS las partidas
  const koPointsV2 = getPlayerSeasonKOPointsV2(season, playerId);

  // Bonus KO King (solo si la temporada ha terminado)
  const koKingBonus = season.games.length >= season.lastGame
    ? getKOKingBonus(season, playerId, players)
    : 0;

  return bestGamesPoints + koPointsV2 + koKingBonus;
};

export const sortPlayersByTotalSeasonPointsDesc = (season: ISeason, players: IPlayer[]) => {
  const nonDeactivatedPlayers = players.filter(
    (p: IPlayer) => !p.deactivatedFromSeason || season.id < p.deactivatedFromSeason
  );

  // Usar sistema V2 para type 6 (Season 7+)
  if (season.type === 6) {
    return sortBy(
      nonDeactivatedPlayers,
      p => getPlayerSeasonBestGamesPointsV2(season, p.id, nonDeactivatedPlayers),
      'desc'
    );
  }

  return sortBy(
    nonDeactivatedPlayers,
    p => getPlayerSeasonBestGamesPointsWithHandicap(season, p.id),
    'desc'
  );
};

export const getPlayerSeasonPointsPerGamePercentage = (season: ISeason, playerId: number): any => {
  const totalSeasonPoints = getPlayerSeasonPoints(season, playerId);
  const totalSeasonGames = getPlayerSeasonGamesCount(season, playerId);
  return totalSeasonGames > 0 ? (totalSeasonPoints / totalSeasonGames).toFixed(2) : 0;
};

export const getBestSeasonPlayers = (players: IPlayer[], season: ISeason) => {
  const sortedPlayers = sortPlayersByTotalSeasonPointsDesc(season, players);
  return sortedPlayers.slice(0, 3);
};

export const getBestPointsPerGamePercentagePlayer = (season: ISeason, players: IPlayer[]) => {
  return maxBy(players, p => Number(getPlayerSeasonPointsPerGamePercentage(season, p.id)));
};

export const isSeasonFinalized = (season: ISeason) => {
  return season.id === 4
    ? season.games.length === 15
    : season.id === 5
    ? season.games.length === 12
    : season.id === 6
    ? season.games.length === 20
    : season.games.length === 10;
};
