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

	const [details, setDetails] = useState([])

	const getOrderTotal = (total, detail) => {
		return total + detail.quantity * detail.product.pricePerKg
	}

	const setQuantity = (product, quantity) => {
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
			dispatch({ type: 'FINISHED_LOADING' })
			setDetails(data.userOrders.at(-1).details)
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

	useEffect(() => {
		if (existingOrder && existingOrder.details) {
			setDetails(existingOrder.details)
		}
	}, [existingOrder])

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
		if (nextDelivery === {}) {
			getNextDelivery()
		}
	}, [dispatch, user.token, session.session, amap._id, nextDelivery])

	return (
		<div className='flex glass order column'>
			{loading ? (
				<Loader />
			) : (
				<>
					<h3 style={{ textAlign: 'center', marginTop: '0' }}>
						Votre commande
						<br />
						Distribution prévue le
						<br />
						{new Date(nextDelivery).toLocaleDateString('fr-FR', {
							weekday: 'long',
							day: 'numeric',
							month: 'long',
						})}
					</h3>

					<form>
						{products.map((product) => {
							const detailToDisplay = details.filter(
								(detail) =>
									detail.product._id === product._id &&
									product.isAvailable
							)
							if (detailToDisplay.length !== 0) {
								return (
									<div
										key={detailToDisplay[0].product._id}
										className='productInput flex'
									>
										<label
											htmlFor={
												detailToDisplay[0].product.title
											}
										>
											{detailToDisplay[0].product.title}
											<br />
											<i style={{ fontSize: '0.8em' }}>
												{detailToDisplay[0].product
													.title === 'Mangues'
													? 'Pièces'
													: 'Kilos'}
											</i>
										</label>
										<input
											type='number'
											inputMode='numeric'
											min='0'
											name={
												detailToDisplay[0].product.title
											}
											value={detailToDisplay[0].quantity}
											autoComplete='off'
											onChange={(e) =>
												setQuantity(
													detailToDisplay[0].product,
													e.target.value
												)
											}
										/>
									</div>
								)
							} else if (product.isAvailable) {
								return (
									<div
										key={`new-${product._id}`}
										className='productInput flex'
									>
										<label htmlFor={product.title}>
											{product.title}
											<br />
											<i style={{ fontSize: '0.8em' }}>
												{product.title === 'Mangues'
													? 'Pièces'
													: 'Kilos'}
											</i>
										</label>
										<input
											type='number'
											inputMode='numeric'
											min='0'
											name={product.title}
											value='0'
											autoComplete='off'
											onChange={(e) =>
												setQuantity(
													product,
													e.target.value
												)
											}
										/>
									</div>
								)
							} else {
								return null
							}
						})}
					</form>
					<div className='total flex'>
						<h3 style={{ margin: '0' }}>
							Total :{' '}
							{details.reduce(getOrderTotal, 0).toFixed(2)} €
						</h3>
					</div>
					<button className='button' onClick={() => sendOrder()}>
						PLACER MA COMMANDE
					</button>
					<button
						className='button'
						onClick={() => getPreviousOrder()}
					>
						Remplir avec ma dernière commande
					</button>
				</>
			)}
		</div>
	)
}

export default Order
