'use client'

import { FormEvent, useEffect, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import "bootstrap/dist/css/bootstrap.min.css";

export default function UrlShortener() {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const fullUrl = `${pathname}${(searchParams.size > 0 ? '?' + searchParams : '')}`
    const [returnUrl, setReturnUrl] = useState('');
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

    const toUrlShortener = async () => {
        
        const url = 'http://3.80.228.124/api' + fullUrl;
        console.log(url);
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'content-type': 'application/json',
                'Authorization': 'Bearer ' + cookieToken,
            }
        });
        const result = await response.json()
        console.log(result)
        if(result.status === 200 && result.urlshortener == 1){
            console.log('Me encontro', result.to_url)
            location.replace(result.to_url)
        }else{
            console.log('No me encontro', result)
            setReturnUrl(fullUrl)
        }
    }

    useEffect(() => {
        require("bootstrap/dist/js/bootstrap.bundle.min.js");
        getCookie('token')
    }, [])

    useEffect(() => {
        if (cookieToken) {
            toUrlShortener();
        }
    }, [cookieToken]);

    const logout = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
 
        const formData = new FormData(event.currentTarget)
        const url = 'http://3.80.228.124/api/auth/logout'
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

    return (<div className='w-100'>
            <nav className="navbar navbar-dark bg-dark">
                <div className="container-fluid container">
                    <a className="navbar-brand">Spot2</a>
                    <form onSubmit={logout}>
                        <button type="submit" className="btn btn-light">Cerrar sesión</button>
                    </form>

                </div>
            </nav>
            <div className="container mt-2 bg-light">
                <div className="mt-2">
                    <h1>{returnUrl}</h1>
                    
                </div>
                
            </div>
        </div>)
  
}