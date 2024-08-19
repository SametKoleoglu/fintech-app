import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ptjobeoxattndepkxfsh.supabase.co";

const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0am9iZW94YXR0bmRlcGt4ZnNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjM2MzQ4MTQsImV4cCI6MjAzOTIxMDgxNH0.yiA5SDyAnlmETzXiUFqVzSCy8iOQrUA4SrkcKKktPEM";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
