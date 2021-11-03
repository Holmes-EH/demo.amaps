import { useState } from 'react'
import { useContext } from 'react'
import { store } from '../../store'
import axios from 'axios'

import { useHistory } from 'react-router'

import './user.css'

const User = () => {
	const globalContext = useContext(store)
	const { dispatch } = globalContext
	const { user, amap } = globalContext.state

	const history = useHistory()

	const [modfiy, setModfiy] = useState(false)
	const [resetPassword, setResetPassword] = useState(false)

	const [name, setName] = useState(user.name)
	const [email, setEmail] = useState(user.email)
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')

	const updateUser = async () => {
		if (email.length > 0 && name.length > 0) {
			dispatch({
				type: 'LOADING',
			})
			try {
				const config = {
					headers: {
						Authorization: `Bearer ${user.token}`,
					},
				}
				const { data } = await axios.put(
					`${process.env.REACT_APP_API_URL}/api/users`,
					{ _id: user._id, name, email },
					config
				)
				localStorage.setItem('juju2fruits_user', JSON.stringify(data))
				dispatch({ type: 'USER_LOGIN', payload: data })
				setModfiy(false)
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
	}

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

	const sendPasswordReset = async () => {
		if (
			window.confirm(
				'Après avoir réinitialisé votre mot de passe, il vous faudra vous reconnecter.\nÊtes-vous sûr-e de vouloir continuer?'
			)
		) {
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
							Authorization: `Bearer ${user.token}`,
						},
					}
					const { data } = await axios.put(
						`${process.env.REACT_APP_API_URL}/api/users`,
						{ _id: user._id, password },
						config
					)
					localStorage.setItem(
						'juju2fruits_user',
						JSON.stringify(data)
					)
					dispatch({ type: 'RESET_USER_LOGIN', payload: data })
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
					dispatch({
						type: 'MESSAGE',
						payload: message,
						messageType: 'error',
					})
					dispatch({ type: 'FINISHED_LOADING' })
				}
			} else if (password !== confirmPassword) {
				setPassword('')
				setConfirmPassword('')
				dispatch({
					type: 'MESSAGE',
					payload: 'Les mots de passe ne sont pas les mêmes...',
				})
			} else if (password.length === 0 || confirmPassword.length === 0) {
				dispatch({
					type: 'MESSAGE',
					payload: 'Les champs sont vides ...',
				})
			}
		}
	}

	return (
		<div className='flex column' style={{ width: '100%' }}>
			<div className='flex login glass'>
				<h2>Mes informations</h2>
				<div className='card'>
					<div className='data'>
						<p style={{ paddingRight: ' 5px' }}>Nom :</p>
						<p>
							<b>{user.name}</b>
						</p>
					</div>
					<div className='data'>
						<p style={{ paddingRight: ' 5px' }}>Email&nbsp;:</p>
						<p>
							<b>{user.email}</b>
						</p>
					</div>
					<div className='data'>
						<p style={{ paddingRight: ' 5px' }}>Mon Amap :</p>
						<p>
							<b>{amap.name}</b>
						</p>
					</div>
				</div>
			</div>
			<div className='flex login glass'>
				{modfiy ? (
					resetPassword ? (
						<>
							<form>
								<div className='field'>
									<input
										type='password'
										name='password'
										className='input'
										placeholder=''
										required
										value={password}
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
										value={confirmPassword}
										onChange={(e) => inputChange(e)}
									/>
									<label htmlFor='password' className='label'>
										Confirmer le mot de passe
									</label>
								</div>
							</form>
							<div className='flex'>
								<button
									className='button danger'
									onClick={() => {
										setPassword('')
										setConfirmPassword('')
										setModfiy(false)
									}}
								>
									ANNULER
								</button>
								<button
									className='button'
									onClick={() => sendPasswordReset()}
								>
									SAUVEGARDER
								</button>
							</div>
						</>
					) : (
						<>
							<form>
								<div className='field'>
									<input
										type='text'
										name='name'
										className='input'
										placeholder=''
										autoComplete='off'
										required
										value={name}
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
										value={email}
										onChange={(e) => inputChange(e)}
									/>
									<label htmlFor='email' className='label'>
										Email
									</label>
								</div>
							</form>
							<div className='flex'>
								<button
									className='button danger'
									onClick={() => setModfiy(false)}
								>
									ANNULER
								</button>
								<button
									className='button'
									onClick={() => updateUser()}
								>
									SAUVEGARDER
								</button>
							</div>
						</>
					)
				) : (
					<>
						<button
							className='button'
							onClick={() => setModfiy(true)}
						>
							MODIFIER MES INFOS
						</button>
						<button
							className='button'
							onClick={() => {
								setModfiy(true)
								setResetPassword(true)
							}}
						>
							RÉINITIALISER
							<br />
							MON MOT DE PASSE
						</button>
					</>
				)}
			</div>
		</div>
	)
}

export default User
