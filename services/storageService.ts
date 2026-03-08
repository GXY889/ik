import { Account } from '../types';

const STORAGE_KEY = 'my_guardian_accounts';

export const getAccounts = (): Account[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to load accounts', error);
    return [];
  }
};

export const saveAccount = (account: Account): Account[] => {
  const accounts = getAccounts();
  const updatedAccounts = [account, ...accounts];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAccounts));
  return updatedAccounts;
};

export const deleteAccount = (id: string): Account[] => {
  const accounts = getAccounts();
  const updatedAccounts = accounts.filter(acc => acc.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAccounts));
  return updatedAccounts;
};