import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useMutation, useQuery } from '@tanstack/vue-query';
import { toast } from 'vue-sonner';
import type { IUserDto } from '@/api/auth/types/user-dto.ts';
import { apiClient, normalizeError } from '@/api/client.ts';
import { authService } from '@/api/auth/auth-service.ts';
import type { ISignInRequestDto } from '@/api/auth/types/sign-in-request-dto.ts';
import router from '@/router';


const authStorageKey = 'auth_v0_01';

function readAuth(): IUserDto | null {
  try {
    const raw = localStorage.getItem(authStorageKey);
    if (!raw)
      return null;

    return JSON.parse(raw) as IUserDto;
  } catch {
    return null;
  }
}

function writeAuth(data: IUserDto) {
  localStorage.setItem(authStorageKey, JSON.stringify(data));
}

function clearAuth() {
  localStorage.removeItem(authStorageKey);
}

export const useAuthStore = defineStore('auth', () => {
  const initialState = readAuth();
  const user = ref<IUserDto | null | undefined>(initialState ?? undefined);
  const isAuthenticated = computed(() => !!user.value);

  const { isPending: isPendingSessionData } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const response = await apiClient.get<IUserDto>('/auth/me');

      if (response.status === 401) {
        user.value = null;
        clearAuth();
        return null;
      }

      const userDto = await response.json();
      if (!user)
        throw new Error('User is missing');

      user.value = userDto;
      writeAuth(userDto);

      return user;
    },
    enabled: !!initialState,
    refetchOnMount: 'always',
    staleTime: Infinity,
    gcTime: Infinity,
    retry: 2
  });

  const {
    mutateAsync: signIn,
    isPending: isSigningIn
  } = useMutation({
    mutationKey: authService.signIn.queryKey(),
    mutationFn: authService.signIn.call,
    onError: async (error) => {
      let safeError: Error = new Error('Something went wrong');
      try {
        safeError = normalizeError(await error.response.json());
      } catch {}

      toast.error(safeError.name, { description: safeError.message });
    },
    onSuccess: ({ user: userDto }) => {
      user.value = userDto;
      writeAuth(userDto);
      void router.replace('/');
    }
  });

  const {
    mutate: signOutMutation,
    isPending: isSigningOut
  } = useMutation({
    mutationKey: authService.signOut.queryKey(),
    mutationFn: authService.signOut.call,
    onSuccess: () => {
      user.value = null;
      clearAuth();
      void router.replace({ name: 'sign-in' });
    },
    onError: async (error: Error) => {
      const force = confirm(
        'Failed to sign out from the server.\n\n' +
        'Do you want to force sign out locally?\n\n' +
        'Your API session may remain active.'
      );

      if (!force)
        return;

      user.value = null;
      clearAuth();
      void router.replace({ name: 'sign-in' });
    }
  });

  function signOut() {
    signOutMutation();
  }

  return {
    // state
    user: user,
    // flags
    isAuthenticated: isAuthenticated,
    isSigningIn,
    isSigningOut,
    isPendingSessionData,

    // actions
    signIn: (data: ISignInRequestDto) => signIn(data),
    signOut
  };
});