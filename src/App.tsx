import AppRouter from './app/AppRouter'
import { CatalogProvider } from './features/catalog'

function App() {
  return (
    <CatalogProvider>
      <AppRouter />
    </CatalogProvider>
  )
}

export default App
