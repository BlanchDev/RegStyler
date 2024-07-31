export async function getPackageDetails(uid, token, browser, packageID) {
  try {
    const body = {
      type: "getPackageDetails",
      packageID,
    };

    if (uid) body.uid = uid;
    if (token) body.token = token;
    if (browser) body.browser = browser;

    const response = await fetch(
      "https://regstyler.blanch.dev/server/api/packageDetails",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
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

export async function editPackage(
  uid,
  token,
  browser,
  packageID,
  packageTitle,
  packageDescription,
  optimizationsID,
) {
  try {
    const response = await fetch(
      "https://regstyler.blanch.dev/server/api/packageDetails",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "editPackage",
          uid,
          token,
          browser,
          packageID,
          packageTitle,
          packageDescription,
          optimizationsID,
        }),
      },
    );

    if (!response.ok) {
      throw new Error("Network response was not OK!");
    }

    const data = await response.json();

    if (data.type !== "editPackage" || data.success !== true) {
      return;
    }

    return data;
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

export async function sharePackage(
  uid,
  token,
  browser,
  packageID,
  isPublic,
  packageTitle,
  packageDescription,
) {
  try {
    const response = await fetch(
      "https://regstyler.blanch.dev/server/api/packageDetails",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "sharePackage",
          uid,
          token,
          browser,
          packageID,
          isPublic,
          packageTitle,
          packageDescription,
        }),
      },
    );

    if (!response.ok) {
      throw new Error("Network response was not OK!");
    }

    const data = await response.json();

    if (data.type !== "sharePackage" || data.success !== true) {
      return;
    }

    return data;
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

export async function deletePackage(uid, token, browser, packageID) {
  try {
    const response = await fetch(
      "https://regstyler.blanch.dev/server/api/packageDetails",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "deletePackage",
          uid,
          token,
          browser,
          packageID,
        }),
      },
    );

    if (!response.ok) {
      throw new Error("Network response was not OK!");
    }

    const data = await response.json();

    if (data.type !== "deletePackage" || data.success !== true) {
      return;
    }

    return data;
  } catch (error) {
    console.error("Fetch error:", error);
  }
}
