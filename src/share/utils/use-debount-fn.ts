import { useEffect, useState } from "react";
import { useDebounceValue } from "usehooks-ts";

export const useDebounceFn = (
  fn: () => void,
  {
    term,
    delay,
  }: {
    term: unknown;
    delay: number;
  },
) => {
  const [_cnt, setCnt] = useState(0);
  const [debounced] = useDebounceValue(term, delay);

  useEffect(() => {
    if (_cnt === 0) return;
    fn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  return () => {
    setCnt((pre) => pre + 1);
  };
};
