import { useEffect, useState } from "react";
import { User } from "firebase/auth";
import { doc, onSnapshot, getFirestore } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";

type UserData = {
  user: User | null | undefined;
  username: string | null;
  loading: boolean;
};

/**
 * Custom hook to read  auth record and user profile doc
 * @param  {User} user
 * @param  {string} username
 * @param  {boolean} loading
 * @returns {UserData}
 **/
export const useUserData = (): UserData => {
  const [user, loading, error] = useAuthState(auth);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    // turn off realtime subscription
    let unsubscribe: (() => void) | undefined;

    if (error) {
      console.log("Error fetching user data from firebase: ", error);
      return () => {
        if (unsubscribe) {
          unsubscribe();
        }
      };
    }

    if (user) {
      const ref = doc(getFirestore(), "users", user.uid);
      unsubscribe = onSnapshot(ref, (doc) => {
        setUsername(doc.data()?.username);
      });
    } else {
      setUsername(null);
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user]);

  return { user, username, loading };
};
