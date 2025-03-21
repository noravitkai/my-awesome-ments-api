import { test, expect, APIRequestContext } from "@playwright/test";

export default function creatureTestCollection() {
  const user = {
    username: "UserAccount",
    email: "useraccount@example.com",
    password: "TestPass123",
  };

  const creature = {
    name: "Táltos",
    translation: "Shaman",
    description:
      "The Táltos is a shamanic figure, believed to be born with extra bones, teeth, or other unusual attributes. Unlike the ordinary people, a Táltos is connected to the spiritual world and can communicate with spirits, predict the future, and heal the sick.",
    powerLevel: 88,
    strengths: "Healing, prophecy",
    weaknesses: "Spiritual disconnection",
    funFact:
      "Táltos myths may have roots in ancient Hungarian shamans from the steppe nomads.",
    imageURL: "https://example.com/taltos.jpg",
  };

  // Shared helper for registration + login
  async function registerAndLogin(request: APIRequestContext) {
    await request.post("/api/user/register", { data: user });

    const loginRes = await request.post("/api/user/login", {
      data: { email: user.email, password: user.password },
    });

    return (await loginRes.json()).data;
  }

  //------------------------------------------------------------------------------
  // Workflow test (register, login, create, verify)
  //------------------------------------------------------------------------------
  test("Authenticated user can create new creature and retrieve it from list", async ({
    request,
  }) => {
    const { token, userId } = await registerAndLogin(request);

    const response = await request.post("/api/creatures", {
      data: { ...creature, _createdBy: userId },
      headers: { "auth-token": token },
    });

    expect(response.status()).toBe(201);
    const created = await response.json();

    expect(created.name).toBe(creature.name);
    expect(created.translation).toBe(creature.translation);
    expect(created.powerLevel).toBe(creature.powerLevel);

    const allRes = await request.get("/api/creatures");
    const allCreatures = await allRes.json();

    expect(allRes.status()).toBe(200);
    expect(allCreatures).toHaveLength(1);
    expect(allCreatures[0].name).toBe(creature.name);
  });

  //------------------------------------------------------------------------------
  // Duplicate name test (database uniqueness validation)
  //------------------------------------------------------------------------------
  test("Creating duplicate creature should return 400", async ({ request }) => {
    const { token, userId } = await registerAndLogin(request);

    await request.post("/api/creatures", {
      data: { ...creature, _createdBy: userId },
      headers: { "auth-token": token },
    });

    const duplicateRes = await request.post("/api/creatures", {
      data: { ...creature, _createdBy: userId },
      headers: { "auth-token": token },
    });

    const duplicateJson = await duplicateRes.json();

    expect(duplicateRes.status()).toBe(400);
    expect(duplicateJson.error).toBe(
      "A creature with this name already exists."
    );
  });

  //------------------------------------------------------------------------------
  // Missing required field test (controller-level validation)
  //------------------------------------------------------------------------------
  test("Creating creature with missing required fields should return 400", async ({
    request,
  }) => {
    const { token, userId } = await registerAndLogin(request);

    const incompleteCreature = {
      name: "Csodaszarvas",
      translation: "Miraculous Deer",
      powerLevel: 95,
      strengths: "Exceptional speed, eluding hunters",
      weaknesses: "No known weaknesses",
      funFact:
        "The legend of the Csodaszarvas is one of Hungary’s oldest myths, dating back over a thousand years.",
      imageURL: "https://example.com/csodaszarvas.jpg",
      _createdBy: userId,
    };

    const res = await request.post("/api/creatures", {
      data: incompleteCreature,
      headers: { "auth-token": token },
    });

    const json = await res.json();

    expect(res.status()).toBe(400);
    expect(json.error).toBe("Missing required fields.");
  });

  //------------------------------------------------------------------------------
  // By ID tests (fetch, update, delete)
  //------------------------------------------------------------------------------
  test("Authenticated user can retrieve a creature by its ID", async ({
    request,
  }) => {
    const { token, userId } = await registerAndLogin(request);

    const createRes = await request.post("/api/creatures", {
      data: { ...creature, _createdBy: userId },
      headers: { "auth-token": token },
    });
    const created = await createRes.json();

    const getRes = await request.get(`/api/creatures/${created._id}`);
    const fetched = await getRes.json();

    expect(getRes.status()).toBe(200);
    expect(fetched._id).toBe(created._id);
    expect(fetched.name).toBe(creature.name);
  });

  test("Authenticated user can update a creature by its ID", async ({
    request,
  }) => {
    const { token, userId } = await registerAndLogin(request);

    const createRes = await request.post("/api/creatures", {
      data: { ...creature, _createdBy: userId },
      headers: { "auth-token": token },
    });
    const created = await createRes.json();

    const updates = { description: "Updated description about the Táltos." };

    const updateRes = await request.put(`/api/creatures/${created._id}`, {
      data: updates,
      headers: { "auth-token": token },
    });

    const updateJson = await updateRes.json();

    expect(updateRes.status()).toBe(200);
    expect(updateJson.updatedCreature.description).toBe(updates.description);
  });

  test("Authenticated user can delete a creature by its ID", async ({
    request,
  }) => {
    const { token, userId } = await registerAndLogin(request);

    const createRes = await request.post("/api/creatures", {
      data: { ...creature, _createdBy: userId },
      headers: { "auth-token": token },
    });
    const created = await createRes.json();

    const deleteRes = await request.delete(`/api/creatures/${created._id}`, {
      headers: { "auth-token": token },
    });

    const deleteJson = await deleteRes.json();

    expect(deleteRes.status()).toBe(200);
    expect(deleteJson.deletedCreature._id).toBe(created._id);
  });

  //------------------------------------------------------------------------------
  // Security tests (creating/updating/deleting without authentication)
  //------------------------------------------------------------------------------
  test("Creating a creature without authentication should return 400", async ({
    request,
  }) => {
    const res = await request.post("/api/creatures", {
      data: {
        ...creature,
        _createdBy: "user-id",
      },
    });

    const json = await res.json();

    expect(res.status()).toBe(400);
    expect(json.error).toBe("Access denied.");
  });

  test("Updating creature data without authentication should return 400", async ({
    request,
  }) => {
    const { token, userId } = await registerAndLogin(request);

    const createRes = await request.post("/api/creatures", {
      data: { ...creature, _createdBy: userId },
      headers: { "auth-token": token },
    });
    const created = await createRes.json();

    const res = await request.put(`/api/creatures/${created._id}`, {
      data: { description: "Attempted update without token" },
    });

    const json = await res.json();

    expect(res.status()).toBe(400);
    expect(json.error).toBe("Access denied.");
  });

  test("Deleting a creature without authentication should return 400", async ({
    request,
  }) => {
    const { token, userId } = await registerAndLogin(request);

    const createRes = await request.post("/api/creatures", {
      data: { ...creature, _createdBy: userId },
      headers: { "auth-token": token },
    });
    const created = await createRes.json();

    const res = await request.delete(`/api/creatures/${created._id}`);

    const json = await res.json();

    expect(res.status()).toBe(400);
    expect(json.error).toBe("Access denied.");
  });
}
