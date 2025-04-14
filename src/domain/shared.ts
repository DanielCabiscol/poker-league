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

export const sortPlayersByTotalSeasonPointsDesc = (season: ISeason, players: IPlayer[]) => {
  const nonDeactivatedPlayers = players.filter(
    (p: IPlayer) => !p.deactivatedFromSeason || season.id < p.deactivatedFromSeason
  );
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
