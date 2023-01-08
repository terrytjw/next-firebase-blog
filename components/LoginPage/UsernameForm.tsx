import { doc, getFirestore, writeBatch, getDoc } from "firebase/firestore";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { UserContext } from "../../lib/context";
import { debounce } from "lodash";
import UsernameMessage from "./UsernameMessage";
import { useRouter } from "next/router";

const UsernameForm = () => {
  const router = useRouter();

  const [formValue, setFormValue] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user, username } = useContext(UserContext);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Create refs for both documents
    const userDoc = doc(getFirestore(), "users", user.uid);
    const usernameDoc = doc(getFirestore(), "usernames", formValue);

    // Commit both docs together as a batch write.
    const batch = writeBatch(getFirestore());
    batch.set(userDoc, {
      username: formValue,
      photoURL: user.photoURL,
      displayName: user.displayName,
    });
    batch.set(usernameDoc, { uid: user.uid });

    await batch.commit();
    router.push("/");
  };

  const onChange = (e: React.FormEvent<HTMLInputElement>) => {
    if (e.target instanceof HTMLInputElement) {
      // Force form value typed in form to match correct format
      const val = e.target.value.toLowerCase();
      const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

      // Only set form value if length is < 3 OR it passes regex
      if (val.length < 3) {
        setFormValue(val);
        setLoading(false);
        setIsValid(false);
      }

      if (re.test(val)) {
        setFormValue(val);
        setLoading(true);
        setIsValid(false);
      }
    }
  };

  useEffect(() => {
    checkUsername(formValue);
  }, [formValue]);

  // Hit the database for username match after each debounced change
  // useCallback is required for debounce to work
  const checkUsername = useCallback(
    debounce(async (username) => {
      if (username.length >= 3) {
        const ref = doc(getFirestore(), "usernames", username);
        const snap = await getDoc(ref);
        console.log("Firestore read executed!", snap.exists());

        setIsValid(!snap.exists()); // if username exists, set isValid = false
        setLoading(false);
      }
    }, 500),
    []
  );
  return !username ? (
    <section>
      <form
        className="p-10 border border-gray-300 rounded-lg"
        onSubmit={onSubmit}
      >
        <div className="form-control w-full max-w-sm">
          <label className="label">
            <span className="label-text text-gray-500 font-semibold">
              Pick a username
            </span>
          </label>
          <input
            type="text"
            name="username"
            placeholder="e.g. anonzxc98"
            className="input input-bordered w-full max-w-sm"
            value={formValue}
            onChange={onChange}
          />
        </div>
        <UsernameMessage
          username={formValue}
          isValid={isValid}
          loading={loading}
        />
        <div className="flex justify-center">
          <button type="submit" className="btn btn-sm" disabled={!isValid}>
            Choose
          </button>
        </div>

        {/* <h3 className="mt-6 text-lg font-bold">Debug State</h3>
        <div>
          Username: {formValue}
          <br />
          Loading: {loading.toString()}
          <br />
          Username Valid: {isValid.toString()}
        </div> */}
      </form>
    </section>
  ) : null;
};

export default UsernameForm;
