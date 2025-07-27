export interface Deployment {
  id: string;
  userId: string;
  name: string;
  description?: string;
  status: "building" | "deployed" | "failed" | "stopped";
  url?: string;
  subdomain: string;
  framework: "static" | "react" | "vue" | "angular" | "node";
  buildCommand?: string;
  outputDir?: string;
  envVars?: Record<string, string>;
  createdAt: Date;
  updatedAt: Date;
  lastDeployedAt?: Date;
  buildLogs?: string[];
  size?: number; // in bytes
  visits?: number;
}

export interface DeploymentConfig {
  name: string;
  description?: string;
  framework: "static" | "react" | "vue" | "angular" | "node";
  buildCommand?: string;
  outputDir?: string;
  envVars?: Record<string, string>;
  uploadType?: "files" | "zip";
}

export interface BuildLog {
  id: string;
  deploymentId: string;
  timestamp: Date;
  level: "info" | "warn" | "error";
  message: string;
}

export interface DeploymentStats {
  totalDeployments: number;
  activeDeployments: number;
  totalVisits: number;
  storageUsed: number; // in bytes
  storageLimit: number; // in bytes
}
