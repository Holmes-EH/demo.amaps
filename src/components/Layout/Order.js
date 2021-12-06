import { useEffect, useState } from 'react'
import { useContext } from 'react'
import { store } from '../../store'
import axios from 'axios'

import Loader from '../Loader/Loader'

const Order = () => {
	const globalContext = useContext(store)
	const { dispatch } = globalContext
	const {
		user,
		loading,
		products,
		session,
		amap,
		nextDelivery,
		existingOrder,
	} = globalContext.state

	const elision = (productTitle) => {
		const vowels = ['a', 'e', 'i', 'o', 'u', 'y', 'h']
		if (vowels.includes(productTitle.slice(0, 1).toLowerCase())) {
			return `d'${productTitle.toLowerCase()}`
		} else {
			return `de ${productTitle.toLowerCase()}`
		}
	}

	const [details, setDetails] = useState([])
	const [clickedRecallOrder, setClickedRecallOrder] = useState(false)

	const getOrderTotal = (total, detail) => {
		return total + detail.quantity * detail.product.pricePerKg
	}

	const setQuantity = (product, quantity) => {
		let confirmed = false
		const message = () => {
			return product.title === 'Mangues'
				? `${quantity} ${product.title}`
				: `${quantity} kg ${elision(product.title)}`
		}
		if (quantity > 10) {
			if (
				window.confirm(
					`Vous êtes sur le point de commander ${message()}\nVoulez-vous continuer ?`
				)
			) {
				confirmed = true
			}
		} else {
			confirmed = true
		}

		if (confirmed) {
			let newDetails = [...details]
			let detail = newDetails.filter(
				(detail) => detail.product._id === product._id
			)
			if (detail.length > 0) {
				const detailIndex = details.findIndex(
					(detail) => detail.product._id === product._id
				)
				newDetails[detailIndex].quantity = quantity
			} else {
				newDetails.push({ product, quantity })
			}
			setDetails(newDetails)
		}
	}

	const sendOrder = async () => {
		dispatch({ type: 'LOADING' })
		let detailsToSend = []
		details.forEach((detail) => {
			detailsToSend.push({
				product: detail.product._id,
				quantity: detail.quantity,
			})
		})
		const body = {
			client: user._id,
			details: detailsToSend,
			amap: amap._id,
			session: session.session,
		}
		try {
			const config = {
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
			}
			if (
				existingOrder &&
				existingOrder._id &&
				existingOrder.session === session.session
			) {
				const { data } = await axios.put(
					`${process.env.REACT_APP_API_URL}/api/orders`,
					{ order: { _id: existingOrder._id, details } },
					config
				)
				dispatch({ type: 'SET_EXISTING_ORDER', payload: data })
				dispatch({
					type: 'MESSAGE',
					payload: 'Commande mise à jour !',
					messageType: 'success',
				})
			} else {
				const { data } = await axios.post(
					`${process.env.REACT_APP_API_URL}/api/orders`,
					body,
					config
				)
				dispatch({ type: 'SET_EXISTING_ORDER', payload: data })
				dispatch({
					type: 'MESSAGE',
					payload: 'Commande envoyée !',
					messageType: 'success',
				})
			}

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

	const getPreviousOrder = async () => {
		setClickedRecallOrder(true)
		dispatch({ type: 'LOADING' })
		try {
			const config = {
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
			}
			const { data } = await axios.get(
				`${process.env.REACT_APP_API_URL}/api/orders/myorders?limit=2`,
				config
			)

			if (data.userOrders.length > 0) {
				setDetails(data.userOrders.at(-1).details)
				dispatch({ type: 'FINISHED_LOADING' })
			} else {
				dispatch({
					type: 'MESSAGE',
					payload:
						"Nous n'avons pas trouvé de commande à reprendre...\nMerci de renseigner les champs ci-dessous.",
					messageType: 'error',
				})
				dispatch({ type: 'FINISHED_LOADING' })
			}
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

	// eslint-disable-next-line
	useEffect(() => {
		if (existingOrder && existingOrder.details) {
			setDetails(existingOrder.details)
			setClickedRecallOrder(true)
		}
	})

	useEffect(() => {
		const getNextDelivery = async () => {
			dispatch({ type: 'LOADING' })
			try {
				const config = {
					headers: {
						Authorization: `Bearer ${user.token}`,
					},
				}
				const { data } = await axios.get(
					`${process.env.REACT_APP_API_URL}/api/orders/recaps/nextdelivery?session=${session.session}&amap=${amap._id}`,
					config
				)
				dispatch({ type: 'SET_NEXT_DELIVERY', payload: data.delivery })
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
		if (
			nextDelivery &&
			Object.keys(nextDelivery).length === 0 &&
			Object.getPrototypeOf(nextDelivery) === Object.prototype
		) {
			getNextDelivery()
		}
	}, [dispatch, user.token, session.session, amap._id, nextDelivery])

	useEffect(() => {
		let initialDetails = []
		products.map((product) => {
			return initialDetails.push({ product, quantity: 0 })
		})
		setDetails(initialDetails)
	}, [products])

	return (
		<div className='flex glass order column'>
			{loading ? (
				<Loader />
			) : (
				<>
					<h3 style={{ textAlign: 'center', marginTop: '0' }}>
						Votre commande :
					</h3>

					<form>
						{details.map((detail) => {
							return (
								products.filter(
									(product) =>
										detail.product._id === product._id
								)[0].isAvailable && (
									<div
										key={detail.product._id}
										className='productInput flex'
									>
										<label htmlFor={detail.product.title}>
											{detail.product.title}
											<br />
											<i
												style={{
													fontSize: '0.8em',
												}}
											>
												{detail.product.title ===
												'Mangues'
													? 'Pièces'
													: 'Kilos'}
											</i>
										</label>
										<input
											type='number'
											inputMode='numeric'
											min='0'
											name={detail.product.title}
											value={detail.quantity}
											autoComplete='off'
											onChange={(e) =>
												setQuantity(
													detail.product,
													e.target.value
												)
											}
										/>
									</div>
								)
							)
						})}
					</form>
					<div className='total flex'>
						<h3 style={{ margin: '0' }}>
							Total :{' '}
							{details.reduce(getOrderTotal, 0).toFixed(2)} €
						</h3>
					</div>
					<button className='button' onClick={() => sendOrder()}>
						PASSER COMMANDE
					</button>
					{!clickedRecallOrder && (
						<button
							className='button'
							onClick={() => getPreviousOrder()}
						>
							Reprendre ma dernière commande
						</button>
					)}
					<h3 style={{ textAlign: 'center', marginTop: '0' }}>
						Distribution prévue le
						<br />
						{new Date(nextDelivery).toLocaleDateString('fr-FR', {
							weekday: 'long',
							day: 'numeric',
							month: 'long',
						})}
					</h3>
				</>
			)}
		</div>
	)
}

export default Order
