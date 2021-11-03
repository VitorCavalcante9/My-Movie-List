import { AuthProvider } from './contexts/AuthContext';
import Routes from './routes';
import { positions, Provider as AlertProvider} from 'react-alert';

import './styles/global.css';
import Alert from './components/Alert';

const options = {
  timeout: 5000,
  position: positions.TOP_RIGHT
};


function App() {
  return (
    <AlertProvider template={Alert} {...options}>
      <AuthProvider>
        <Routes />
      </AuthProvider>
    </AlertProvider>
  );
}

export default App;
