export async function getOptimizations(uid, token, browser) {
  try {
    const response = await fetch(
      "https://regstyler.blanch.dev/server/api/optimizations",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "getOptimizations",
          uid,
          token,
          browser,
        }),
      },
    );

    if (!response.ok) {
      throw new Error("Network response was not OK!");
    }

    return await response.json();
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

export async function createOptimization(
  uid,
  token,
  browser,
  title,
  description,
  code,
  category,
) {
  try {
    const response = await fetch(
      "https://regstyler.blanch.dev/server/api/optimizations",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "createOptimization",
          uid,
          token,
          browser,
          title,
          description,
          code,
          category,
        }),
      },
    );

    if (!response.ok) {
      throw new Error("Network response was not OK!");
    }

    const data = await response.json();

    if (data.type !== "createOptimization" && data.success !== true) {
      return;
    }

    return data;
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

export async function editOptimization(uid, token, browser, optimizationData) {
  try {
    const response = await fetch(
      "https://regstyler.blanch.dev/server/api/optimizations",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "editOptimization",
          uid,
          token,
          browser,
          optimizationData,
        }),
      },
    );

    if (!response.ok) {
      throw new Error("Network response was not OK!");
    }

    const data = await response.json();

    if (data.type !== "editOptimization" && data.success !== true) {
      return;
    }

    return data;
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

export async function deleteOptimization(
  uid,
  token,
  browser,
  optimizationData,
) {
  try {
    const response = await fetch(
      "https://regstyler.blanch.dev/server/api/optimizations",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "deleteOptimization",
          uid,
          token,
          browser,
          optimizationData,
        }),
      },
    );

    if (!response.ok) {
      throw new Error("Network response was not OK!");
    }

    const data = await response.json();

    if (data.type !== "deleteOptimization" && data.success !== true) {
      return;
    }

    return data;
  } catch (error) {
    console.error("Fetch error:", error);
  }
}
