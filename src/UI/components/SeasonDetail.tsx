import {IGame, IPlayer, ISeason} from '../../domain/interfaces';
import {getPlayerGameKos} from '../../domain/season-best-12';
import {getPlayerGamePoints, getPlayerGamePosition} from '../../domain/season-best-8';
import {usePlayersStore} from '../../state/players';

interface SeasonDetailProps {
  season: ISeason;
}

export function SeasonDetail(props: SeasonDetailProps) {
  const players = usePlayersStore.getState().players.filter((p: IPlayer) => p.active);

  return (
    <div>
      <div className="border rounded-md shadow-lg max-sm:hidden">
        <div className="grid grid-cols-seasonDetail justify-between pl-4 pr-4 gap-4 bg-slate-800 rounded-t-md">
          <div className="font-bold uppercase text-amber-500 text-xs sm:text-sm pt-4 pb-4 truncate">
            Game/Player
          </div>
          {props.season.games.map((g: IGame) => (
            <div
              key={g.id}
              className="font-bold uppercase text-white text-center text-xs sm:text-sm pt-4 pb-4 truncate"
            >
              G{g.id}
            </div>
          ))}
        </div>
        {players.map((p: IPlayer) => (
          <div
            key={p.id}
            className="grid grid-cols-seasonDetail w-full p-2 gap-4 border-b border-l-4 border-l-amber-500 items-center"
          >
            <div className="text-xs font-bold text-indigo-800">{p.nickname}</div>
            {props.season.games.map((g: IGame) => (
              <div key={g.id} className="text-xs font-bold text-center">
                {getPlayerGamePosition(g, p.id) !== 0
                  ? `${getPlayerGamePosition(g, p.id)}º (${getPlayerGamePoints(
                      g,
                      p.id
                    )}p + ${getPlayerGameKos(g, p.id)} KO)`
                  : '-'}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="sm:hidden text-center text-bold text-sm">
        Rotate your phone or go to Desktop to see more statistics
      </div>
    </div>
  );
}
