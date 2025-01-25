import { useRef, useState } from "react"
import { Link } from "react-router-dom"
import axiosClient from "../axios-client"
import { useStateContext } from "../context/ContextProvider"

export default function Signup() {
    const nameRef = useRef()
    const emailRef = useRef()
    const passwordRef = useRef()
    const passwordConfirmationRef = useRef()

    const[loading, setLoading] = useState(false)
    const [errors, setErrors] = useState(null)
    const {setUser, setToken} = useStateContext()

    const onSubmit = (ev) => {
        ev.preventDefault()
        setLoading(true)
        const payload = {
            name : nameRef.current.value, 
            email : emailRef.current.value,
            password : passwordRef.current.value,
            password_confirmation : passwordConfirmationRef.current.value,
        }

        // console.log(payload);
        axiosClient.post('/signup', payload)
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
                setErrors(response.data.errors)
            }
        })
    }
    return (
                <form onSubmit={onSubmit}>
                    <h1 className="title">
                        Create Your Account
                    </h1>
                    {errors &&
                        <div className="alert">
                            {Object.keys(errors).map(key => (
                                <p key={key} >{errors[key][0]}</p>
                            ))}
                        </div>
                    }
                    <input ref={nameRef} placeholder="Fullname" type="text" />
                    <input ref={emailRef} placeholder="email" type="email" />
                    <input ref={passwordRef} placeholder="Password" type="password" />
                    <input ref={passwordConfirmationRef} placeholder="Password Confirmation" type="password" />
                    <button className="btn btn-block" disabled={loading} >{loading ? 'Processing' : 'Submit'}</button>
                    <p className="message">
                        Already Registered ? <Link to='/login'>Sign in</Link>
                    </p>
                </form>

    )
}
