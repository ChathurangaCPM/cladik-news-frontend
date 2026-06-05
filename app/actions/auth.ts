"use server";

import { cookies } from "next/headers";
import { getNewsAggregatorUrl } from "@/lib/utils";

const AUTH_SERVICE_URL = process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || "http://localhost:5002";
const NEWS_AGGREGATOR_URL = getNewsAggregatorUrl();

/**
 * Handle developer login action
 */
export async function loginAction(credentials: Record<string, unknown>) {
  try {
    const res = await fetch(`${AUTH_SERVICE_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      return {
        success: false,
        error: data.error || data.message || "Invalid credentials",
      };
    }

    const cookieStore = await cookies();

    // Store JWTs in secure, HTTP-only SameSite cookies
    cookieStore.set("accessToken", data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60, // 15 minutes
      path: "/",
    });

    cookieStore.set("refreshToken", data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return {
      success: true,
      user: data.user,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Login Server Action Error:", message);
    return {
      success: false,
      error: "Authentication service is currently offline. Please try again later.",
    };
  }
}

/**
 * Handle developer registration/signup action
 */
export async function signupAction(details: Record<string, unknown>) {
  try {
    const res = await fetch(`${AUTH_SERVICE_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...details,
        platform: "cladik-web",
      }),
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      return {
        success: false,
        error: data.error || data.message || "Registration failed",
      };
    }

    const cookieStore = await cookies();

    // Store JWTs on successful registration
    cookieStore.set("accessToken", data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60,
      path: "/",
    });

    cookieStore.set("refreshToken", data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    // Set initial plan to "none" in DB indicating registration is done but package selection is pending
    try {
      await fetch(`${AUTH_SERVICE_URL}/api/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.accessToken}`,
        },
        body: JSON.stringify({
          subscriptionPlanType: "none",
        }),
        cache: "no-store",
      });
    } catch (e) {
      console.error("Failed to initialize plan to none during registration:", e);
    }

    return {
      success: true,
      user: data.user,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Signup Server Action Error:", message);
    return {
      success: false,
      error: "Authentication service is currently offline. Please try again later.",
    };
  }
}

/**
 * Handle developer logout
 */
export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");
  return { success: true };
}

/**
 * Helper to refresh expired access tokens silently
 */
async function rotateTokens(refreshToken: string) {
  try {
    const res = await fetch(`${AUTH_SERVICE_URL}/api/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      return null;
    }

    const cookieStore = await cookies();

    cookieStore.set("accessToken", data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60,
      path: "/",
    });

    cookieStore.set("refreshToken", data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return data.accessToken;
  } catch {
    return null;
  }
}

/**
 * Fetch the active developer profile from cookies
 */
export async function getDeveloperSession() {
  const cookieStore = await cookies();
  let token = cookieStore.get("accessToken")?.value;
  const refresh = cookieStore.get("refreshToken")?.value;

  if (!token) {
    if (refresh) {
      token = (await rotateTokens(refresh)) || undefined;
    }
    if (!token) return null;
  }

  try {
    const res = await fetch(`${AUTH_SERVICE_URL}/api/auth/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      if (refresh) {
        token = (await rotateTokens(refresh)) || undefined;
        if (token) {
          return getDeveloperSession(); // Retry with refreshed token
        }
      }
      return null;
    }

    return data.user;
  } catch {
    return null;
  }
}

/**
 * Update the user's active billing subscription plan tier
 */
export async function updateSubscriptionPlanAction(planType: "none" | "pending" | "free" | "business" | "advanced") {
  const cookieStore = await cookies();
  let token = cookieStore.get("accessToken")?.value;
  const refresh = cookieStore.get("refreshToken")?.value;

  if (!token) {
    if (refresh) {
      token = (await rotateTokens(refresh)) || undefined;
    }
    if (!token) return { success: false, error: "Session expired" };
  }

  try {
    const res = await fetch(`${AUTH_SERVICE_URL}/api/auth/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        subscriptionPlanType: planType,
      }),
      cache: "no-store",
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      return { success: false, error: data.message || "Failed to update subscription" };
    }

    return { success: true, user: data.user };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { success: false, error: message };
  }
}

/**
 * Fetch developer API Keys from Postgres database
 */
export async function getDeveloperKeysAction() {
  const cookieStore = await cookies();
  let token = cookieStore.get("accessToken")?.value;
  const refresh = cookieStore.get("refreshToken")?.value;

  if (!token) {
    if (refresh) {
      token = (await rotateTokens(refresh)) || undefined;
    }
    if (!token) return [];
  }

  try {
    const res = await fetch(`${NEWS_AGGREGATOR_URL}/developer/keys`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    console.error("Fetch API Keys Server Action Error:", err);
    return [];
  }
}

/**
 * Create developer API Key in Postgres database
 */
export async function createDeveloperKeyAction(name: string) {
  const cookieStore = await cookies();
  let token = cookieStore.get("accessToken")?.value;
  const refresh = cookieStore.get("refreshToken")?.value;

  if (!token) {
    if (refresh) {
      token = (await rotateTokens(refresh)) || undefined;
    }
    if (!token) return { success: false, error: "Session expired" };
  }

  try {
    const res = await fetch(`${NEWS_AGGREGATOR_URL}/developer/keys`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name }),
      cache: "no-store",
    });

    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.message || "Failed to create API key" };
    }

    return { success: true, data };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { success: false, error: message };
  }
}

/**
 * Revoke developer API Key
 */
export async function revokeDeveloperKeyAction(id: string) {
  const cookieStore = await cookies();
  let token = cookieStore.get("accessToken")?.value;
  const refresh = cookieStore.get("refreshToken")?.value;

  if (!token) {
    if (refresh) {
      token = (await rotateTokens(refresh)) || undefined;
    }
    if (!token) return { success: false, error: "Session expired" };
  }

  try {
    const res = await fetch(`${NEWS_AGGREGATOR_URL}/developer/keys/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return { success: false, error: "Failed to revoke API key" };
    }

    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { success: false, error: message };
  }
}

