import { useState, useEffect, useCallback } from 'react';
import { updateUserBalance } from '../store/actions';
import { userStore } from '../store/userStore';
import { request } from '../lib/axios';

export const useBalance = () => {
  const { token, gifs } = userStore.useState();

  // Wrap fetchBalance with useCallback to prevent unnecessary re-creations
  const fetchBalance = useCallback(async () => {
    if (!token) return; // Ensure there is a token before fetching
    console.log('token', token);
    try {
      const response = await request({
        url: '/user/balance',
        method: 'post',
      });
      if (response.status === 200) {
        updateUserBalance(response.data.balance);
      }
    } catch (error) {
      console.error('Failed to fetch balance:', error);
    }
  }, [token]); // fetchBalance gets recreated only when token changes

  useEffect(() => {
    fetchBalance();
  }, [token, gifs?.length, fetchBalance]); // Use optional chaining on gifs

  return null; // Since this hook does not return content, we return null
};

export default useBalance;
