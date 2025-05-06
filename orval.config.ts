export default {
  api: {
    input: 'https://deploy-shoppe.onrender.com/api-json',
    output: {
      mode: 'tags-split',
      target: './src/generated/api/endpoints',
      schemas: './src/generated/api/models',
      client: 'axios',
      override: {
        mutator: {
          path: './src/lib/api.ts',
          name: 'api',
        },
      },
    },
  },

  apiZod: {
    input: 'https://deploy-shoppe.onrender.com/api-json',
    output: {
      mode: 'tags-split',
      target: './src/generated/api/schemas',
      client: 'zod',
      fileExtension: '.zod.ts',
    },
  },
};
