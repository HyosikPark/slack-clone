import { ChangeEvent, Dispatch, SetStateAction, useCallback, useState } from 'react';

type ReturnInputTypes<T> = [T, (e: ChangeEvent<HTMLInputElement>) => void, Dispatch<SetStateAction<T>>];

export default function useInput<T extends string | number>(initValue: T): ReturnInputTypes<T> {
  const [value, setValue] = useState(initValue);

  const changeEvent = useCallback((e) => {
    setValue(e.target.value);
  }, []);

  return [value, changeEvent, setValue];
}
