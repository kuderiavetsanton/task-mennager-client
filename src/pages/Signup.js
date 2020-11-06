import React, { useState, useEffect } from 'react'
import { gql, useMutation } from '@apollo/client'

import { v4 as uuidv4 } from 'uuid'

import { useUserContext } from '../userContext'

const SIGN_UP = gql`
    mutation($email:String!,$password:String!,$confirmPassword:String!){
        signUp(email:$email,password:$password,confirmPassword:$confirmPassword){
            email
        }
    }
`


export default function Signup(props) {
    const [ variables, setVariables ] = useState({email:'',password:'',confirmPassword:''})

    const [ errors, setErrors ] = useState({})

    const [ user,setUser ] = useUserContext()

    const [signUpUser] = useMutation(SIGN_UP,{
        onCompleted(){
            props.history.push('/login')
        },
        onError(err){
            setErrors(err.graphQLErrors[0]?.extensions.exception.errors)

            console.log({...err})  
        }
    })

    const handleChanges = (e) => {
        setVariables({...variables,[e.target.name]:e.target.value})
    }
    const handleSubmit = (e) => {
        e.preventDefault()
        signUpUser({
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
                    Object.keys(errors).length > 0 ? Object.values(errors).map(singleErr => {
                        return  <p className="error__message" key={uuidv4()}>{ singleErr }</p>
                    }) : null
                }
                <div className="input__box">
                    <label>Enter your email</label>
                    <input type="email" name="email" onChange={handleChanges} value={variables.email}/>
                </div>
                <div className="input__box">
                    <label>Enter your password</label>
                    <input type="password" name="password" onChange={handleChanges} value={variables.password}/>
                </div>
                <div className="input__box">
                    <label>Confirm your password</label>
                    <input type="password" name="confirmPassword" onChange={handleChanges} value={variables.confirmPassword}/>
                </div>
                <button>Sign Up</button>
            </form>
        </div>
    )
}
