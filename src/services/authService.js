export async function userLogin(uid, browser) {
  try {
    const response = await fetch(
      "https://regstyler.blanch.dev/server/api/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "login",
          uid,
          browser,
        }),
      },
    );

    if (!response.ok) {
      throw new Error("Network response was not OK!");
    }

    const data = await response.json();

    if (
      data.type !== "login" ||
      data.uid !== uid ||
      !data.token ||
      !data.browser
    ) {
      return;
    }

    localStorage.setItem("uid", data.uid);
    localStorage.setItem("token", data.token);
    localStorage.setItem("browser", data.browser);
    return true;
  } catch (error) {
    console.error("Fetch error:", error);
    return false;
  }
}

export async function userRegister(uid, nickname, email, photoURL) {
  try {
    const response = await fetch(
      "https://regstyler.blanch.dev/server/api/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "register",
          uid,
          nickname,
          email,
          photoURL,
        }),
      },
    );

    if (!response.ok) {
      throw new Error("Network response was not OK!");
    }

    const data = await response.json();

    if (data.type !== "register") {
      return;
    }

    return data;
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

export async function userCheck(uid) {
  try {
    const response = await fetch(
      "https://regstyler.blanch.dev/server/api/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "check",
          uid,
        }),
      },
    );

    if (!response.ok) {
      throw new Error("Network response was not OK!");
    }

    const data = await response.json();

    if (!data) {
      throw new Error("Failed to parse JSON response!");
    }

    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    return false;
  }
}

export async function userDataUpdate(uid, token, browser, nickname) {
  try {
    const response = await fetch(
      "https://regstyler.blanch.dev/server/api/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "userDataUpdate",
          uid,
          token,
          browser,
          nickname,
        }),
      },
    );

    if (!response.ok) {
      throw new Error("Network response was not OK!");
    }

    const data = await response.json();

    if (!data) {
      throw new Error("Failed to parse JSON response!");
    }

    if (data.type !== "userDataUpdate") {
      return;
    }

    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    return false;
  }
}
