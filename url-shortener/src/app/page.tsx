'use client'
// 'use server'
import React from 'react'
import { FormEvent, useEffect, useState } from 'react'
import './css/index.css'
import "bootstrap/dist/css/bootstrap.min.css";


export default function Home() {

    const [rowUrlShortener, setRowUrlShortener] = useState([]);
    const [cookieToken, setCookieToken] = useState('');

    const getCookie = (name: string) => {
        const cookieString = document.cookie;
        const cookies = cookieString.split(';').map(cookie => cookie.trim());
        let getToken = ''
        for (const cookie of cookies) {
            const [cookieName, cookieValue] = cookie.split('=');
            if (cookieName === name) {
                setCookieToken(cookieValue)
                getToken = cookieValue;
                console.log(cookieValue);
            }
        }
        if(getToken == ''){
            location.replace('/login')
        }
        return '';
    };

    const generateUrl = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
 
        const formData = new FormData(event.currentTarget)
        const url = 'http://127.0.0.1:8000/api/url/shortener';
        console.log(formData);
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + cookieToken,
            },
            body: formData
        });
        const result = await response.json()
        console.log(result)
        if(result.status === 200){
            getUrlShortener()
        }else{
            console.log('Algo salio mal', result)
        }
    }

    const getUrlShortener = async () => {
        const url = 'http://127.0.0.1:8000/api/url';
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'content-type': 'application/json',
                'Authorization': 'Bearer ' + cookieToken,
            }
        });
        const result = await response.json()
        console.log(result)
        if(result.status === 200){
            setRowUrlShortener(result.urls)
        }else{
            console.log('Algo salio mal', result)
            // setReturnUrl(pathname)
        }
    }
    
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
    

    useEffect(() => {
        require("bootstrap/dist/js/bootstrap.bundle.min.js");
        getCookie('token');
    }, []);

    useEffect(() => {
        if (cookieToken) {
            getUrlShortener();
        }
    }, [cookieToken]);

    return (
        <div className='w-100 bg-light'>
            <nav className="navbar navbar-dark bg-dark">
                <div className="container-fluid container">
                    <a className="navbar-brand color-light">Spot2</a>
                    <form onSubmit={logout}>
                        <button type="submit" className="btn btn-light">Cerrar sesión</button>
                    </form>

                </div>
            </nav>
            <div className="container mt-2 ">
                <div className="mt-2">
                    <h1 className='text-center'>Acortar URL's</h1>
                    
                    <form onSubmit={generateUrl}>
                        <div className="input-group mb-3">
                            <div className="input-group-prepend">
                                <span className="input-group-text" id="basic-addon1">/</span>
                            </div>
                        <input type="text" className="form-control" name='toUrl' placeholder="Ingresa la URL" required />
                        </div>
                        <button type="submit" className="btn btn-dark mt-1">Convertir y agregar</button>
                    </form>
                </div>
                
                <div className='border border-dark mt-4'>
                    <table className="table table-hover">                    
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>URL acortada</th>
                                <th>URL original</th>
                            </tr>
                        </thead>
                        <tbody>
                        {rowUrlShortener.map((row, key) => (
                            <tr key={key}>
                                <td>{row.id}</td>
                                <td><a href={row.key_url} target='_blank'>{row.key_url}</a></td>
                                <td><a href={row.to_url} target='_blank'>{row.to_url}</a></td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            
            </div>
        </div>
    );
  
}