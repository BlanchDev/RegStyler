export async function getPackageStore() {
  try {
    const response = await fetch(
      "https://regstyler.blanch.dev/server/api/packages",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "getPackageStore",
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

export async function getPackages(uid, token, browser) {
  try {
    const response = await fetch(
      "https://regstyler.blanch.dev/server/api/packages",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "getPackages",
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

export async function createPackage(
  uid,
  token,
  browser,
  packageTitle,
  checkedRegsID,
) {
  try {
    const response = await fetch(
      "https://regstyler.blanch.dev/server/api/packages",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "createPackage",
          uid,
          token,
          browser,
          packageTitle,
          checkedRegsID,
        }),
      },
    );

    if (!response.ok) {
      throw new Error("Network response was not OK!");
    }

    const data = await response.json();

    if (data.type !== "createPackage" || data.success !== true) {
      return;
    }

    return data;
  } catch (error) {
    console.error("Fetch error:", error);
  }
}
