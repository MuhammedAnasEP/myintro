import React, { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import useRefreshToken from '../hooks/useRefreshToken'
import useAxiosPrivate from '../hooks/useAxiosPrivate'


export default function Refresh() {

    const refresh = useRefreshToken()
    const { accessToken, setUser } = useAuth()
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
    const axios = useAxiosPrivate()

    useEffect(() => {
        let isMounted = true

        async function verifyUser() {
            try {
                const response = await refresh()
                const { data } = await axios.get('auth/user')
                setUser(data)
            } catch (error) {
                console.log(error?.response)              
            } finally {
                isMounted && setLoading(false)
            }
        }

        !accessToken ? verifyUser() : setLoading(false)

        return () => {
            isMounted = false
        }
    }, [])

    return (
        loading ? "Loading" : <Outlet />
    )
}