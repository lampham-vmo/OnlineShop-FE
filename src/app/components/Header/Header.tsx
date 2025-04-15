import React, { use, useEffect } from 'react'
import { useAuthStore } from '../../../../lib/authStore'

export default function Header() {
  useEffect(()=> {
    const {initAuth} = useAuthStore.getState()
    initAuth()
  }, [])
  return (
    <div>
        This is a header
    </div>
  )
}
