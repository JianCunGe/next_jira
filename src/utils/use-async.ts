import { useCallback, useState } from "react";
import { useMountedRef } from "./index";

interface State<D> {
  error: Error | null;
  data: D | null;
  stat: "idle" | "loading" | "success" | "error";
}

const defaultInitalState: State<null> = {
  error: null,
  data: null,
  stat: "idle",
};

const defaultConfig = {
  throwOnError: false,
};

export const useAsync = <D>(
  initialState?: State<D>,
  initialConfig?: typeof defaultConfig
) => {
  const config = { ...defaultConfig, ...initialConfig };
  const [state, setState] = useState<State<D>>({
    ...defaultInitalState,
    ...initialState,
  });
  // call retry execute run function
  const [retry, setRetry] = useState(() => () => {});
  const mountedRef = useMountedRef();

  const setData = useCallback((data: D) => {
    setState({
      data,
      error: null,
      stat: "success",
    });
  }, []);

  const setError = useCallback((error: Error) => {
    setState({
      error,
      data: null,
      stat: "error",
    });
  }, []);

  const run = useCallback(
    (promise: Promise<D>, runConfig?: { retry: () => Promise<D> }) => {
      if (!promise || !promise.then)
        throw new Error("Please afferent promise type");

      setRetry(() => () => {
        if (runConfig?.retry) run(runConfig.retry(), runConfig);
      });

      // setState({ ...state, stat: "loading" });
      setState((prevState) => ({ ...prevState, stat: "loading" }));

      return promise
        .then((data) => {
          if (mountedRef.current) setData(data);
          return data;
        })
        .catch((error) => {
          setError(error);
          if (config.throwOnError) return Promise.reject(error);
          return error;
        });
    },
    [config.throwOnError, mountedRef, setData, setError]
  );

  return {
    run,
    setData,
    setError,
    isIdle: state.stat === "idle",
    isLoading: state.stat === "loading",
    isSuccess: state.stat === "success",
    isError: state.stat === "error",
    retry,
    ...state,
  };
};
