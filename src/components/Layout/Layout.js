import { store } from '../../store'
import { useContext, useEffect } from 'react'
import axios from 'axios'
import { Switch, Route, Link, useLocation } from 'react-router-dom'

import Toaster from '../Toaster'

import {
	BiUser,
	BiBasket,
	BiInfoCircle,
	BiLogOutCircle,
	BiEnvelope,
} from 'react-icons/bi'

import './layout.css'
import Order from './Order'
import User from './User'
import Info from './Info'
import Contact from './Contact'
import Loader from '../Loader/Loader'

const Layout = () => {
	const globalState = useContext(store)
	const { dispatch } = globalState
	const { user, message, messageType, products, session, amap, loading } =
		globalState.state

	const curUrl = useLocation().pathname

	const today = new Date()

	const disconnectUser = () => {
		localStorage.removeItem('juju2fruits_user')
		localStorage.removeItem('juju2fruits_amap')
		dispatch({ type: 'RESET_AMAP' })
		dispatch({ type: 'RESET_USER_LOGIN' })
	}

	// Get Session
	useEffect(() => {
		let mounted = true
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
				mounted && dispatch({ type: 'SET_SESSION', payload: data })
				dispatch({ type: 'FINISHED_LOADING' })
			} catch (error) {
				if (error.response.status === 401) {
					localStorage.removeItem('juju2fruits_user')
					dispatch({ type: 'RESET_USER_LOGIN' })
					dispatch({
						type: 'MESSAGE',
						payload:
							error.response && error.response.data.message
								? error.response.data.message
								: error.message,
						messageType: 'error',
					})
				} else {
					dispatch({
						type: 'MESSAGE',
						payload:
							error.response && error.response.data.message
								? error.response.data.message
								: error.message,
						messageType: 'error',
					})
				}
				dispatch({ type: 'FINISHED_LOADING' })
			}
		}
		if (user.token) {
			getSession()
		}
		return () => (mounted = false)
	}, [dispatch, user.token])

	// Get Products
	useEffect(() => {
		let mounted = true
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
				mounted &&
					dispatch({
						type: 'SET_PRODUCT_LIST',
						payload: data,
					})
				dispatch({ type: 'FINISHED_LOADING' })
			} catch (error) {
				if (error.response.status === 401) {
					localStorage.removeItem('juju2fruits_user')
					dispatch({ type: 'RESET_USER_LOGIN' })
					dispatch({
						type: 'MESSAGE',
						payload:
							error.response && error.response.data.message
								? error.response.data.message
								: error.message,
						messageType: 'error',
					})
				} else {
					dispatch({
						type: 'MESSAGE',
						payload:
							error.response && error.response.data.message
								? error.response.data.message
								: error.message,
						messageType: 'error',
					})
				}
				dispatch({ type: 'FINISHED_LOADING' })
			}
		}

		if (
			(user.token && !products) ||
			(user.token && products.length === 0)
		) {
			getProducts()
		}
		return () => (mounted = false)
	}, [dispatch, user.token, products])

	// Get Next delivery
	useEffect(() => {
		let mounted = true
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
				mounted &&
					dispatch({
						type: 'SET_NEXT_DELIVERY',
						payload: data.delivery,
					})
				dispatch({ type: 'FINISHED_LOADING' })
			} catch (error) {
				if (error.response.status === 401) {
					localStorage.removeItem('juju2fruits_user')
					dispatch({ type: 'RESET_USER_LOGIN' })
					dispatch({
						type: 'MESSAGE',
						payload:
							error.response && error.response.data.message
								? error.response.data.message
								: error.message,
						messageType: 'error',
					})
				} else {
					dispatch({
						type: 'MESSAGE',
						payload:
							error.response && error.response.data.message
								? error.response.data.message
								: error.message,
						messageType: 'error',
					})
				}
				dispatch({ type: 'FINISHED_LOADING' })
			}
		}
		if (session.session && !user.isAdmin) {
			getNextDelivery()
		}
		return () => (mounted = false)
	}, [dispatch, user, session.session, amap._id])

	// Get Existing order
	useEffect(() => {
		let mounted = true
		const getExistingOrder = async () => {
			dispatch({ type: 'LOADING' })
			try {
				const config = {
					headers: {
						Authorization: `Bearer ${user.token}`,
					},
				}
				const { data } = await axios.get(
					`${process.env.REACT_APP_API_URL}/api/orders/myorders?limit=1`,
					config
				)
				if (
					data.userOrders.length > 0 &&
					data.userOrders[0].session === session.session &&
					mounted
				) {
					dispatch({
						type: 'SET_EXISTING_ORDER',
						payload: data.userOrders[0],
					})
				}
				dispatch({ type: 'FINISHED_LOADING' })
			} catch (error) {
				if (error.response.status === 401) {
					localStorage.removeItem('juju2fruits_user')
					dispatch({ type: 'RESET_USER_LOGIN' })
					dispatch({
						type: 'MESSAGE',
						payload:
							error.response && error.response.data.message
								? error.response.data.message
								: error.message,
						messageType: 'error',
					})
				} else {
					dispatch({
						type: 'MESSAGE',
						payload:
							error.response && error.response.data.message
								? error.response.data.message
								: error.message,
						messageType: 'error',
					})
				}
				dispatch({ type: 'FINISHED_LOADING' })
			}
		}
		if (user) {
			getExistingOrder()
		}
		return () => (mounted = false)
	}, [dispatch, session.session, user])

	return (
		<>
			{message && <Toaster message={message} type={messageType} />}
			{loading ? (
				<Loader />
			) : session ? (
				<>
					<nav>
						<ul>
							<li className={curUrl === '/' ? 'active' : ''}>
								<Link to='/'>
									<BiInfoCircle />
								</Link>
							</li>
							{new Date(session.lastOrderDate) >= today && (
								<li
									className={
										curUrl === '/commande' ? 'active' : ''
									}
								>
									<Link to='/commande'>
										<BiBasket />
									</Link>
								</li>
							)}

							<li
								className={curUrl === '/profil' ? 'active' : ''}
							>
								<Link to='/profil'>
									<BiUser />
								</Link>
							</li>
							<li
								className={
									curUrl === '/contact' ? 'active' : ''
								}
							>
								<Link to='/contact'>
									<BiEnvelope />
								</Link>
							</li>
							<li>
								<Link to='/'>
									<BiLogOutCircle onClick={disconnectUser} />
								</Link>
							</li>
						</ul>
					</nav>
					<Switch>
						<Route path='/commande'>
							<Order />
						</Route>
						<Route path='/profil'>
							<User />
						</Route>
						<Route path='/contact'>
							<Contact />
						</Route>
						<Route path='/'>
							<Info />
						</Route>
					</Switch>
				</>
			) : (
				<div className='flex login' style={{ padding: '0' }}>
					<div
						className='flex column glass'
						style={{ padding: '1em' }}
					>
						<h1>
							Les commandes pour ce mois-ci sont désormais
							fermées...
						</h1>
						<h3 style={{ textAlign: 'center' }}>
							J'avertirai votre amap dès que les commandes pour le
							mois prochain seront accessibles.
						</h3>
					</div>
				</div>
			)}
		</>
	)
}

export default Layout
