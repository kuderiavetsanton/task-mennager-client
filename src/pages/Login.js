import React, { useState, useContext, useEffect } from 'react'

import { useLazyQuery, gql } from '@apollo/client'

import { v4 as uuidv4 } from 'uuid'

import { useUserContext } from '../userContext'


const LOGIN = gql`
    query login($email:String!,$password:String!){
        login(email:$email,password:$password){
            token,
            id,
            email
        }
    }
`

export default function Login(props) {
    const [ variables, setVariables ] = useState({email:'',password:''})

    const [ user,setUser ] = useUserContext()

    const [ error, setError ] = useState(null)

    const [loginUser] = useLazyQuery(LOGIN,{
        onCompleted(result){
            localStorage.setItem('token', result.login.token)
            setUser({ email:result.login.email, id:result.login.id })
            window.location.href = '/'
        },
        onError(err){
            setError(err.graphQLErrors[0]?.extensions.exception.error)

            console.log({...err})
        }
    })

    const handleChanges = (e) => {
        setVariables({...variables,[e.target.name]:e.target.value})
    }
    const handleSubmit = (e) => {
        e.preventDefault()
        loginUser({
            variables
        })
    }

    useEffect(() => {
        if(user){
            props.history.push('/')
        }
    }, []);
    return (
        <div className="container">
            <form onSubmit={handleSubmit} className="auth-form">
                {
                    error ? <p className="error__message">{ error }</p> : null
                }
                <div className="input__box">
                    <label>Enter your email</label>
                    <input type="email" name="email" onChange={handleChanges} value={ variables.email }/>
                </div>
                <div className="input__box">
                    <label>Enter your password</label>
                    <input type="password" name="password" onChange={handleChanges} value={ variables.password }/>
                </div>
                <button>Login</button>
            </form>
        </div>
    )
}
