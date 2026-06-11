/**
 * Types for InsightForge AI Business Intelligence Platform.
 */

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface MetricCard {
  id: string;
  label: string;
  value: string | number;
  change: string;
  isPositive: boolean;
  icon: string;
  trendData: number[];
}

export interface DocumentRecord {
  id: string;
  title: string;
  content: string;
  addedAt: string;
  wordCount: number;
  sizeKb: number;
}

export interface MLPredictionRequest {
  marketingSpend: number;
  productPrice: number;
  engagementScore: number;
  supportTurnaround: number;
  loyaltyCategory: 'Standard' | 'Silver' | 'Gold' | 'VIP';
}

export interface SHAPValue {
  feature: string;
  value: number;
  effect: 'positive' | 'negative';
  description: string;
}

export interface MLPredictionResponse {
  conversionProbability: number;
  churnProbability: number;
  projectedSalesValue: number;
  shapValues: SHAPValue[];
}

export interface RevenueMetric {
  month: string;
  actual: number;
  target: number;
  organic: number;
  paid: number;
}

export interface ChannelMetric {
  name: string;
  value: number;
  color: string;
  conversion: number;
}
