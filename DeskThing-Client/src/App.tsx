import './App.css';
import ErrorBoundary from './components/ErrorBoundry';
import Overlay from './components/Overlay';
import ButtonHelper from './helpers/ButtonHelper';
import Apps from './components/Apps';

function App() {
  ButtonHelper.setCallback((data, data2, data3) => { console.log(data, data2, data3) })

  return (
    <div className="bg-slate-800 font-geist gap-5 text-white w-screen overflow-scroll h-screen flex flex-wrap justify-center items-center">
      <ErrorBoundary>
        <Overlay>
          <Apps />
        </Overlay>
      </ErrorBoundary>
    </div>
  );
}

export default App;