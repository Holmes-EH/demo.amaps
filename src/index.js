import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { StateProvider } from './store'
import { BrowserRouter as Router } from 'react-router-dom'

const getRandomInt = (max) => {
	return Math.floor(Math.random() * max)
}

const backgroundImageUrl = () => {
	return `/images/${getRandomInt(6)}.jpg`
}

const container = document.getElementById('root')
const root = createRoot(container)
root.render(
	<StateProvider>
		<Router>
			<div
				className='main flex'
				style={{ backgroundImage: `url(${backgroundImageUrl()})` }}
			>
				<App />
			</div>
		</Router>
	</StateProvider>
)
