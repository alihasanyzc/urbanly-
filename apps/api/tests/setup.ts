// Testler için gerekli env değişkenlerini import'lardan önce ayarla.
// env.ts eksik env'de process.exit(1) yaptığı için bu şart.
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = 'postgresql://localhost:5432/urbanly_test?schema=public';
process.env.JWT_ACCESS_SECRET = 'test-access-secret-0123456789';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-0123456789';
process.env.CORS_ORIGINS = 'http://localhost:8081';
