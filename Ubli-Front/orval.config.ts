export default {
  api: {
    input: './swagger.json',  // ou .json
    output: {
      mode: 'split', // ou 'single'
      target: './src/api/generated/',
      schemas: './src/api/schemas/',
      client: 'axios',
      baseUrl: "http://localhost:8080"
    },
  },
};