import { useRef, useState } from "react"
import { Link } from "react-router-dom"
import { useStateContext } from "../context/ContextProvider"
import axiosClient from "../axios-client"

export default function Login() {
    const emailRef = useRef()
    const passwordRef = useRef()
    const[loading, setLoading] = useState(false)
    const [errors, setErrors] = useState(null)
    const {setUser, setToken} = useStateContext()
    
    const onSubmit = (ev) => {
        ev.preventDefault()
        setLoading(true)
        const payload = {
            email : emailRef.current.value,
            password : passwordRef.current.value,
        }

        // console.log(payload);
        axiosClient.post('/login', payload)
        .then(({data})=> {
            // console.log(data);
            setLoading(false)

            setUser(data.user)
            setToken(data.token)
        })
        .catch(err=> {
            // console.log(err);
            setLoading(false)

            const response = err.response
            if(response && response.status === 422){
                if(response.data.errors){
                    setErrors(response.data.errors)
                }else{
                    setErrors({
                        email: [response.data.message]
                    })

                }
            }
        })
    }


  return (

            <form onSubmit={onSubmit}>
                <h1 className="title">
                    Login into your account
                </h1>
                {errors &&
                        <div className="alert">
                            {Object.keys(errors).map(key => (
                                <p key={key} >{errors[key][0]}</p>
                            ))}
                        </div>
                }
                <input ref={emailRef} placeholder="email" type="email" />
                <input ref={passwordRef} placeholder="Password" type="password" />
                <button className="btn btn-block" disabled={loading} >{loading ? 'Processing' : 'Login'}</button>
                <p className="message">
                    Not Registered ? <Link to='/signup'>Create an account</Link>
                </p>
            </form>

  )
}
