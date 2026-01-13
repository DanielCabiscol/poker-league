import {describe, test, expect} from 'vitest';
import {
  getProgressiveKOPoints,
  getBountyMultiplier,
  getPlayerGameKOPointsV2,
  getPlayerSeasonKOPointsV2,
  getSeasonKORanking,
  getKOKingBonus,
} from '../shared';
import {IGame, IPlayer, ISeason} from '../interfaces';

// Mock data
const mockGame: IGame = {
  id: 1,
  description: 'Game 1',
  standings: [1, 2, 3, 4, 5, 6, 7, 8],
  kos: [
    {playerId: 1, count: 4},
    {playerId: 2, count: 2},
    {playerId: 3, count: 1},
  ],
};

const mockSeason: ISeason = {
  id: 7,
  description: 'Season 7',
  type: 6,
  lastGame: 20,
  lastGameMultiplier: 1.5,
  pointsByPosition: 3,
  bestGames: 15,
  handicaps: [],
  games: [
    {
      id: 1,
      description: 'Game 1',
      standings: [1, 2, 3, 4, 5],
      kos: [
        {playerId: 1, count: 3},
        {playerId: 2, count: 1},
      ],
    },
    {
      id: 2,
      description: 'Game 2',
      standings: [2, 1, 3, 4],
      kos: [
        {playerId: 2, count: 2},
        {playerId: 1, count: 1},
      ],
    },
  ],
};

const mockPlayers: IPlayer[] = [
  {id: 1, name: 'Player', surname: 'One', nickname: 'P1', lastSeasonPosition: 1, active: true},
  {id: 2, name: 'Player', surname: 'Two', nickname: 'P2', lastSeasonPosition: 2, active: true},
  {id: 3, name: 'Player', surname: 'Three', nickname: 'P3', lastSeasonPosition: 3, active: true},
  {id: 4, name: 'Player', surname: 'Four', nickname: 'P4', lastSeasonPosition: 4, active: true},
  {id: 5, name: 'Player', surname: 'Five', nickname: 'P5', lastSeasonPosition: 5, active: true},
];

describe('Progressive KO Points', () => {
  test('should return 0 for 0 KOs', () => {
    expect(getProgressiveKOPoints(0)).toBe(0);
  });

  test('should return 1 for 1 KO', () => {
    expect(getProgressiveKOPoints(1)).toBe(1);
  });

  test('should return 3 for 2 KOs (1+2)', () => {
    expect(getProgressiveKOPoints(2)).toBe(3);
  });

  test('should return 6 for 3 KOs (1+2+3)', () => {
    expect(getProgressiveKOPoints(3)).toBe(6);
  });

  test('should return 10 for 4 KOs (1+2+3+4)', () => {
    expect(getProgressiveKOPoints(4)).toBe(10);
  });

  test('should return 15 for 5 KOs (1+2+3+4+5)', () => {
    expect(getProgressiveKOPoints(5)).toBe(15);
  });

  test('should follow formula n*(n+1)/2', () => {
    for (let n = 0; n <= 10; n++) {
      expect(getProgressiveKOPoints(n)).toBe((n * (n + 1)) / 2);
    }
  });
});

describe('Bounty Multiplier', () => {
  test('should return 1.5 for position 1 (winner)', () => {
    expect(getBountyMultiplier(1)).toBe(1.5);
  });

  test('should return 1.25 for position 2', () => {
    expect(getBountyMultiplier(2)).toBe(1.25);
  });

  test('should return 1.0 for position 3', () => {
    expect(getBountyMultiplier(3)).toBe(1.0);
  });

  test('should return 1.0 for any position > 3', () => {
    expect(getBountyMultiplier(4)).toBe(1.0);
    expect(getBountyMultiplier(5)).toBe(1.0);
    expect(getBountyMultiplier(8)).toBe(1.0);
  });
});

describe('Player Game KO Points V2', () => {
  test('should calculate progressive KO with bounty for winner (pos 1)', () => {
    // Player 1: 4 KOs, position 1
    // Progressive: 1+2+3+4 = 10
    // Bounty multiplier: 1.5
    // Total: 10 * 1.5 = 15
    const result = getPlayerGameKOPointsV2(mockGame, 1);
    expect(result).toBe(15);
  });

  test('should calculate progressive KO with bounty for position 2', () => {
    // Player 2: 2 KOs, position 2
    // Progressive: 1+2 = 3
    // Bounty multiplier: 1.25
    // Total: 3 * 1.25 = 3.75 -> rounded to 4
    const result = getPlayerGameKOPointsV2(mockGame, 2);
    expect(result).toBe(4);
  });

  test('should calculate progressive KO without bounty for position 3+', () => {
    // Player 3: 1 KO, position 3
    // Progressive: 1
    // Bounty multiplier: 1.0
    // Total: 1 * 1.0 = 1
    const result = getPlayerGameKOPointsV2(mockGame, 3);
    expect(result).toBe(1);
  });

  test('should return 0 for player with no KOs', () => {
    const result = getPlayerGameKOPointsV2(mockGame, 4);
    expect(result).toBe(0);
  });

  test('should return 0 for player not in game', () => {
    const result = getPlayerGameKOPointsV2(mockGame, 99);
    expect(result).toBe(0);
  });
});

describe('Player Season KO Points V2', () => {
  test('should sum KO points from all games', () => {
    // Player 1:
    // Game 1: 3 KOs, pos 1 -> progressive 6, bounty 1.5 = 9
    // Game 2: 1 KO, pos 2 -> progressive 1, bounty 1.25 = 1.25 -> 1
    // Total: 9 + 1 = 10
    const result = getPlayerSeasonKOPointsV2(mockSeason, 1);
    expect(result).toBe(10);
  });

  test('should return 0 for player with no KOs in season', () => {
    const result = getPlayerSeasonKOPointsV2(mockSeason, 5);
    expect(result).toBe(0);
  });
});

describe('Season KO Ranking', () => {
  test('should rank players by total KO count', () => {
    // Player 1: 3 + 1 = 4 KOs
    // Player 2: 1 + 2 = 3 KOs
    const ranking = getSeasonKORanking(mockSeason, mockPlayers);

    expect(ranking[0].playerId).toBe(1);
    expect(ranking[0].totalKOs).toBe(4);
    expect(ranking[1].playerId).toBe(2);
    expect(ranking[1].totalKOs).toBe(3);
  });

  test('should exclude players with 0 KOs', () => {
    const ranking = getSeasonKORanking(mockSeason, mockPlayers);

    const hasPlayerWithZeroKOs = ranking.some(r => r.totalKOs === 0);
    expect(hasPlayerWithZeroKOs).toBe(false);
  });
});

describe('KO King Bonus', () => {
  test('should return 15 for player with most KOs', () => {
    const bonus = getKOKingBonus(mockSeason, 1, mockPlayers);
    expect(bonus).toBe(15);
  });

  test('should return 10 for player with second most KOs', () => {
    const bonus = getKOKingBonus(mockSeason, 2, mockPlayers);
    expect(bonus).toBe(10);
  });

  test('should return 0 for player not in top 3 KOs', () => {
    const bonus = getKOKingBonus(mockSeason, 5, mockPlayers);
    expect(bonus).toBe(0);
  });
});
