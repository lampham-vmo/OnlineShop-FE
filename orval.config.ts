// orval.config.ts

export default {
   api: {
        input: 'http://localhost:3000/api-json',
        output: {
          mode: 'tags-split',
          target: './src/api/endpoints',
          schemas: './src/api/models',
          client: 'axios',
          override: {
            mutator: {
              path: './lib/api.ts',
              name: 'api',
            },
          },
        },
      },
      
    apiZod:{
        input: 'http://localhost:3000/api-json',
        output: {
          mode: 'tags-split',
          target: './src/api/endpoints',
          client: 'zod',
          fileExtension: '.zod.ts'
        },
    }
  };
  