const {Configuration, OpenAIApi} = require('openai');

const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const generateImage = async (req, res) => {
	const {text, size, qty} = req.body;
	let imageSize = '';

	switch (size) {
		case 'small':
			imageSize = '256x256';
		case 'medium':
			imageSize = '512x512';
		case 'large':
			imageSize = '1024x1024';
		default:
			imageSize = '256x256';
	}

	try {
		const response = await openai.createImage({
			prompt: text,
			n: Number(qty) || 1,
			size: imageSize
		});

		const imageUrl = response.data.data;

		res.status(200).json({
			success: true,
			data: imageUrl
		});

	} catch (error) {
		res.status(400).json({
			success: false,
			error: 'Image could not be created.' + error.message
		});
		if (error.response) {
			console.log(error.response.status);
			console.log(error.response.data);
		} else {
			console.log(error.message);
		}
	}
};

module.exports = {generateImage};