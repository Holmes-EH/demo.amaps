import { useContext, useState } from 'react'
import axios from 'axios'
import { store } from '../../store'

import { useNavigate, useLocation } from 'react-router-dom'

import Loader from '../Loader/Loader'
import Toaster from '../Toaster'

const NewPassword = () => {
	const globalState = useContext(store)
	const { dispatch } = globalState
	const { user, message, loading, messageType } = globalState.state

	const navigate = useNavigate()
	const slt = useLocation().search.substr(1).split('&')[0]
	const userId = useLocation().search.substr(1).split('&')[1]

	console.log(slt)

	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')

	const inputChange = (e) => {
		switch (e.target.name) {
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

	const updateUser = async () => {
		if (
			password.length > 0 &&
			confirmPassword.length > 0 &&
			password === confirmPassword
		) {
			dispatch({
				type: 'LOADING',
			})
			try {
				const config = {
					headers: {
						Authorization: `Bearer ${slt}`,
					},
				}
				const { data } = await axios.put(
					`${process.env.REACT_APP_API_URL}/api/users`,
					{ _id: userId, password },
					config
				)
				localStorage.setItem('juju2fruits_user', JSON.stringify(data))
				dispatch({ type: 'FINISHED_LOADING' })
				dispatch({
					type: 'MESSAGE',
					payload:
						'Mot de passe enregistré avec succés !\nMaintenant, vous pouvez vous reconnecter',
					messageType: 'success',
				})
				navigate('/')
			} catch (error) {
				let message =
					error.response && error.response.data.message
						? error.response.data.message
						: error.message
				dispatch({
					type: 'MESSAGE',
					payload: message,
					messageType: 'error',
				})
				dispatch({ type: 'FINISHED_LOADING' })
				navigate('/')
			}
		} else if (password !== confirmPassword) {
			dispatch({
				type: 'MESSAGE',
				payload: 'Les mots de passe ne sont pas les mêmes...',
			})
		}
	}

	return (
		<>
			{message && <Toaster message={message} type={messageType} />}
			{loading ? (
				<Loader />
			) : (
				<div className='flex login column glass'>
					<h2>
						Bonjour
						<br />
						{user.name}
					</h2>
					<h3 style={{ textAlign: 'center' }}>
						Veuillez saisir un nouveau mot de passe:
					</h3>
					<form>
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
					<div
						className='flex column'
						style={{ alignItems: 'center' }}
					>
						<button className='button' onClick={() => updateUser()}>
							ENREGISTRER
						</button>
					</div>
				</div>
			)}
		</>
	)
}

export default NewPassword
