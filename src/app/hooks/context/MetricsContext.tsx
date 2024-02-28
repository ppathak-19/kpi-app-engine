import React, { createContext, useContext, useState } from "react";

interface MetricsContextType {
  metrics: any;
  initialMttdValue: any;
  initialMttrValue: any;
  setMetricsData: (values: Partial<MetricsContextType>) => void;
}

const defaultMetricsContext: MetricsContextType = {
  metrics: {},
  initialMttdValue: 0,
  initialMttrValue: 0,
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
