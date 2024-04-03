'use client'

import { FormEvent, useEffect, useState } from 'react'
import "bootstrap/dist/css/bootstrap.min.css";

export default function TestPage() {
    const [cookieToken, setCookieToken] = useState('');

    const getCookie = (name: string) => {
        const cookieString = document.cookie;
        const cookies = cookieString.split(';').map(cookie => cookie.trim());
        let getToken = ''
        for (const cookie of cookies) {
            const [cookieName, cookieValue] = cookie.split('=');
            if (cookieName === name) {
                setCookieToken(cookieValue)
                getToken = cookieValue
                return
            }
        }
        if(getToken == ''){
            location.replace('/login')
            return
        }
    };

    useEffect(() => {
        require("bootstrap/dist/js/bootstrap.bundle.min.js");
        getCookie('token')
    }, [])

    const logout = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
 
        const formData = new FormData(event.currentTarget)
        const url = 'http://127.0.0.1:8000/api/auth/logout'
        console.log(formData);
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + cookieToken,
            }
        })
        document.cookie = 'token=; max-age=0;'

        getCookie('token')

    }

    return (<div className='w-100 bg-light'>
            <nav className="navbar navbar-dark bg-dark">
                <div className="container-fluid container">
                    <a className="navbar-brand">Spot2</a>
                    <form onSubmit={logout}>
                        <button type="submit" className="btn btn-light">Cerrar sesión</button>
                    </form>

                </div>
            </nav>
            <div className="container mt-2">
                <div className="mt-2">
                    <h1>Test redireccionamiento correcto si existo</h1>
                </div>
                
            </div>
        </div>)
  
}