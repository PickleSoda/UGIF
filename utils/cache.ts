import { cache } from 'react'
import 'server-only'
 
export const preload = (id: string) => {
  void getItem(id)
}
 
export const getItem = cache(async (id: string) => {
    
})