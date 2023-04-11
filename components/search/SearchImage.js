'use client'
import {useState, useEffect} from 'react'
import axios from 'axios'
import {ThreeCircles} from 'react-loader-spinner'
import {MdOutlineImageSearch} from 'react-icons/md'

const SearchImage = () => {

	const min = 0;
	const max = 3;
	const [loading, setLoading] = useState(false)
	const [state, setState] = useState({
		text: '',
		qty: 1,
		size: ''
	})

	const [pics, setPics] = useState([]);

	const handleChange = (e) => {
		setState({...state, [e.target.name]: e.target.value});
	}

	const handleClick = async e => {
		e.preventDefault();
		setPics('')
		setLoading(true);
		const picsResult = await axios.post('http://localhost:5000/openai/generateimage', state)
		setPics(picsResult.data.data);
		setLoading(false)
	}

	useEffect(() => {
		if (state.qty < min || state.qty > max) {
			alert(`Qty must be greater than ${min} and less than ${max}`)
			setState({qty: 1})
		}
	}), [state.qty]

	return (
		<div className="bg-blue-950 text-white p-5 flex flex-col w-full overflow-hidden">

			<div className="bg-blue-200 p-5 min-h-[96vh]">
				<div className="bg-blue-500 min-h-[91vh] grid grid-cols-1 content-center">
					<h1 className="text-5xl text-center">AI Image Search<MdOutlineImageSearch className='inline ml-2 bg-gradient-to-r from-cyan-500 to-blue-400 rounded-lg' /></h1>
					<div className="grid m-auto w-1/4 pt-10">
						<label htmlFor='text' className='text-2xl mb-1'>Text</label>
						<textarea name='text' onChange={handleChange} placeholder="Search Text" className="form-input rounded p-2 text-gray-700" value={state.text}></textarea>
						<label htmlFor='qty' className='mt-4 mb-1 text-2xl'>Qty</label>
						<input type="number" name='qty' onChange={handleChange} placeholder="Qty" className="form-input rounded h-8 p-2 text-gray-700" maxLength={1} min={min} max={max} value={state.qty} />
						<label htmlFor='size' className='mt-4 text-2xl mb-1'>Size</label>
						<select className="form-select px-4 py-3 rounded text-black" name='size' onChange={handleChange} value={state.size}>
							<option value="">Please choose</option>
							<option value="small">Small</option>
							<option value="medium">Medium</option>
							<option value="large">Large</option>
						</select>


						<button disabled={state.text === '' || loading} className="bg-blue-700 hover:bg-blue-900 btn rounded h-8 w-20 text-white mt-4 disabled:bg-gray-500" onClick={handleClick}>
							Search
						</button>
					</div>
					<ThreeCircles
						height="100"
						width="100"
						color="yellow"
						wrapperStyle={{'marginLeft': 'auto', 'marginRight': 'auto', 'width': '6em'}}
						wrapperClass=""
						visible={loading}
						ariaLabel="three-circles-rotating"
						outerCircleColor="orange"
						innerCircleColor="green"
						middleCircleColor="yellow"
					/>
					{pics.length > 0 &&
						<div className={`mx-auto pt-20 grid grid-cols-1 gap-2 w-1/2 md:grid-cols-${pics.length}`}>
							{
								pics.map((pic, key) => {
									return (
										<div key={key} className='group mx-auto'>
											<img src={pic.url} alt='AI image' className='w-auto mx-auto' />
											<div className='text-xs'>Right-click on image to save image as</div>
										</div>
									)
								})}

						</div>
					}
				</div>
			</div>
		</div>
	)
}

export default SearchImage
