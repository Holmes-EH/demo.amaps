import { store } from '../../store'
import { useContext, useState } from 'react'
import axios from 'axios'

import Loader from '../Loader/Loader'
import Lemon from '../Lemon'
import Toaster from '../Toaster'

import './landing.css'

const Landing = () => {
	const globalState = useContext(store)
	const { dispatch } = globalState

	const { message, loading, messageType } = globalState.state

	const [amapCode, setAmapCode] = useState('')

	const checkAmap = async (e) => {
		e.preventDefault()
		if (amapCode.toString().length === 6) {
			dispatch({
				type: 'LOADING',
			})
			try {
				const { data } = await axios.post(
					`${process.env.REACT_APP_API_URL}/api/amaps/access`,
					{ amapCode: parseInt(amapCode) }
				)
				localStorage.setItem('juju2fruits_amap', JSON.stringify(data))
				dispatch({ type: 'SET_AMAP', payload: data })
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
		} else {
			dispatch({
				type: 'MESSAGE',
				payload:
					'Vérifiez la saisie du code Amap. Il doit comporter 6 chiffres...',
				messageType: 'error',
			})
		}
	}

	return (
		<>
			{message && <Toaster message={message} type={messageType} />}
			{loading ? (
				<Loader />
			) : (
				<div className='flex login glass'>
					<div className='logo'>
						<Lemon />
					</div>
					<h3 style={{ textAlign: 'center', marginBottom: '0' }}>
						Bienvenue !
					</h3>
					<p style={{ textAlign: 'center' }}>
						Veuillez saisir le
						<br />
						<b>code d'accès</b>{' '}
						<i style={{ fontSize: '0.8em' }}>code à 6 chiffres</i>
						<br />
						qui vous a été envoyé par email
					</p>
					<form onSubmit={(e) => checkAmap(e)}>
						<div className='field'>
							<input
								type='number'
								name='amapCode'
								className='input'
								inputMode='numeric'
								placeholder=''
								required
								onChange={(e) => setAmapCode(e.target.value)}
							/>
							<label htmlFor='email' className='label'>
								Code Amap
							</label>
						</div>
					</form>
					<div className='flex'>
						<button
							className='button'
							onClick={(e) => checkAmap(e)}
						>
							Étape suivante
						</button>
					</div>
				</div>
			)}
		</>
	)
}

export default Landing
