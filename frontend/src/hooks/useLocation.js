import { useState, useEffect } from 'react'

export function useLocation() {
  const [loc, setLoc] = useState({
    lat: 12.2253, lng: 79.0747,
    city: 'Tiruvannamalai, Tamil Nadu',
    loading: true, err: null,
  })
  useEffect(() => {
    if (!navigator.geolocation) {
      setLoc(l => ({ ...l, loading:false })); return
    }
    navigator.geolocation.getCurrentPosition(
      p => setLoc({ lat:p.coords.latitude, lng:p.coords.longitude, city:'Your Location (GPS)', loading:false, err:null }),
      () => setLoc(l => ({ ...l, loading:false, err:'Using default: Tiruvannamalai' }))
    )
  }, [])
  return loc
}
