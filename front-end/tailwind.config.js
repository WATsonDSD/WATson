/* eslint-disable prefer-template */
/* eslint-disable no-plusplus */
/* eslint-disable indent */
/* eslint-disable no-tabs */
const heights = {};
for (let i = 0; i < 101; i++) {
	heights[i + 'v'] = i + 'vh';
}
const widths = {};
for (let i = 0; i < 101; i++) {
	widths[i + 'v'] = i + 'vw';
}
widths['90h'] = '90vh';

module.exports = {
	purge: [],
	darkMode: false, // or 'media' or 'class'
	theme: {
		extend: {
            minWidth: {
                500: '500px',
            },
			height: heights,
			width: widths,
			padding: {
				'5vh': '5vh',
				'10vh': '10vh',
				'5vw': '5vw',
				'10vw': '10vw',
			},
			margin: {
				'2vh': '2vh',
				'5vh': '5vh',
				'10vh': '10vh',
				'60vh': '60vh',
				'5vw': '5vw',
				'10vw': '10vw',
				'20vw': '20vw',
			},
			colors: {
				ui: {
					graygloss: '#44444477',
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
	plugins: [],
};
