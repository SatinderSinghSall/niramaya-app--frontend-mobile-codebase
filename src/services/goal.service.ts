import { api } from "@/services/api";

import {
  CreateGoalPayload,
  Goal,
  UpdateGoalPayload,
  UpdateGoalProgressPayload,
} from "@/types/goal";

function extractGoal(response: any): Goal {
  return response.data?.data?.goal ?? response.data?.goal;
}

function extractGoals(response: any): Goal[] {
  return response.data?.data?.goals ?? response.data?.goals ?? [];
}

export async function getGoals(): Promise<Goal[]> {
  const response = await api.get("/goals");

  return extractGoals(response);
}

export async function getGoal(id: string): Promise<Goal> {
  const response = await api.get(`/goals/${id}`);

  return extractGoal(response);
}

export async function createGoal(payload: CreateGoalPayload): Promise<Goal> {
  const response = await api.post("/goals", payload);

  return extractGoal(response);
}

export async function updateGoal(
  id: string,
  payload: UpdateGoalPayload,
): Promise<Goal> {
  const response = await api.patch(`/goals/${id}`, payload);

  return extractGoal(response);
}

export async function deleteGoal(id: string) {
  const response = await api.delete(`/goals/${id}`);

  return response.data;
}

export async function updateGoalProgress(
  id: string,
  payload: UpdateGoalProgressPayload,
): Promise<Goal> {
  const response = await api.patch(`/goals/${id}/progress`, payload);

  return extractGoal(response);
}

export async function completeGoal(id: string): Promise<Goal> {
  const response = await api.patch(`/goals/${id}/complete`);

  return extractGoal(response);
}

export async function pauseGoal(id: string): Promise<Goal> {
  const response = await api.patch(`/goals/${id}/pause`);

  return extractGoal(response);
}

export async function resumeGoal(id: string): Promise<Goal> {
  const response = await api.patch(`/goals/${id}/resume`);

  return extractGoal(response);
}
