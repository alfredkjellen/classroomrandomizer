import { db, schoolData, userData } from "$lib/firebase";
import { writeBatch } from "firebase/firestore/lite";
import { derived } from "svelte/store";
import {doc } from "firebase/firestore";




// New code for trial expiration check
export const trialExpired = derived(schoolData, ($schoolData) => {
    if (!$schoolData) {
      return false; 
    }
    if ($schoolData.subscribed) {
      return false; // Trial never expires for subscribed users
    }
  
    const trialEndDate = new Date($schoolData.trialEndingDate);
    const currentDate = new Date();
  
    return currentDate > trialEndDate;
  });
  
  // Optional: Create a readable store for the remaining trial days
  export const trialDaysRemaining = derived(schoolData, ($schoolData) => {
    if (!$schoolData || $schoolData.subscribed) {
      return null; // No trial for subscribed users or when no school data
    }
  
    const trialEndDate = new Date($schoolData.trialEndingDate);
    const currentDate = new Date();
    const timeDiff = trialEndDate.getTime() - currentDate.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
  
    return Math.max(0, daysDiff); // Ensure we don't return negative days
  });




