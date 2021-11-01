import { store } from '../../store'
import { useContext, useEffect } from 'react'
import axios from 'axios'
import { Switch, Route, Link, useLocation } from 'react-router-dom'

import Loader from '../Loader/Loader'
import Toaster from '../Toaster'

import { BiUser, BiFoodMenu, BiInfoCircle } from 'react-icons/bi'

import './layout.css'
import Order from './Order'
import User from './User'
import Info from './Info'

const Layout = () => {
	const globalState = useContext(store)
	const { dispatch } = globalState
	const { user, message, loading, messageType, products, session, amap } =
		globalState.state

	const curUrl = useLocation().pathname

	useEffect(() => {
		const getProducts = async () => {
			dispatch({ type: 'LOADING' })
			try {
				const config = {
					headers: {
						Authorization: `Bearer ${user.token}`,
					},
				}
				const { data } = await axios.get(
					`${process.env.REACT_APP_API_URL}/api/products`,
					config
				)
				dispatch({ type: 'FINISHED_LOADING' })
				dispatch({
					type: 'SET_PRODUCT_LIST',
					payload: data,
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

		if (
			(user.token && !products) ||
			(user.token && products.length === 0)
		) {
			getProducts()
		}
	}, [dispatch, user.token, products])

	useEffect(() => {
		const getSession = async () => {
			dispatch({ type: 'LOADING' })
			try {
				const config = {
					headers: {
						Authorization: `Bearer ${user.token}`,
					},
				}
				const { data } = await axios.get(
					`${process.env.REACT_APP_API_URL}/api/sessions?current=true`,
					config
				)
				dispatch({ type: 'SET_SESSION', payload: data })
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
		getSession()
	}, [dispatch, user.token])

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
		if (session.session) {
			getNextDelivery()
		}
	}, [dispatch, user.token, session.session, amap._id])

	useEffect(() => {
		const getExistingOrder = async () => {
			dispatch({ type: 'LOADING' })
			try {
				const config = {
					headers: {
						Authorization: `Bearer ${user.token}`,
					},
				}
				const { data } = await axios.get(
					`${process.env.REACT_APP_API_URL}/api/orders/myorders`,
					config
				)
				if (data.session === session.session) {
					dispatch({
						type: 'SET_EXISTING_ORDER',
						payload: data.userOrders[0],
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
		getExistingOrder()
	}, [dispatch, session.session, user.token])

	return (
		<>
			{message && <Toaster message={message} type={messageType} />}
			<nav>
				<ul>
					<li className={curUrl === '/' ? 'active' : ''}>
						<Link to='/'>
							<BiInfoCircle />
						</Link>
					</li>
					<li className={curUrl === '/commande' ? 'active' : ''}>
						<Link to='/commande'>
							<BiFoodMenu />
						</Link>
					</li>

					<li className={curUrl === '/profil' ? 'active' : ''}>
						<Link to='/profil'>
							<BiUser />
						</Link>
					</li>
				</ul>
			</nav>
			{loading ? (
				<Loader />
			) : (
				<Switch>
					<Route path='/commande'>
						<Order />
					</Route>
					<Route path='/profil'>
						<User />
					</Route>
					<Route path='/'>
						<Info />
					</Route>
				</Switch>
			)}
		</>
	)
}

export default Layout
