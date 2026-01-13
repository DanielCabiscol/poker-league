import {useState} from 'react';
import {IRule, IRulesData} from '../../domain/interfaces';
import rulesData from '../../domain/data/rules-v2.json';

const categoryIcons: Record<string, string> = {
  general: '📋',
  puntuacion: '🧮',
  ko: '🎯',
  conducta: '⚠️',
};

const categoryColors: Record<string, string> = {
  general: 'bg-blue-100 border-blue-300 text-blue-800',
  puntuacion: 'bg-green-100 border-green-300 text-green-800',
  ko: 'bg-red-100 border-red-300 text-red-800',
  conducta: 'bg-yellow-100 border-yellow-300 text-yellow-800',
};

function RuleCard({rule}: {rule: IRule}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow ${
        rule.isNew ? 'border-l-4 border-l-emerald-500' : ''
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl">{categoryIcons[rule.category]}</span>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-lg text-slate-800">{rule.title}</h3>
            {rule.isNew && (
              <span className="px-2 py-0.5 text-xs font-bold bg-emerald-500 text-white rounded-full">
                NUEVO
              </span>
            )}
          </div>
          <p className="text-slate-600">{rule.description}</p>

          {rule.examples && rule.examples.length > 0 && (
            <div className="mt-3">
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                {expanded ? '▼' : '▶'} Ver ejemplos ({rule.examples.length})
              </button>

              {expanded && (
                <div className="mt-2 space-y-2">
                  {rule.examples.map((example, idx) => (
                    <div key={idx} className="bg-slate-50 rounded-md p-3 text-sm">
                      <div className="text-slate-600">
                        <span className="font-semibold">Escenario:</span> {example.scenario}
                      </div>
                      <div className="text-emerald-700 font-medium mt-1">
                        <span className="font-semibold">Resultado:</span> {example.result}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function KOCalculator() {
  const [kos, setKos] = useState(3);
  const [position, setPosition] = useState(1);

  const progressivePoints = (kos * (kos + 1)) / 2;
  const multiplier = position === 1 ? 1.5 : position === 2 ? 1.25 : 1.0;
  const totalPoints = Math.round(progressivePoints * multiplier);

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
      <h3 className="font-bold text-xl text-indigo-800 mb-4">🧮 Calculadora de Puntos de KO</h3>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Numero de KOs</label>
          <input
            type="number"
            min="0"
            max="10"
            value={kos}
            onChange={e => setKos(Math.max(0, parseInt(e.target.value) || 0))}
            className="w-full p-2 border rounded-md text-lg font-bold text-center"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Posicion final</label>
          <select
            value={position}
            onChange={e => setPosition(parseInt(e.target.value))}
            className="w-full p-2 border rounded-md text-lg"
          >
            <option value={1}>1ro (x1.5)</option>
            <option value={2}>2do (x1.25)</option>
            <option value={3}>3ro+ (x1.0)</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 text-center">
        <div className="text-sm text-slate-500 mb-1">Puntos progresivos</div>
        <div className="text-2xl font-bold text-slate-700">
          {progressivePoints}{' '}
          <span className="text-sm font-normal text-slate-400">
            ({Array.from({length: kos}, (_, i) => i + 1).join(' + ') || '0'})
          </span>
        </div>
        <div className="text-sm text-slate-500 mt-2 mb-1">x {multiplier} (bonus supervivencia)</div>
        <div className="text-4xl font-bold text-emerald-600">{totalPoints} puntos</div>
      </div>
    </div>
  );
}

export function Rules() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const data = rulesData as IRulesData;

  const filteredRules = activeCategory
    ? data.rules.filter(r => r.category === activeCategory)
    : data.rules;

  const newRulesCount = data.rules.filter(r => r.isNew).length;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-8">
        <h1 className="text-3xl font-bold mb-2">Reglamento Season 7</h1>
        <p className="text-emerald-100">
          {newRulesCount} nuevas reglas de KO para esta temporada
        </p>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-4 py-2 rounded-full font-medium transition-colors ${
              activeCategory === null
                ? 'bg-slate-800 text-white'
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            }`}
          >
            Todas ({data.rules.length})
          </button>
          {data.categories.map(cat => {
            const count = data.rules.filter(r => r.category === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full font-medium transition-colors ${
                  activeCategory === cat.id
                    ? 'bg-slate-800 text-white'
                    : `${categoryColors[cat.id]} border`
                }`}
              >
                {categoryIcons[cat.id]} {cat.name} ({count})
              </button>
            );
          })}
        </div>

        {/* KO Calculator */}
        {(activeCategory === null || activeCategory === 'ko') && (
          <div className="mb-8">
            <KOCalculator />
          </div>
        )}

        {/* Rules list */}
        <div className="space-y-4">
          {filteredRules.map(rule => (
            <RuleCard key={rule.id} rule={rule} />
          ))}
        </div>

        {/* Summary table for KO points */}
        {(activeCategory === null || activeCategory === 'ko') && (
          <div className="mt-8 bg-white rounded-xl p-6 border shadow-sm">
            <h3 className="font-bold text-xl text-slate-800 mb-4">
              📊 Tabla de Puntos Progresivos de KO
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-3">KOs</th>
                    <th className="text-right py-2 px-3">Progresivo</th>
                    <th className="text-right py-2 px-3">Si ganas (x1.5)</th>
                    <th className="text-right py-2 px-3">Si 2do (x1.25)</th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3, 4, 5, 6, 7].map(n => {
                    const prog = (n * (n + 1)) / 2;
                    return (
                      <tr key={n} className="border-b hover:bg-slate-50">
                        <td className="py-2 px-3 font-medium">{n} KO{n > 1 ? 's' : ''}</td>
                        <td className="py-2 px-3 text-right">{prog}</td>
                        <td className="py-2 px-3 text-right text-emerald-600 font-bold">
                          {Math.round(prog * 1.5)}
                        </td>
                        <td className="py-2 px-3 text-right text-blue-600">
                          {Math.round(prog * 1.25)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
