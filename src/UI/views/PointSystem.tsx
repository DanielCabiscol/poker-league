import {pointSystem} from '../../domain/point-system';

const ordinalEs = (n: number): string => {
  return `${n}º`;
};

export function PointSystem() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-8">
        <h1 className="text-3xl font-bold mb-2">Sistema de Puntos</h1>
        <p className="text-amber-100">
          Los puntos se calculan segun el numero de jugadores y la posicion final
        </p>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {/* Explanation */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <h2 className="text-xl font-bold text-slate-800 mb-3">Como funciona</h2>
          <p className="text-slate-600 mb-4">
            La cantidad de puntos se calcula segun el numero de jugadores en cada partida y la
            posicion de cada jugador. Este sistema es mas justo porque no es lo mismo ganar una
            partida con 5 jugadores que ganar una con 10 jugadores.
          </p>
          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-emerald-500 rounded-full"></span>
              <span>Mas jugadores = Mas puntos posibles</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-amber-500 rounded-full"></span>
              <span>Mejor posicion = Mas puntos</span>
            </div>
          </div>
        </div>

        {/* Points tables */}
        <div className="space-y-4">
          {Object.values(pointSystem[3]).map((points: any) => {
            const totalPlayers = Object.values(points).length;
            const pointValues = Object.values(points) as number[];

            return (
              <div key={totalPlayers} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="bg-slate-800 text-white px-4 py-3 flex items-center justify-between">
                  <span className="font-bold">Partida con {totalPlayers} jugadores</span>
                  <span className="text-slate-400 text-sm">
                    Total: {pointValues.reduce((a, b) => a + b, 0)} pts disponibles
                  </span>
                </div>
                <div className="p-4">
                  <div className="flex flex-wrap gap-2">
                    {pointValues.map((value: number, index: number) => (
                      <div
                        key={index}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                          index === 0
                            ? 'bg-amber-100 text-amber-800'
                            : index === 1
                            ? 'bg-slate-100 text-slate-700'
                            : index === 2
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-slate-50 text-slate-600'
                        }`}
                      >
                        <span className="font-bold">{ordinalEs(index + 1)}</span>
                        <span className="text-lg font-bold">{value}</span>
                        <span className="text-xs opacity-70">pts</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional info */}
        <div className="mt-6 bg-indigo-50 rounded-xl p-6 border border-indigo-200">
          <h3 className="font-bold text-indigo-800 mb-2">Informacion adicional</h3>
          <ul className="text-sm text-indigo-700 space-y-1">
            <li>• La ultima partida tiene multiplicador x1.5 en puntos por posicion</li>
            <li>• Los puntos de KO se suman aparte (sistema progresivo en Season 7)</li>
            <li>• Solo cuentan las mejores 15 partidas para el ranking final</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
