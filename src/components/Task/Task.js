import React, { useState } from 'react'
import './task.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner, faTrash, faCircleNotch, faCheckCircle } from '@fortawesome/free-solid-svg-icons'

import { gql, useMutation } from '@apollo/client'

import {GET_TASKS} from '../../pages/Home'

const UPDATE_STATUS = gql`
    mutation updateStatus($taskId:ID!,$status:String!,$userId:ID!){
        updateStatus(taskId:$taskId,status:$status,userId:$userId){
            id 
            status
        }
    }
`

const REMOVE_TASK = gql`
    mutation removeTask($id:ID!,$userId:ID!){
        removeTask(id:$id,userId:$userId){
                id
        }
    }
`

export default function Task({ task }) {
    const [isActive,setIsActive] = useState(false)

    let status;
    if(task.status === 'open'){
        status = <>
            <FontAwesomeIcon size="lg" icon={faCircleNotch}  className="status-icon"  onClick={() => {
                setIsActive(!isActive)
            }}/>
            <div className={isActive ? 'chooseStatus active' : 'chooseStatus'}>
                <FontAwesomeIcon size="lg" icon={faSpinner} className="status-icon" onClick={() => handleUpdateStatus(task.id,'pending',task.userId)}/>
                <FontAwesomeIcon size="lg" icon={faCheckCircle} className="status-icon" onClick={() => handleUpdateStatus(task.id,'closed',task.userId)}/>
            </div>
        </>
    }else if(task.status === 'closed'){
        status = <>
            <FontAwesomeIcon size="lg" icon={faCheckCircle} className="status-icon" onClick={() => {
                setIsActive(!isActive)
            }}/>
        </>
    }else{
        status = <>
            <FontAwesomeIcon size="lg" icon={faSpinner} className="status-icon" onClick={() => {
                setIsActive(!isActive)
            }}/>
            <div className={isActive ? 'chooseStatus active' : 'chooseStatus'}>
                <FontAwesomeIcon size="lg" icon={faCheckCircle} className="status-icon" onClick={() => handleUpdateStatus(task.id,'closed',task.userId)}/>
            </div>
        </>
    }

    let [removeTask] = useMutation(REMOVE_TASK,{
        update(cache,{data:{removeTask}}){
            let existingTasks = cache.readQuery({query:GET_TASKS})

            cache.writeQuery({
                query:GET_TASKS,
                data:{
                    getTasks:existingTasks.getTasks.filter(task => task.id !== removeTask.id)
                }
            })
            console.log(existingTasks)
        },
        onError(err){
            console.log({...err})
        }
    })

    let [ updateStatus ] = useMutation(UPDATE_STATUS,{
        onError(err){
            console.log({...err})
        }
    })

    let handleUpdateStatus = (taskId,status,userId) => {
        setIsActive(false)
        updateStatus({
            variables:{
                taskId,
                status,
                userId
            }
        })
    }

    return (
        <div className={task.status === 'closed' ? 'task closed' : 'task'}>
            <p>{task.title}</p>
            <p>{task.description}</p>
            <div className="status__box">{status}</div>
            <p><FontAwesomeIcon size="lg" icon={faTrash} className="delete__icon" onClick={() => {
                removeTask({
                    variables:{
                        id:task.id,
                        userId:task.userId
                    }
                })
            }}/></p>
        </div>
    )
}
