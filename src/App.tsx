import { useState } from 'react'
import AdminDashboard from './features/admin/presentation/AdminDashboard'
import Storefront from './features/storefront/presentation/Storefront'

function App() {
  const [page, setPage] = useState<'store' | 'admin'>('store')

  return page === 'store' ? (
    <Storefront onOpenAdmin={() => setPage('admin')} />
  ) : (
    <AdminDashboard onBackToStore={() => setPage('store')} />
  )
}

export default App
