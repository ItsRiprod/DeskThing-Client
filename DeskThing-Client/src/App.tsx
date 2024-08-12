import './App.css';
import ErrorBoundary from './components/ErrorBoundry';
import Overlay from './components/Overlay';
import Apps from './components/Apps';
import ButtonHelper from './helpers/ButtonHelper';
import ActionHelper from './helpers/ActionHelper';


function App() {
  ButtonHelper.setCallback(ActionHelper.executeAction)

  return (
      <ErrorBoundary>
        <Overlay>
          <Apps />
        </Overlay>
      </ErrorBoundary>
  );
}

export default App;