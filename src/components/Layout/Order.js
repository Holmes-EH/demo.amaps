import { useEffect, useState } from 'react'
import { useContext } from 'react'
import { store } from '../../store'
import axios from 'axios'

const Order = () => {
	const globalContext = useContext(store)
	const { dispatch } = globalContext
	const { user, products, session, amap, nextDelivery } = globalContext.state

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
						(detail) => detail.product._id === product._id
					)
					if (detailToDisplay.length !== 0) {
						return (
							<div
								key={detailToDisplay[0].product._id}
								className='productInput flex'
							>
								<label
									htmlFor={detailToDisplay[0].product.title}
								>
									{detailToDisplay[0].product.title}
									<br />
									<i style={{ fontSize: '0.8em' }}>
										{detailToDisplay[0].product.title ===
										'Mangues'
											? 'Pièces'
											: 'Kilos'}
									</i>
								</label>
								<input
									type='number'
									inputMode='numeric'
									min='0'
									name={detailToDisplay[0].product.title}
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
					} else {
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
										setQuantity(product, e.target.value)
									}
								/>
							</div>
						)
					}
				})}
			</form>
			<div className='total flex'>
				<h3 style={{ margin: '0' }}>
					Total : {details.reduce(getOrderTotal, 0).toFixed(2)} €
				</h3>
			</div>
			<button className='button'>PLACER MA COMMANDE</button>
		</div>
	)
}

export default Order
