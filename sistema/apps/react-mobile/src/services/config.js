/**
 * Endereço da API C# usada pelo app.
 *
 * Por padrão é a API de produção na Azure, porque no celular "localhost" é o
 * próprio celular. Para usar a API do computador na mesma rede Wi-Fi, rode:
 *   EXPO_PUBLIC_API_URL=http://192.168.0.10:5000/api npx expo start
 */
export const API_URL = (process.env.EXPO_PUBLIC_API_URL || 'https://nexti-api-pimivwjad.azurewebsites.net/api')
  .replace(/\/+$/, '');
