/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,tsx}'],
  theme: {
    extend: {
      gridTemplateColumns: {
        // Complex site-specific column configuration
        standings: '10% 1fr 8% 10% 30%',
        standings6: '10% 1fr 8% 10% 15% 15%',
        standings7: '10% 1fr 8% 10% 15% 15% 15%',
        standings8: '10% 1fr 1fr 8% 10% 10% 15% 15%',
        // V2 standings for Season 7+ (type 6)
        standingsV2: '8% 1fr 8% 8% 10% 15% 15%',
        standingsV2King: '8% 1fr 8% 8% 10% 8% 15% 15%',
        seasonDetail: '12% repeat(15, 1fr)',
        schedule: '1fr 4fr 1fr 4fr ',
      },
    },
  },
  plugins: [],
};
