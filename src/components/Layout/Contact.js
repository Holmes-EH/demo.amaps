import { useState } from 'react'
import { useContext } from 'react'
import { store } from '../../store'
import axios from 'axios'

import Loader from '../Loader/Loader'
import Toaster from '../Toaster'

import './contact.css'

const Contact = () => {
	const globalContext = useContext(store)
	const { dispatch } = globalContext
	const { user, loading, message, messageType } = globalContext.state

	const [messageObject, setMessageObject] = useState('')
	const [objectRequired, setObjectRequired] = useState(false)
	const [messageBody, setMessageBody] = useState('')
	const [bodyRequired, setBodyRequired] = useState(false)

	const sendMessage = async () => {
		if (messageObject.length === 0) {
			setObjectRequired(true)
		} else {
			setObjectRequired(false)
		}
		if (messageBody.length === 0) {
			setBodyRequired(true)
		} else {
			setBodyRequired(false)
		}
		if (messageObject.length > 0 && messageBody.length > 0) {
			dispatch({ type: 'LOADING' })
			try {
				const config = {
					headers: {
						Authorization: `Bearer ${user.token}`,
					},
				}
				const { data } = await axios.post(
					`${process.env.REACT_APP_API_URL}/api/users/sendmessage`,
					{
						user,
						message: {
							object: messageObject,
							body: messageBody,
						},
					},
					config
				)
				console.log(data)
				dispatch({ type: 'FINISHED_LOADING' })
				dispatch({
					type: 'MESSAGE',
					payload: 'Votre message a été envoyé !',
					messageType: 'success',
				})
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

	return (
		<>
			{message && <Toaster message={message} type={messageType} />}
			<div
				className='flex glass column contact'
				style={{
					margin: 'auto',
				}}
			>
				{loading ? (
					<Loader />
				) : (
					<>
						<h2 style={{ marginBottom: '0' }}>
							Pour m'envoyer un message,
						</h2>
						<h2 style={{ marginTop: '0' }}>
							renseignez les champs suivants :
						</h2>
						<form
							className='flex column'
							style={{ padding: '10px' }}
						>
							<div className={objectRequired ? 'required' : ''}>
								<label htmlFor='object'>
									Objet :{' '}
									{objectRequired && (
										<span
											style={{
												color: 'var(--sanguine)',
												fontStyle: 'italic',
											}}
										>
											Ce champ est requis
										</span>
									)}
								</label>
								<input
									type='text'
									name='object'
									id='object'
									placeholder='Objet de votre message'
									onChange={(e) =>
										setMessageObject(e.target.value)
									}
									style={{ width: '100%' }}
								/>
							</div>
							<div className={bodyRequired ? 'required' : ''}>
								<label htmlFor='body'>
									Message :{' '}
									{bodyRequired && (
										<span
											style={{
												color: 'var(--sanguine)',
												fontStyle: 'italic',
											}}
										>
											Ce champ est requis
										</span>
									)}
								</label>
								<textarea
									cols='40'
									rows='10'
									name='body'
									placeholder='Votre message...'
									id='body'
									style={{ maxWidth: '100%' }}
									onChange={(e) =>
										setMessageBody(e.target.value)
									}
								></textarea>
							</div>
						</form>
						<button className='button' onClick={sendMessage}>
							ENVOYER
						</button>
					</>
				)}
			</div>
		</>
	)
}

export default Contact
