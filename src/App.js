import "./App.css";
import Main from "./Main";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Main />
    </AuthProvider>
  );
}

export default App;

// http://localhost:5051
// https://plantill.nantech.az