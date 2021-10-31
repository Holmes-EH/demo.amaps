import { useContext } from 'react'
import { store } from '../store'
import './toaster.css'

const Toaster = ({ message, type = 'error' }) => {
	const globalState = useContext(store)
	const { dispatch } = globalState

	const dismissMessage = () => {
		dispatch({
			type: 'RESET_MESSAGE',
		})
		dispatch({
			type: 'FINISHED_LOADING',
		})
	}
	return (
		<div className='flex toastContainer'>
			<div className={`toast ${type}`} onClick={dismissMessage}>
				{type === 'error' ? (
					<h1>😬</h1>
				) : type === 'success' ? (
					<h1>😁</h1>
				) : (
					<h1>🧐</h1>
				)}
				{message.split('\n').map((p, index) => {
					return <p key={`message-${index}`}>{p}</p>
				})}
			</div>
		</div>
	)
}

export default Toaster
