import { initializeApp } from "firebase/app";
import { getFirestore, onSnapshot } from "firebase/firestore";
import { getAuth, onAuthStateChanged} from "firebase/auth";
import { getStorage } from "firebase/storage";
import { derived, writable, type Readable } from "svelte/store";
import type { User } from "firebase/auth";
import { doc } from "firebase/firestore";



const firebaseConfig = {
  apiKey: "AIzaSyALBUd-G2QgBkx2Ec8H0tOk7S7Msd7Yfjc",
  authDomain: "fir-test-9ca8b.firebaseapp.com",
  projectId: "fir-test-9ca8b",
  storageBucket: "fir-test-9ca8b.appspot.com",
  messagingSenderId: "890154969948",
  appId: "1:890154969948:web:b1d29b7176e241a33f2f99",
  measurementId: "G-C7ZBG1EKXE"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig); 
export const db = getFirestore();
export const auth = getAuth();
export const storage = getStorage();

function userStore() {
  let unsubscribe: () => void;

  if (!auth || !globalThis.window) {
    console.warn('Auth is not initialized or not in browser');
    const { subscribe } = writable<User | null>(null);
    return {
      subscribe,
    }
  }

  const { subscribe } = writable(auth?.currentUser ?? null, (set) => {
    unsubscribe = onAuthStateChanged(auth, (user) => {
      set(user);
    });

    return () => unsubscribe();
  });

  return {
    subscribe,
  };
}


export const user = userStore();


export function docStore<T>(
  path: string,
){

  let unsubscribe: () => void;
  const docRef = doc(db, path);

  const { subscribe } = writable<T | null>(null, (set) => {
    onSnapshot(docRef, (snapshot) => {
      set((snapshot.data() as T) ?? null);

      return () => unsubscribe();
    });
  });

  return {
    subscribe,
    ref: docRef,
    id: docRef.id,
  };

}


// export const userData: Readable<UserData | null> = derived(user, ($user, set) => { 
//   if ($user) {
//     return docStore<UserData>(`users/${$user.uid}`).subscribe(set);
//   } else {
//     set(null); 
//   }
// });


export const userData: Readable<UserData | null> = derived(user, ($user, set) => { 
  if ($user) {
    return docStore<UserData>(`users/${$user.uid}/userdata/data`).subscribe(set);
  } else {
    set(null); 
  }
});



interface UserData {
  username: string;
  classes: Class[];
  rooms: Room[];
  school: string;
}


class Class {
  name: string;
  students: string[];
  id:string = "";
  constructor(name: string, students: string[], id:string = ""){
    this.name = name;
    this.students = students;
    this.id = id;
  }
}

class Room {
  name: string; 
  layout: boolean[][];

  constructor(name: string, layout: boolean[][]){
    this.name = name;
    this.layout = layout;
  }
}


interface School{
  name: string;
  classes: Class[];
  rooms: Room[];
}



export const schoolData: Readable<School | null> = derived(userData, ($userData, set) => { 
  if ($userData) {
    return docStore<School>(`schools/${$userData.school}/schooldata/data`).subscribe(set);
  } else {
    set(null); 
  }
});



