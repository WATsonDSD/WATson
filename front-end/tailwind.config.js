/* eslint-disable prefer-template */
/* eslint-disable no-plusplus */
/* eslint-disable indent */
/* eslint-disable no-tabs */
const heights = {};
for (let i = 0; i < 101; i++) {
	heights[i + 'v'] = i + 'vh';
}

module.exports = {
	purge: [],
	darkMode: false, // or 'media' or 'class'
	theme: {
		extend: {
            minWidth: {
                500: '500px',
            },
			zIndex: {
				'-100': '-100',
			},
			height: heights,
			width: {
				'2v': '2vw',
				'4v': '4vw',
				'5v': '5vw',
				'6v': '6vw',
				'8v': '8vw',
				'9v': '9vw',
				'10w': '10vw',
				'20v': '20vw',
				'30v': '30vw',
				'40v': '40vw',
				'50v': '50vw',
				'60v': '60vw',
				'70v': '70vw',
				'80v': '80vw',
				'90v': '90vw',
				'95v': '95vw',
				'100v': '100vw',
			},
			colors: {
				ui: {
					gray: '#444444',
					darkred: '#DF2C00',
					red: '#FFAEAE',
					DEFAULT: '#C4C4C4',
					light: '#E2E2E2',
					lightest: '#f9fafc',
				},
			},
		},
	},
  variants: {
    extend: {},
  },
  plugins: [
	// eslint-disable-next-line global-require
	require('@tailwindcss/aspect-ratio'),
  ],
};
