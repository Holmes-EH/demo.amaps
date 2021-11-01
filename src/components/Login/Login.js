import { useContext, useState } from 'react'
import axios from 'axios'
import { store } from '../../store'
import { useHistory } from 'react-router-dom'

import Loader from '../Loader/Loader'
import Lemon from '../Lemon'
import Toaster from '../Toaster'
import './login.css'
import Register from '../Register/Register'

const Login = () => {
	const globalState = useContext(store)
	const { dispatch } = globalState
	const { message, loading, messageType } = globalState.state

	let history = useHistory()

	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [register, setRegister] = useState(false)

	const inputChange = (e) => {
		switch (e.target.name) {
			case 'email':
				setEmail(e.target.value)
				break
			case 'password':
				setPassword(e.target.value)
				break
			default:
				break
		}
	}

	const login = async () => {
		dispatch({
			type: 'LOADING',
		})
		try {
			const { data } = await axios.post(
				`${process.env.REACT_APP_API_URL}/api/users/login`,
				{ email, password }
			)
			localStorage.setItem('juju2fruits_user', JSON.stringify(data))
			dispatch({ type: 'USER_LOGIN', payload: data })
			dispatch({ type: 'FINISHED_LOADING' })
		} catch (error) {
			dispatch({
				type: 'MESSAGE',
				payload:
					error.response && error.response.data.message
						? error.response.data.message
						: error.message,
				messageType: 'error',
			})
			dispatch({ type: 'FINISHED_LOADING' })
		}
	}

	const validateOnEnter = (e) => {
		if (
			e.key === 'Enter' &&
			!e.shiftKey &&
			email.length > 0 &&
			password.length > 0
		) {
			login()
		}
	}

	const resetPassword = () => {
		history.push('/recover')
	}

	return (
		<>
			{message && <Toaster message={message} type={messageType} />}
			{loading ? (
				<Loader />
			) : register ? (
				<Register setRegister={setRegister} />
			) : (
				<div className='flex login glass'>
					<div className='logo'>
						<Lemon />
					</div>
					<form onKeyPress={validateOnEnter}>
						<div className='field'>
							<input
								type='email'
								name='email'
								className='input'
								placeholder=''
								required
								onChange={(e) => inputChange(e)}
							/>
							<label htmlFor='email' className='label'>
								Email
							</label>
						</div>
						<div className='field'>
							<input
								type='password'
								name='password'
								className='input'
								placeholder=''
								required
								onChange={(e) => inputChange(e)}
							/>
							<label htmlFor='password' className='label'>
								Mot de Passe
							</label>
						</div>
					</form>
					<p
						className='forgotPassword'
						onClick={() => resetPassword()}
					>
						Mot de passe oublié ?
					</p>
					<div className='flex'>
						<button className='button' onClick={() => login()}>
							CONNEXION
						</button>
					</div>
					<div
						className='flex column'
						style={{ alignItems: 'center' }}
					>
						<p>Pas encore de compte ?</p>
						<div className='link' onClick={() => setRegister(true)}>
							Créez-en un ici
						</div>
					</div>
				</div>
			)}
		</>
	)
}

export default Login
