import { createContext, useReducer } from 'react'

const userFromStorage =
	JSON.parse(localStorage.getItem('juju2fruits_user')) || {}
const amapFromStorage =
	JSON.parse(localStorage.getItem('juju2fruits_amap')) || {}

const initialState = {
	user: userFromStorage,
	amap: amapFromStorage,
	products: [],
}
const store = createContext(initialState)
const { Provider } = store

const StateProvider = ({ children }) => {
	const [state, dispatch] = useReducer((state, action) => {
		switch (action.type) {
			case 'USER_LOGIN':
				return { ...state, user: action.payload }
			case 'RESET_USER_LOGIN':
				return { ...state, user: {} }
			case 'LOADING': {
				return { ...state, loading: true }
			}
			case 'FINISHED_LOADING': {
				return { ...state, loading: undefined }
			}
			case 'MESSAGE':
				return {
					...state,
					message: action.payload,
					messageType: action.messageType,
				}
			case 'RESET_MESSAGE':
				return { ...state, message: undefined }
			case 'SET_AMAP':
				return { ...state, amap: action.payload }
			default:
				throw new Error()
		}
	}, initialState)
	return <Provider value={{ state, dispatch }}>{children}</Provider>
}

export { store, StateProvider }
