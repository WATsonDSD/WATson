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
const margins = {};
for (let i = 0; i < 101; i++) {
	margins[i + 'vw'] = i + 'vw';
	margins[i + 'vh'] = i + 'vh';
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
			width: widths,
			padding: {
				'5vh': '5vh',
				'10vh': '10vh',
				'5vw': '5vw',
				'10vw': '10vw',
			},
			margin: margins,
			colors: {
				ui: {
					graygloss: '#44444477',
					gray: '#444444',
					darkgray: '#111111',
					darkred: '#DF2C00',
					red: '#FFAEAE',
					light: '#E2E2E2',
					lightest: '#f9fafc',
					DEFAULT: '#C4C4C4',
				},
				lb: {
					projectm: '#F5CCCC',
					projectmtext: '#FF0000',
					verifier: '#CCDCF5',
					verifiertext: '#0143A5',
					annotator: '#CCF5E0',
					annotatortext: '#01A550',
					finance: '#F5F1CC',
					financetext: '#FF9900',
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
