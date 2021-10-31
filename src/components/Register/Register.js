import { useContext, useState } from 'react'
import axios from 'axios'
import { store } from '../../store'
import Loader from '../Loader/Loader'
import Lemon from '../Lemon'
import Toaster from '../Toaster'

const Register = () => {
	const globalState = useContext(store)
	const { dispatch } = globalState
	const { message, loading, messageType, amap } = globalState.state

	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')

	const inputChange = (e) => {
		switch (e.target.name) {
			case 'name':
				setName(e.target.value)
				break
			case 'email':
				setEmail(e.target.value)
				break
			case 'password':
				setPassword(e.target.value)
				break
			case 'confirmPassword':
				setConfirmPassword(e.target.value)
				break
			default:
				break
		}
	}

	const register = async () => {
		if (
			email.length > 0 &&
			password.length > 0 &&
			confirmPassword.length > 0 &&
			password === confirmPassword
		) {
			dispatch({
				type: 'LOADING',
			})
			try {
				const { data } = await axios.post(
					`${process.env.REACT_APP_API_URL}/api/users`,
					{ name, email, password, amap: amap._id }
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
		} else if (password !== confirmPassword) {
			dispatch({
				type: 'MESSAGE',
				payload: 'Les mots de passe ne sont pas les mêmes...',
			})
		}
	}

	return (
		<div className='flex column'>
			{message && <Toaster message={message} type={messageType} />}
			{loading ? (
				<Loader />
			) : (
				<>
					<div className='logo'>
						<Lemon />
					</div>
					<form>
						<div className='field'>
							<input
								type='text'
								name='name'
								className='input'
								placeholder=''
								autoComplete='off'
								required
								onChange={(e) => inputChange(e)}
							/>
							<label htmlFor='email' className='label'>
								Nom et prénom
							</label>
						</div>
						<div className='field'>
							<input
								type='email'
								name='email'
								className='input'
								placeholder=''
								autoComplete='off'
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
						<div className='field'>
							<input
								type='password'
								name='confirmPassword'
								className='input'
								placeholder=''
								required
								onChange={(e) => inputChange(e)}
							/>
							<label htmlFor='password' className='label'>
								Confirmer le mot de passe
							</label>
						</div>
					</form>
					<div className='flex'>
						<button className='button' onClick={() => register()}>
							CRÉER MON COMPTE
						</button>
					</div>
				</>
			)}
		</div>
	)
}

export default Register
