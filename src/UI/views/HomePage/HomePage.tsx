import {useState} from 'react';
import {ISeason} from '../../../domain/interfaces';
import {isSeasonFinalized} from '../../../domain/shared';
import {useSeasonsStore} from '../../../state/seasons';
import {SeasonDetail} from '../../components/SeasonDetail';
import {SeasonHighlights} from '../../components/SeasonHighlights';
import {Standings} from '../../components/Standings';
import {StandingsBest10} from '../../components/StandingsBest10';
import {StandingsBest12} from '../../components/StandingsBest12';
import {StandingsBest15} from '../../components/StandingsBest15';
import {StandingsBest15V2} from '../../components/StandingsBest15V2';
import {StandingsBest8} from '../../components/StandingsBest8';
import './homePage.css';

export function HomePage() {
  const [seasonSelected, setSeasonSelected] = useState(7);
  const seasons = useSeasonsStore.getState().seasons;
  return (
    <div className="HomePage">
      <section className="banner flex flex-col gap-2 items-center justify-items-center bg-emerald-500 p-5">
        <h2 className="font-bold text-md text-amber-500">POKER LEAGUE</h2>
        <h1 className="font-bold text-4xl text-white italic">UXLAND</h1>
      </section>
      {/* Mobile: Dropdown selector */}
      <div className="sm:hidden p-4">
        <select
          value={seasonSelected}
          onChange={e => setSeasonSelected(Number(e.target.value))}
          className="w-full p-3 text-lg font-bold text-indigo-900 bg-white border-2 border-indigo-200 rounded-lg shadow-sm focus:border-indigo-500 focus:outline-none"
        >
          {seasons.map((s: ISeason) => (
            <option key={s.id} value={s.id}>
              {s.description}
            </option>
          ))}
        </select>
      </div>

      {/* Desktop: Tab selector */}
      <div className="hidden sm:flex flex-row gap-6 p-8 pb-4">
        {seasons.map((s: ISeason) => (
          <div
            key={s.id}
            onClick={e => setSeasonSelected(s.id)}
            data-testid="tab-item"
            className={`font-bold text-xl cursor-pointer transition duration-150 ${
              seasonSelected === s.id
                ? 'opacity-100 text-indigo-900'
                : 'opacity-40 hover:opacity-100 hover:text-indigo-900'
            }`}
          >
            {s.description}
          </div>
        ))}
      </div>
      {seasons.map((season: ISeason) => (
        <div
          key={season.id}
          className={`flex flex-col gap-8 p-4 sm:pr-8 sm:pl-8 ${
            seasonSelected != season.id && 'hidden'
          } `}
        >
          {isSeasonFinalized(season) ? (
            <SeasonHighlights season={season} />
          ) : (
            <div className="flex p-2 w-full text-slate-500">Los destacados apareceran cuando termine la temporada</div>
          )}

          {season.type === 1 ? (
            <Standings season={season} />
          ) : season.type === 2 ? (
            <StandingsBest8 season={season} />
          ) : season.type === 4 ? (
            <StandingsBest10 season={season} />
          ) : season.type === 5 ? (
            <StandingsBest15 season={season} />
          ) : season.type === 6 ? (
            <StandingsBest15V2 season={season} />
          ) : (
            <StandingsBest12 season={season} />
          )}
          <SeasonDetail season={season} />
        </div>
      ))}
    </div>
  );
}
