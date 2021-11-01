import { store } from '../../store'
import { useContext } from 'react'
import { useHistory } from 'react-router-dom'

import Loader from '../Loader/Loader'
import Toaster from '../Toaster'

const Info = () => {
	const globalState = useContext(store)
	const { session, message, loading, messageType } = globalState.state

	const history = useHistory()

	return (
		<>
			{message && <Toaster message={message} type={messageType} />}
			{loading ? (
				<Loader />
			) : session.news ? (
				<div className='flex login' style={{ padding: '0' }}>
					<div
						className='flex column glass'
						style={{ padding: '1em' }}
					>
						<h3 style={{ textAlign: 'center' }}>
							Informations du mois de
							<br />
							{new Date(session.lastOrderDate).toLocaleDateString(
								'fr-FR',
								{ month: 'long' }
							)}
						</h3>

						{session.news.split('\n').map((p, index) => {
							return <p key={`message-${index}`}>{p}</p>
						})}
					</div>
					<button
						className='button'
						onClick={() => history.push('/commande')}
					>
						PASSER COMMANDE
					</button>
				</div>
			) : (
				history.push('/commande')
			)}
		</>
	)
}

export default Info
