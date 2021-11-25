import React from 'react'
import ReactDOM from 'react-dom'
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

ReactDOM.render(
	<StateProvider>
		<Router>
			<div
				className='main flex'
				style={{ backgroundImage: `url(${backgroundImageUrl()})` }}
			>
				<App />
			</div>
		</Router>
	</StateProvider>,
	document.getElementById('root')
)
