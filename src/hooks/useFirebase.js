import { useState, useEffect } from 'react';
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../contexts/AuthContext';

export const useHabits = () => {
  const { currentUser } = useAuth();
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!currentUser) {
      // Reset state when user logs out
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHabits([]);

      setLoading(false);

      setError(null);
      return;
    }

    setLoading(true);
    const habitsRef = collection(db, 'habits');
    const q = query(
      habitsRef,
      where('userId', '==', currentUser.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const habitsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setHabits(habitsData);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Error fetching habits:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  const addHabit = async (habitData) => {
    try {
      const habitsRef = collection(db, 'habits');
      await addDoc(habitsRef, {
        ...habitData,
        userId: currentUser.uid,
        createdAt: serverTimestamp(),
        archived: false,
      });
    } catch (err) {
      console.error('Error adding habit:', err);
      throw err;
    }
  };

  const updateHabit = async (habitId, habitData) => {
    try {
      const habitRef = doc(db, 'habits', habitId);
      await updateDoc(habitRef, {
        ...habitData,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      console.error('Error updating habit:', err);
      throw err;
    }
  };

  const deleteHabit = async (habitId) => {
    try {
      const habitRef = doc(db, 'habits', habitId);
      await deleteDoc(habitRef);
    } catch (err) {
      console.error('Error deleting habit:', err);
      throw err;
    }
  };

  const toggleArchive = async (habitId, archived) => {
    try {
      const habitRef = doc(db, 'habits', habitId);
      await updateDoc(habitRef, {
        archived: !archived,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      console.error('Error archiving habit:', err);
      throw err;
    }
  };

  return {
    habits,
    loading,
    error,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleArchive,
  };
};

export const useCompletions = () => {
  const { currentUser } = useAuth();
  const [completions, setCompletions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!currentUser) {
      setCompletions([]);
      setLoading(false);
      return;
    }

    const completionsRef = collection(db, 'completions');
    const q = query(
      completionsRef,
      where('userId', '==', currentUser.uid),
      orderBy('date', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const completionsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCompletions(completionsData);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Error fetching completions:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  const addCompletion = async (habitId, date = new Date()) => {
    try {
      const completionsRef = collection(db, 'completions');
      await addDoc(completionsRef, {
        habitId,
        userId: currentUser.uid,
        date: Timestamp.fromDate(date),
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.error('Error adding completion:', err);
      throw err;
    }
  };

  const removeCompletion = async (habitId, date) => {
    try {
      const completionsRef = collection(db, 'completions');
      const q = query(
        completionsRef,
        where('userId', '==', currentUser.uid),
        where('habitId', '==', habitId)
      );

      const snapshot = await new Promise((resolve, reject) => {
        const unsubscribe = onSnapshot(q, resolve, reject);
        return () => unsubscribe();
      });

      const completionToDelete = snapshot.docs.find((doc) => {
        const completionDate = doc.data().date.toDate();
        return (
          completionDate.toDateString() === new Date(date).toDateString()
        );
      });

      if (completionToDelete) {
        await deleteDoc(doc(db, 'completions', completionToDelete.id));
      }
    } catch (err) {
      console.error('Error removing completion:', err);
      throw err;
    }
  };

  return {
    completions,
    loading,
    error,
    addCompletion,
    removeCompletion,
  };
};
