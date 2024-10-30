import { useMutation } from '@tanstack/react-query';
import { config } from 'config';

interface authenticateParams {
  email: string;
  password: string;
}

export const fetchAuthenticate: ({
  email,
  password
}: authenticateParams) => Promise<Response> = async ({ email, password }) => {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: password })
  };
  return fetch(`${config.API_URL}user/login?email=${email}`, requestOptions);
};

interface useAuthenticateMutationParams {
  onSuccess?: (arg0: string) => void;
  onError?: (arg0: Error) => void;
}

export const useAuthenticateMutation = ({ onSuccess, onError }: useAuthenticateMutationParams) => {
  return useMutation({
    mutationFn: ({ email, password }: authenticateParams) => {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: password })
      };
      return fetch(`${config.API_URL}/user/login?email=${email}`, requestOptions)
        .then(response => {
          if (!response.ok) throw new Error(`${response.status}`);
          return response.json();
        })
        .then(response => response);
    },
    onSuccess: data => {
      onSuccess?.(data.token as string);
    },
    onError: error => {
      onError?.(error);
    }
  });
};
