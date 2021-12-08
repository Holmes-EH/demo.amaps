import Lemon from '../Lemon'
import './loader.css'

const Loader = () => {
	return (
		<div
			className='flex'
			style={{
				alignItems: 'center',
				justifyContent: 'center',
				width: '100vw',
				height: '100vh',
			}}
		>
			<div className='loading'>
				<Lemon />
			</div>
		</div>
	)
}

export default Loader
