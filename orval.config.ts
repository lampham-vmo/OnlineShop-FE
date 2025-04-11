export default {
    shoppe: {
      output: {
        mode: 'tags-split', // hoặc 'single'
        target: './src/api/', // nơi tạo file API
        schemas: './src/api/model', // nơi tạo model
        client: 'axios', // có thể là 'axios' | 'fetch' | 'react-query'
        baseUrl: 'http://localhost:3001',
      },
      input: {
        target: 'http://localhost:3001/api-json', // hoặc file local: './swagger.json'
      },
    },
  };
  