/**
 * Fetch developer API usage metrics
 */
export async function getDeveloperMetricsAction() {
  const cookieStore = await cookies();
  let token = cookieStore.get("accessToken")?.value;
  const refresh = cookieStore.get("refreshToken")?.value;

  if (!token) {
    if (refresh) {
      token = (await rotateTokens(refresh)) || undefined;
    }
    if (!token) return null;
  }

  try {
    const res = await fetch(`${NEWS_AGGREGATOR_URL}/developer/metrics`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error("Fetch API Metrics Action Error:", err);
    return null;
  }
}

/**
 * Fetch developer API activity logs
 */
export async function getDeveloperLogsAction(page: number = 1, limit: number = 15) {
  const cookieStore = await cookies();
  let token = cookieStore.get("accessToken")?.value;
  const refresh = cookieStore.get("refreshToken")?.value;

  if (!token) {
    if (refresh) {
      token = (await rotateTokens(refresh)) || undefined;
    }
    if (!token) return { data: [], total: 0, page: 1, limit: 15, totalPages: 0 };
  }

  try {
    const res = await fetch(`${NEWS_AGGREGATOR_URL}/developer/logs?page=${page}&limit=${limit}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) return { data: [], total: 0, page: 1, limit: 15, totalPages: 0 };
    return await res.json();
  } catch (err) {
    console.error("Fetch API Logs Action Error:", err);
    return { data: [], total: 0, page: 1, limit: 15, totalPages: 0 };
  }
}

/**
 * Fetch developer API analytics chart data (past 7 days)
 */
export async function getDeveloperChartDataAction() {
  const cookieStore = await cookies();
  let token = cookieStore.get("accessToken")?.value;
  const refresh = cookieStore.get("refreshToken")?.value;

  if (!token) {
    if (refresh) {
      token = (await rotateTokens(refresh)) || undefined;
    }
    if (!token) return [];
  }

  try {
    const res = await fetch(`${NEWS_AGGREGATOR_URL}/developer/charts`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    console.error("Fetch API Chart Data Action Error:", err);
    return [];
  }
}

/**
 * Run a secure playground simulation via console user session
 */
export async function runDeveloperPlaygroundAction(
  apiKeyId: string,
  endpoint: string,
  searchQuery: string,
  limit: number
) {
  const cookieStore = await cookies();
  let token = cookieStore.get("accessToken")?.value;
  const refresh = cookieStore.get("refreshToken")?.value;

  if (!token) {
    if (refresh) {
      token = (await rotateTokens(refresh)) || undefined;
    }
    if (!token) return { success: false, error: "Authentication session expired. Please log in again." };
  }

  try {
    const res = await fetch(`${NEWS_AGGREGATOR_URL}/developer/playground/run`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        apiKeyId,
        endpoint,
        searchQuery,
        limit
      }),
      cache: "no-store",
    });

    if (!res.ok) {
      const data = await res.json();
      return { success: false, error: data.message || "Sandbox execution rejected." };
    }
    const data = await res.json();
    return { success: true, data };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("runDeveloperPlaygroundAction error:", err);
    return { success: false, error: message || "Failed to establish sandbox pipeline link." };
  }
}

/**
 * Fetch developer webhook configurations
 */
export async function getDeveloperWebhooksAction() {
  const cookieStore = await cookies();
  let token = cookieStore.get("accessToken")?.value;
  const refresh = cookieStore.get("refreshToken")?.value;

  if (!token) {
    if (refresh) {
      token = (await rotateTokens(refresh)) || undefined;
    }
    if (!token) return [];
  }

  try {
    const res = await fetch(`${NEWS_AGGREGATOR_URL}/developer/webhooks`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    console.error("Fetch Webhooks Server Action Error:", err);
    return [];
  }
}

/**
 * Register a new developer webhook callback URL configuration
 */
export async function createDeveloperWebhookAction(url: string, events: string[]) {
  const cookieStore = await cookies();
  let token = cookieStore.get("accessToken")?.value;
  const refresh = cookieStore.get("refreshToken")?.value;

  if (!token) {
    if (refresh) {
      token = (await rotateTokens(refresh)) || undefined;
    }
    if (!token) return { success: false, error: "Session expired" };
  }

  try {
    const res = await fetch(`${NEWS_AGGREGATOR_URL}/developer/webhooks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ url, events }),
      cache: "no-store",
    });

    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.message || "Failed to configure webhook target." };
    }

    return { success: true, data };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { success: false, error: message };
  }
}

