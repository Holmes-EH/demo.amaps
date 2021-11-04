import Login from './components/Login/Login'
import Landing from './components/Landing/Landing'
import { store } from './store'
import axios from 'axios'
import { useContext, useEffect } from 'react'

import { Switch, Route } from 'react-router-dom'

import './App.css'
import Recover from './components/Reset/Recover'
import NewPassword from './components/Reset/NewPassword'
import Layout from './components/Layout/Layout'

function App() {
	const globalState = useContext(store)
	const { dispatch } = globalState
	const { user, amap } = globalState.state

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
		if (user.token) {
			getSession()
		}
	}, [dispatch, user.token])

	const getRandomInt = (max) => {
		return Math.floor(Math.random() * max)
	}

	const backgroundImageUrl = () => {
		return `/images/${getRandomInt(6)}.jpg`
	}

	return (
		<div
			className='main flex'
			style={{ backgroundImage: `url(${backgroundImageUrl()})` }}
		>
			{!user.token ? (
				!amap._id ? (
					<Landing />
				) : (
					<Switch>
						<Route path='/reset'>
							<NewPassword />
						</Route>
						<Route path='/recover'>
							<Recover />
						</Route>
						<Route path='/'>
							<Login />
						</Route>
					</Switch>
				)
			) : (
				<Layout />
			)}
		</div>
	)
}

export default App
