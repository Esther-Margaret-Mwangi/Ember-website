import { useEffect, useState } from 'react'
import AdminDashboard from '../features/admin/presentation/AdminDashboard'
import Storefront from '../features/storefront/presentation/Storefront'

function AppRouter() {
  const [route, setRoute] = useState(() => {
    const currentRoute = `${window.location.pathname}${window.location.search}`
    if (currentRoute.startsWith('/admin')) {
      window.history.replaceState({}, '', '/')
      return '/'
    }
    return currentRoute
  })
  const [adminPreview, setAdminPreview] = useState(false)

  useEffect(() => {
    const updateRoute = () => {
      const nextRoute = `${window.location.pathname}${window.location.search}`
      if (nextRoute.startsWith('/admin') && !adminPreview) {
        window.history.replaceState({}, '', '/')
        setRoute('/')
        return
      }
      setRoute(nextRoute)
    }
    window.addEventListener('popstate', updateRoute)
    return () => window.removeEventListener('popstate', updateRoute)
  }, [adminPreview])

  const navigate = (destination: string) => {
    if (destination === `${window.location.pathname}${window.location.search}`) return
    window.history.pushState({}, '', destination)
    setRoute(destination)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const isAdminRoute = route.startsWith('/admin')

  if (isAdminRoute && adminPreview) {
    return (
      <AdminDashboard
        path={route}
        onNavigate={navigate}
        onBackToStore={() => navigate('/')}
      />
    )
  }

  return (
    <Storefront
      path={route}
      onNavigate={navigate}
      onOpenAdmin={() => {
        setAdminPreview(true)
        navigate('/admin')
      }}
    />
  )
}

export default AppRouter
