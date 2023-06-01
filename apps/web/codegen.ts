import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'http://localhost:5005/graphql',
  documents: 'src/**/*.gql',
  generates: {
    'src/api/gql-gen.ts': {
      plugins: [ 'typescript', 'typescript-operations', 'typescript-react-query' ],
      config: {
        exposeQueryKeys: true,
        exposeMutationKeys: true,
        fetcher: {
          fetchParams: {
            credentials: 'include',
            headers: {
              'Apollo-Require-Preflight': 'true',
              'Content-Type': 'application/json',
            },
          },
          endpoint: 'process.env.NEXT_PUBLIC_GQLURL',
        },
      },
    },
  },
};

export default config;
