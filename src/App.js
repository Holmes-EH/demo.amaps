import Login from './components/Login/Login'
import Landing from './components/Landing/Landing'
import { store } from './store'
import { useState, useContext } from 'react'

import { Switch, Route } from 'react-router-dom'

import './App.css'
import Recover from './components/Reset/Recover'
import NewPassword from './components/Reset/NewPassword'
import Layout from './components/Layout/Layout'
import FirstContact from './components/FirstContact/FirstContact'

import { BiEnvelope } from 'react-icons/bi'

function App() {
	const globalState = useContext(store)
	const { user, amap, loading } = globalState.state

	const [firstContact, setFirstContact] = useState(false)

	return (
		<>
			{firstContact ? (
				<div
					className='flex column'
					style={{
						width: '100%',
						justifyContent: 'center',
						alignItems: 'center',
					}}
				>
					<button
						className='button danger'
						onClick={() => setFirstContact(false)}
					>
						ANNULER
					</button>
					<FirstContact />
				</div>
			) : !user.token ? (
				!amap._id ? (
					<div
						className='flex column'
						style={{ alignItems: 'center', width: '100%' }}
					>
						<Landing />

						{!loading && (
							<div>
								<button
									className='button flex'
									style={{ alignItems: 'center' }}
									onClick={() => setFirstContact(true)}
								>
									{' '}
									<BiEnvelope style={{ fontSize: '1.5em' }} />
									<span style={{ paddingLeft: '1em' }}>
										Contactez - moi
									</span>
								</button>
							</div>
						)}
					</div>
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
		</>
	)
}

export default App
