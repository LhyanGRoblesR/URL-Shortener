'use client'
// 'use server'
import React from 'react'
import { FormEvent, useEffect, useState } from 'react'
import '../css/index.css'
import "bootstrap/dist/css/bootstrap.min.css";

export default function LoginPage() {

    const getCookie = (name: string) => {
        const cookieString = document.cookie;
        const cookies = cookieString.split(';').map(cookie => cookie.trim());
        for (const cookie of cookies) {
            const [cookieName, cookieValue] = cookie.split('=');
            if (cookieName === name) {
                location.replace('/')
            }
        }
        return '';
    };

    const login = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
 
        const formData = new FormData(event.currentTarget)
        const url = 'http://3.80.228.124/api/auth/login';
        console.log(formData);
        const response = await fetch(url, {
            method: 'POST',
            body: formData
        });
        const result = await response.json()
        console.log(result)
        if(result.status === 200){
            console.log('Logueo correcto', result.access_token)
            document.cookie = `token=${result.access_token}; max-age=${result.expires_in}`; 
            getCookie('token')
        }else{
            console.log('Logueo incorrecto', result)
            // setReturnUrl(pathname)
        }
    }

    useEffect(() => {
        require("bootstrap/dist/js/bootstrap.bundle.min.js");
        getCookie('token');
    }, []);

    return (
        <div className='w-100' style={{backgroundColor: 'gray'}}>
            <div className="container d-flex align-items-center " style={{height: '100vh'}}>
                <div className='m-auto border border-dark p-4 bg-light' style={{width: '600px'}}>
                    <h1 className='text-center'>Bienvenido</h1>
                    <form onSubmit={login}>
                        <div className="form-floating mb-3">
                            <input type="email" className="form-control" id="floatingInput" name='email' placeholder="name@example.com" />
                            <label htmlFor="floatingInput">Email:</label>
                        </div>
                        <div className="form-floating">
                            <input type="password" className="form-control" id="floatingPassword" name='password' placeholder="Password" />
                            <label htmlFor="floatingPassword">Password:</label>
                        </div>
                        <div className='text-center'>
                            <button type="submit" title="Ingresar" name="Ingresar" className='btn btn-dark mt-3 w-100'>Ingresar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
  
}