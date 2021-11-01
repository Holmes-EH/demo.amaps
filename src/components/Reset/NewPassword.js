import { useContext, useState } from 'react'
import axios from 'axios'
import { store } from '../../store'

import { useHistory } from 'react-router-dom'

import Loader from '../Loader/Loader'
import Toaster from '../Toaster'

const NewPassword = () => {
	const globalState = useContext(store)
	const { dispatch } = globalState
	const { user, message, loading, messageType } = globalState.state

	const history = useHistory()

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
						Authorization: `Bearer ${user.shortLivedToken}`,
					},
				}
				const { data } = await axios.put(
					`${process.env.REACT_APP_API_URL}/api/users`,
					{ _id: user._id, password },
					config
				)
				localStorage.setItem('juju2fruits_user', JSON.stringify(data))
				dispatch({ type: 'USER_LOGIN', payload: data })
				dispatch({ type: 'FINISHED_LOADING' })
				dispatch({
					type: 'MESSAGE',
					payload:
						'Mot de passe enregistré avec succés !\nMaintenant, vous pouvez vous reconnecter',
					messageType: 'success',
				})
				history.push('/')
			} catch (error) {
				let message =
					error.response && error.response.data.message
						? error.response.data.message
						: error.message
				message +=
					'\nVeuillez renseigner votre mail à nouveau.\nInfo : Vous avez 2 minutes pour saisir et confirmer votre nouveau mot de passe...'
				dispatch({
					type: 'MESSAGE',
					payload: message,
					messageType: 'error',
				})
				dispatch({ type: 'FINISHED_LOADING' })
				history.push('recover')
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
				<div className='flex login column'>
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
