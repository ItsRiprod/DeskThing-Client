import './App.css';
import ErrorBoundary from './components/ErrorBoundry';
import Overlay from './components/Overlay';
import Apps from './components/Apps';
import ButtonHelper from './helpers/ButtonHelper';
import ActionHelper from './helpers/ActionHelper';


function App() {
  ButtonHelper.setCallback(ActionHelper.executeAction)

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