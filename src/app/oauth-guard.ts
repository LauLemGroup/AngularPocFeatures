import { CanActivateFn } from '@angular/router';

export const oauthGuard: CanActivateFn = (route, state) => {
  if((route.data as any).role == 'ADMIN') return true;
  return false;
};
