import React, { createContext, useContext, useState } from "react";

type MetricsContextType = {
  initialMttdValue: number;
  initialMttrValue: number;
  salaryValue: number;
  setMetricsData: (values: Partial<MetricsContextType>) => void;
};

const defaultMetricsContext: MetricsContextType = {
  initialMttdValue: 0,
  initialMttrValue: 0,
  salaryValue: 0,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setMetricsData: () => {},
};

const MetricsContext = createContext<MetricsContextType>(defaultMetricsContext);

export const useMetricsContext = () => useContext(MetricsContext);

export const MetricsProvider: React.FC = ({ children }) => {
  /** States For Baseline mttr,mttd values */
  const [metrics, setMetrics] = useState<MetricsContextType>(
    defaultMetricsContext
  );

  const setMetricsData = async (values: Partial<MetricsContextType>) => {
    setMetrics((prevMetrics) => ({
      ...prevMetrics,
      ...values,
    }));
  };

  return (
    <MetricsContext.Provider value={{ ...metrics, setMetricsData }}>
      {children}
    </MetricsContext.Provider>
  );
};
