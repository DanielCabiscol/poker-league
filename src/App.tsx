import './app.css';
import {AppRouter} from './UI/router';
import {Navbar} from './UI/views/Navbar';

function App() {
  return (
    <div className="App h-full flex flex-col justify-between">
      <header className="shadow-md fixed w-full h-16 z-10 flex flex-row items-center gap-5 bg-amber-600 p-4 pt-2 pb-2">
        <Navbar />
      </header>
      <main className="pt-16">
        <AppRouter />
      </main>
      <footer className="bg-slate-800 p-6">
        <div className="font-medium text-sm text-right text-white">
          Created by
          <a
            className="font-bold text-amber-500 pl-1 cursor-pointer hover:text-amber-600 transition duration-150"
            href="https://github.com/DanielCabiscol"
            target="_blank"
          >
            Daniel Cabiscol
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;
