import { supabase } from './client';


export const ROICalculation = supabase.from('calculations');



// // auth sdk:
export const User = supabase.auth;