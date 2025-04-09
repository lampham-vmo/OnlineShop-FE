declare namespace NodeJS {
  interface ProcessEnv {
    // API Configuration
    NEXT_PUBLIC_API_URL: string;
    NEXT_PUBLIC_API_VERSION: string;

    // Authentication
    NEXT_PUBLIC_JWT_SECRET: string;
    NEXT_PUBLIC_TOKEN_EXPIRY: string;

    // Other Configuration
    NEXT_PUBLIC_APP_NAME: string;
    NEXT_PUBLIC_APP_VERSION: string;
  }
} 