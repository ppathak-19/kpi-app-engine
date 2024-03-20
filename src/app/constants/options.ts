export const aggregatorOptions = [
  { value: "min", label: "Minimum" },
  { value: "max", label: "Maximum" },
  { value: "median", label: "Median" },
  { value: "average", label: "Average" },
];

export const timeFrameOptions = [
  { value: "2", label: "Past 2 Days" },
  { value: "7", label: "Past 7 Days" },
  { value: "30", label: "Past 30 Days" },
  { value: "365", label: "Past 365 Days" },
  { value: "-w", label: "This week" },
  { value: "-m", label: "This month" },
];

export const estimatedSalaries = {
  salary: {
    "Level 1 Support FTE": "$40,000",
    "Specialist Staff Resource FTE": "$105,000",
    "QA FTE": "$55,000",
    "Developer FTE": "$78,000",
    "Monitoring Tool FTE": "$60,000",
    "Business User FTE": "$60,000",
    "Call Center Agent FTE": "$30,000",
    "Security Specialist FTE": "$77,778",
  },
  cloudOps: {
    "Cost per Call Center Call": "$3.61",
    "Severe Incidents (Estimated # per Year)": 100,
    "Total Incident Support Tickets (per Year)": 20000,
    "War Rooms Conducted (per Year)": 50,
    "Monitoring Tool Administration Team FTEs": 3,
  },
  devOps: {
    "Specialist Staff Resources Utilized per War Room": {
      value: 12,
    },
    "Hours per Specialist Staff Resource per War Room": {
      value: 1.5,
      unit: "H",
    },
    "Developer FTEs Instrumenting Applications for Observability": {
      value: 2,
    },
    "Estimated Number of Developers in Scope": {
      value: 150,
    },
    "% Development Resource Identifying and Remediating Vulnerabilities": {
      value: 20,
      unit: "%",
    },
    "Approximate Number of Development Sprints per Year": {
      value: 18,
    },
  },
  business: {
    "Annual Revenue per New Revenue Generating Application / Functionality Released":
      "$3,000,000",
    "Current Number of Monitoring Tools": 5,
    "Estimated Number of SLA Violations per Year": 12,
    "Average Cost per SLA Violation": "$74,074",
    "Concurrent Business Users Accessing Services": 100,
    Customers: 200000,
  },
};
