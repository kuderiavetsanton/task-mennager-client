import React, { useContext, useState, useEffect } from 'react'

import { useUserContext } from '../userContext'

import { gql, useMutation, useQuery } from '@apollo/client'

import './home.css'
import Task from '../components/Task/Task'

import { client } from '../ApolloProvider'

const ADD_TASK = gql`
    mutation addTask($title:String!,$description:String!){
        addTask(title:$title,description:$description){
            title 
            description
            status
            id
        }
    }
`

export const GET_TASKS = gql`
    {
        getTasks{
            userId,
            id,
            title,
            status,
            description
        }
    }
`

export default function Home(props) {

    const [ variables, setVariables ] = useState({title:'',description:''})

    const [user] = useUserContext()

    const { loading, data } = useQuery(GET_TASKS,{
        onError(err){
            console.log({...err})
        }
    })

    const handleChanges = (e) => {
        setVariables({...variables,[e.target.name]:e.target.value})
    }

    const [handleAddTaks] = useMutation(ADD_TASK,{
        onError(err){
            console.log({...err})
        },
        update(cache, { data: addTask}){
            let existingTasks = cache.readQuery({query:GET_TASKS})

            cache.writeQuery({
                query:GET_TASKS,
                data:{
                    getTasks:[...existingTasks.getTasks, addTask]
                }
            })
            console.log(existingTasks)
        }
    })

    useEffect(() => {
        client.resetStore()
        if(!user){
            props.history.push('/login')
        }
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault()
        handleAddTaks({
            variables
        })
        setVariables({title:'',description:''})
    }
    
    return (
        <div className="home__container">
            <form className="task-form" onSubmit={handleSubmit}>
                <div className="task__input__box">
                    <label>Title:</label>
                    <input type="text" name="title" value={variables.title} onChange={handleChanges}/>
                </div>
                <div className="task__input__box">
                    <label>Description:</label>
                    <input type="text" name="description" value={variables.description} onChange={handleChanges}/>
                </div>
                <button>Submit</button>
            </form>
            <ul className="tasks__list">
                <li className="task">
                    <p>Title</p>
                    <p>Description</p>
                    <p>Status</p>
                </li>
                {
                    loading ? <div className="spinner"></div> : 
                    data.getTasks.map(task => (
                        <Task key={task.id} task={task}/>
                    ))
                }
            </ul>
        </div>
    )
}
