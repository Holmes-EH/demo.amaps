import Login from './components/Login/Login'
import Landing from './components/Landing/Landing'
import { store } from './store'
import { useContext } from 'react'

import { Switch, Route } from 'react-router-dom'

import './App.css'
import Recover from './components/Reset/Recover'
import NewPassword from './components/Reset/NewPassword'

function App() {
	const globalState = useContext(store)
	const { user, amap } = globalState.state

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
				<p>You are logged in !..</p>
			)}
		</div>
	)
}

export default App