/**
 * Toggle webhook active / inactive status
 */
export async function toggleDeveloperWebhookStatusAction(id: string) {
  const cookieStore = await cookies();
  let token = cookieStore.get("accessToken")?.value;
  const refresh = cookieStore.get("refreshToken")?.value;

  if (!token) {
    if (refresh) {
      token = (await rotateTokens(refresh)) || undefined;
    }
    if (!token) return { success: false, error: "Session expired" };
  }

  try {
    const res = await fetch(`${NEWS_AGGREGATOR_URL}/developer/webhooks/${id}/toggle`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return { success: false, error: "Failed to toggle webhook target status." };
    }

    const data = await res.json();
    return { success: true, data };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { success: false, error: message };
  }
}

/**
 * Delete developer webhook callback endpoint
 */
export async function deleteDeveloperWebhookAction(id: string) {
  const cookieStore = await cookies();
  let token = cookieStore.get("accessToken")?.value;
  const refresh = cookieStore.get("refreshToken")?.value;

  if (!token) {
    if (refresh) {
      token = (await rotateTokens(refresh)) || undefined;
    }
    if (!token) return { success: false, error: "Session expired" };
  }

  try {
    const res = await fetch(`${NEWS_AGGREGATOR_URL}/developer/webhooks/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return { success: false, error: "Failed to delete webhook target." };
    }

    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { success: false, error: message };
  }
}

/**
 * Fetch developer webhook stats
 */
export async function getDeveloperWebhookStatsAction() {
  const cookieStore = await cookies();
  let token = cookieStore.get("accessToken")?.value;
  const refresh = cookieStore.get("refreshToken")?.value;

  if (!token) {
    if (refresh) {
      token = (await rotateTokens(refresh)) || undefined;
    }
    if (!token) return { pendingJobs: 0, globalCompleted: 14295, userTotal: 0, userSuccess: 0, userFailed: 0 };
  }

  try {
    const res = await fetch(`${NEWS_AGGREGATOR_URL}/developer/webhooks/stats`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) return { pendingJobs: 0, globalCompleted: 14295, userTotal: 0, userSuccess: 0, userFailed: 0 };
    return await res.json();
  } catch (err) {
    console.error("Fetch Webhook Stats Server Action Error:", err);
    return { pendingJobs: 0, globalCompleted: 14295, userTotal: 0, userSuccess: 0, userFailed: 0 };
  }
}

/**
 * Fetch webhook delivery telemetry logs
 */
export async function getDeveloperWebhookLogsAction(limit: number = 25) {
  const cookieStore = await cookies();
  let token = cookieStore.get("accessToken")?.value;
  const refresh = cookieStore.get("refreshToken")?.value;

  if (!token) {
    if (refresh) {
      token = (await rotateTokens(refresh)) || undefined;
    }
    if (!token) return [];
  }

  try {
    const res = await fetch(`${NEWS_AGGREGATOR_URL}/developer/webhooks/logs?limit=${limit}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    console.error("Fetch Webhook Logs Action Error:", err);
    return [];
  }
}

/**
 * Trigger outbound real-time webhook test execution in sandbox
 */
export async function testDeveloperWebhookAction(url: string, event: string) {
  const cookieStore = await cookies();
  let token = cookieStore.get("accessToken")?.value;
  const refresh = cookieStore.get("refreshToken")?.value;

  if (!token) {
    if (refresh) {
      token = (await rotateTokens(refresh)) || undefined;
    }
    if (!token) return { success: false, error: "Session expired" };
  }

  try {
    const res = await fetch(`${NEWS_AGGREGATOR_URL}/developer/webhooks/test`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ url, event }),
      cache: "no-store",
    });

    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.message || "Failed to trigger simulated sandbox dispatch." };
    }

    return { success: true, data };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { success: false, error: message };
  }
}

/**
 * Add email to waitlist for premium plans (Business/Advanced)
 */
export async function joinWaitlistAction(email: string, planId: string) {
  try {
    const res = await fetch(`${NEWS_AGGREGATOR_URL}/news/waitlist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, planId }),
      cache: "no-store",
    });

    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.message || "Failed to join waitlist." };
    }

    return { success: true, message: data.message };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("joinWaitlistAction error:", err);
    return { success: false, error: message || "Failed to submit waitlist registration." };
  }
}
