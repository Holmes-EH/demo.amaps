import { useState, useRef, useContext } from 'react'
import { store } from '../../store'
import axios from 'axios'

import Loader from '../Loader/Loader'
import Toaster from '../Toaster'
import Lemon from '../Lemon'

import './firstContact.css'

const FirstContact = () => {
	const globalContext = useContext(store)
	const { dispatch } = globalContext
	const { loading, message, messageType } = globalContext.state

	const [name, setName] = useState('')
	const [nameRequired, setNameRequired] = useState(false)
	const [email, setEmail] = useState('')
	const [emailRequired, setEmailRequired] = useState(false)
	const [messageBody, setMessageBody] = useState('')
	const [bodyRequired, setBodyRequired] = useState(false)

	const [isHuman, setIsHuman] = useState(false)
	const [testingStarted, setTestingStarted] = useState(false)

	const timeout = useRef(null)

	const startTesting = (e) => {
		e.preventDefault()
		document.body.className = 'unselectable'
		setTestingStarted(true)
		timeout.current = setTimeout(() => {
			setIsHuman(true)
		}, 5010)
	}
	const stopTesting = (e) => {
		e.preventDefault()
		clearTimeout(timeout.current)
		document.body.className = null
		setTestingStarted(false)
	}

	const sendMessage = async () => {
		if (name.length === 0) {
			setNameRequired(true)
		} else {
			setNameRequired(false)
		}
		if (email.length === 0) {
			setEmailRequired(true)
		} else {
			setEmailRequired(false)
		}
		if (messageBody.length === 0) {
			setBodyRequired(true)
		} else {
			setBodyRequired(false)
		}
		if (name.length > 0 && email.length > 0 && messageBody.length > 0) {
			dispatch({ type: 'LOADING' })
			try {
				await axios.post(
					`${process.env.REACT_APP_API_URL}/api/newcontact`,
					{
						name,
						email,
						body: messageBody,
					}
				)

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
			{loading ? (
				<Loader />
			) : (
				<div
					className='flex glass column contact'
					style={{
						margin: 'auto',
					}}
				>
					<h2 style={{ marginBottom: '0' }}>
						Pour m'envoyer un message,
					</h2>
					<h2 style={{ marginTop: '0' }}>
						renseignez les champs suivants :
					</h2>
					<form className='flex column' style={{ padding: '10px' }}>
						<div className={nameRequired ? 'required' : ''}>
							<label htmlFor='object'>
								Nom et Prénom :{' '}
								{nameRequired && (
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
								name='name'
								id='name'
								placeholder='Votre nom et prénom'
								onChange={(e) => setName(e.target.value)}
								style={{ width: '100%' }}
							/>
						</div>
						<div className={emailRequired ? 'required' : ''}>
							<label htmlFor='object'>
								Adresse mail :{' '}
								{emailRequired && (
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
								type='email'
								name='email'
								id='email'
								placeholder='Votre nom et prénom'
								onChange={(e) => setEmail(e.target.value)}
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
								onChange={(e) => setMessageBody(e.target.value)}
							></textarea>
						</div>
					</form>
					{isHuman ? (
						<button className='button' onClick={sendMessage}>
							ENVOYER
						</button>
					) : (
						<div className='captcha'>
							<p>
								Avant de pouvoir envoyer votre message,
								<br />
								cliquez sur ce cercle pendant 5 secondes
							</p>
							<div
								className={
									testingStarted ? 'icon testing' : 'icon'
								}
								onMouseDown={(e) => startTesting(e)}
								onTouchStart={(e) => startTesting(e)}
								onMouseUp={(e) => stopTesting(e)}
								onTouchEnd={(e) => stopTesting(e)}
							>
								<Lemon />
							</div>
						</div>
					)}
				</div>
			)}
		</>
	)
}

export default FirstContact
