import { store } from '../../store'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'

import Toaster from '../Toaster'
import Lemon from '../Lemon'

const Info = () => {
	const globalState = useContext(store)
	const { session, message, messageType } = globalState.state

	const navigate = useNavigate()

	const elision = (month) => {
		const vowels = ['a', 'e', 'i', 'o', 'u', 'y', 'h']
		if (vowels.includes(month.slice(0, 1).toLowerCase())) {
			return `d'${month.toLowerCase()}`
		} else {
			return `de ${month.toLowerCase()}`
		}
	}

	return (
		<>
			{message && <Toaster message={message} type={messageType} />}
			{session.news ? (
				<div className='flex login' style={{ padding: '0' }}>
					<div
						className='flex column glass'
						style={{ padding: '1em' }}
					>
						<h3 style={{ textAlign: 'center' }}>
							Informations du mois
							<br />
							{elision(
								new Date(
									session.lastOrderDate
								).toLocaleDateString('fr-FR', { month: 'long' })
							)}
						</h3>

						{session.news.split('\n').map((p, index) => {
							return <p key={`message-${index}`}>{p}</p>
						})}
					</div>
					<button
						className='button'
						onClick={() => navigate('/commande')}
					>
						PASSER COMMANDE
					</button>
				</div>
			) : (
				<div className='flex login' style={{ padding: '0' }}>
					<div
						className='flex column glass'
						style={{ padding: '1em' }}
					>
						<div style={{ maxWidth: '170px', margin: 'auto' }}>
							<Lemon />
						</div>
						<h1>
							Les commandes pour ce mois-ci sont désormais
							clôturées...
						</h1>
						<h3 style={{ textAlign: 'center' }}>
							J'avertirai votre amap dès que les prochaines seront
							accessibles.
						</h3>
					</div>
				</div>
			)}
		</>
	)
}

export default Info
