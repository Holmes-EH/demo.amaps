import { useContext, useState } from 'react'
import axios from 'axios'
import { store } from '../../store'
import { useHistory } from 'react-router-dom'

import Loader from '../Loader/Loader'
import Toaster from '../Toaster'

const Recover = () => {
	const globalState = useContext(store)
	const { dispatch } = globalState
	const { message, loading, messageType, amap } = globalState.state

	let history = useHistory()

	const [email, setEmail] = useState('')

	const resetPassword = async () => {
		dispatch({
			type: 'LOADING',
		})
		try {
			const { data } = await axios.post(
				`${process.env.REACT_APP_API_URL}/api/recovery/password`,
				{ email, amap: amap._id }
			)
			localStorage.setItem('juju2fruits_user', JSON.stringify(data))
			dispatch({ type: 'USER_LOGIN', payload: data })
			dispatch({ type: 'FINISHED_LOADING' })
			history.push('/reset')
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
		if (e.key === 'Enter' && !e.shiftKey && email.length > 0) {
			resetPassword()
		}
	}

	return (
		<>
			{message && <Toaster message={message} type={messageType} />}
			{loading ? (
				<Loader />
			) : (
				<div className='flex login'>
					<h2>Afin de remettre votre mot de passe à zéro,</h2>
					<h2>
						Merci de renseigner l'adresse mail avec laquelle vous
						avez créé votre compte :
					</h2>
					<form onKeyPress={validateOnEnter}>
						<div className='field'>
							<input
								type='email'
								name='email'
								className='input'
								placeholder=''
								required
								onChange={(e) => setEmail(e.target.value)}
							/>
							<label htmlFor='email' className='label'>
								Email
							</label>
						</div>
					</form>
					<div className='flex'>
						<button
							className='button'
							onClick={() => resetPassword()}
						>
							ENVOYER
						</button>
					</div>
				</div>
			)}
		</>
	)
}

export default Recover
