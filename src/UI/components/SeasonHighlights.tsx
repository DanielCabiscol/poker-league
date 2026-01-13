import {IPlayer, ISeason} from '../../domain/interfaces';
import {usePlayersStore} from '../../state/players';
import bronzeMedal from '../assets/bronze_medal.png';
import goldMedal from '../assets/gold_medal.png';
import silverMedal from '../assets/silver_medal.png';
import {
  getBestPointsPerGamePercentagePlayer,
  getBestSeasonPlayers,
  getPlayerSeasonPoints,
  getPlayerSeasonPointsPerGamePercentage,
} from '../../domain/shared';

interface SeasonHighlightsProps {
  season: ISeason;
}

export function SeasonHighlights(props: SeasonHighlightsProps) {
  const players = usePlayersStore.getState().players;
  const bestSeasonPlayers = getBestSeasonPlayers(players, props.season);
  const bestSeasonPointsPerGamePercentagePlayer: IPlayer = getBestPointsPerGamePercentagePlayer(
    props.season,
    players
  );
  return (
    <div className="flex flex-col w-full gap-4">
      <div className="flex flex-col w-full sm:flex-row items-center gap-4">
        <div className="flex flex-col w-full p-4 text-white bg-slate-800 rounded-md sm:min-w">
          <div className="flex flex-row justify-between sm:gap-12">
            <div className="text-3xl font-medium">1º</div>
            <img src={goldMedal} className="w-12" alt="medalla-oro" />
          </div>
          <div className="text-md font-bold text-amber-500 mb-2">
            {getPlayerSeasonPoints(props.season, bestSeasonPlayers[0].id)} puntos
          </div>
          <div className="text-sm">
            {bestSeasonPlayers[0].name} {bestSeasonPlayers[0].surname}
          </div>
        </div>
        <div className="flex flex-col w-full p-4 text-white bg-slate-800 rounded-md">
          <div className="flex flex-row justify-between sm:gap-12">
            <div className="text-3xl font-medium">2º</div>
            <img src={silverMedal} className="w-12" alt="medalla-plata" />
          </div>
          <div className="text-md font-bold text-amber-500 mb-2">
            {getPlayerSeasonPoints(props.season, bestSeasonPlayers[1].id)} puntos
          </div>
          <div className="text-sm">
            {bestSeasonPlayers[1].name} {bestSeasonPlayers[1].surname}
          </div>
        </div>
        <div className="flex flex-col w-full p-4 text-white bg-slate-800 rounded-md">
          <div className="flex flex-row justify-between sm:gap-12">
            <div className="text-3xl font-medium">3º</div>
            <img src={bronzeMedal} className="w-12" alt="medalla-bronce" />
          </div>
          <div className="text-md font-bold text-amber-500 mb-2">
            {getPlayerSeasonPoints(props.season, bestSeasonPlayers[2].id)} puntos
          </div>
          <div className="text-sm">
            {bestSeasonPlayers[2].name} {bestSeasonPlayers[2].surname}
          </div>
        </div>
      </div>
      <div className="flex flex-col p-4 text-white bg-slate-800 rounded-md">
        <div className="flex flex-row justify-between sm:gap-12">
          <div className="text-3xl font-medium">Mejor % P/J</div>
          <img src={goldMedal} className="w-12" alt="medalla-oro" />
        </div>
        <div className="text-md font-bold text-amber-500 mb-2">
          {getPlayerSeasonPointsPerGamePercentage(
            props.season,
            bestSeasonPointsPerGamePercentagePlayer.id
          )}{' '}
          puntos/partida
        </div>
        <div className="text-sm">
          {bestSeasonPointsPerGamePercentagePlayer.name}{' '}
          {bestSeasonPointsPerGamePercentagePlayer.surname}
        </div>
      </div>
    </div>
  );
}
