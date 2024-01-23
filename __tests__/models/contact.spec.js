const { Contact, sequelize } = require("../../models");

afterEach(async () => {
  await Contact.destroy({ truncate: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe("validations", () => {
  test("validであること", async () => {
    const contact = Contact.build({ name: "test", email: "test@example.com" });
    await expect(contact.validate()).resolves;
  });

  test("nameが空文字ならバリデーションエラーになること", async () => {
    const contact = Contact.build({ name: "", email: "test@example.com" });
    await expect(contact.validate()).rejects.toThrow(
      "Validation error: Validation notEmpty on name failed"
    );
  });

  test("emailが空文字ならバリデーションエラーになること", async () => {
    const contact = Contact.build({ name: "test", email: "" });
    await expect(contact.validate()).rejects.toThrow(
      "Validation error: Validation notEmpty on email failed"
    );
  });

  test("emailのフォーマットが合わないならバリデーションエラーになること", async () => {
    const contact = Contact.build({ name: "test", email: "test" });
    await expect(contact.validate()).rejects.toThrow(
      "Validation error: Validation isEmail on email failed"
    );
  });
});

describe("#isExample", () => {
  test("emailのドメインがexample.comなら真を返すこと", () => {
    const contact = Contact.build({
      name: "test",
      email: "test@example.com",
    });
    expect(contact.isExample()).toBeTruthy();
  });

  test("emailのドメインがexample.comではないなら偽を返すこと", () => {
    const contact = Contact.build({
      name: "test",
      email: "testk@circlearound.co.jp",
    });
    expect(contact.isExample()).toBeFalsy();
  });
});

describe(".latest", () => {
  beforeEach(async () => {
    await Contact.bulkCreate([
      { name: "test", email: "test@example.com" },
      { name: "test2", email: "test2@example.com" },
      { name: "test3", email: "test3@example.com" },
      { name: "test4", email: "test4@example.com" },
      { name: "test5", email: "test5@example.com" },
    ]);
  });

  test("引数なしなら新しい順に3件取得できること", async () => {
    const contacts = await Contact.latest();

    expect(contacts.length).toBe(3);
    expect(contacts[0].name).toBe("test5");
    expect(contacts[1].name).toBe("test4");
    expect(contacts[2].name).toBe("test3");
  });

  test("引数を指定したら新しい順に指定件数取得できること", async () => {
    const contacts = await Contact.latest(2);

    expect(contacts.length).toBe(2);
    expect(contacts[0].name).toBe("test5");
    expect(contacts[1].name).toBe("test4");
  });
});

describe(".search", () => {
  beforeEach(async () => {
    await Contact.bulkCreate([
      {
        name: "test",
        email: "test@example.com",
        createdAt: new Date(2020, 10, 1),
      },
      {
        name: "test2",
        email: "test2@example.com",
        createdAt: new Date(2020, 10, 29),
      },
      {
        name: "test3",
        email: "test3@example.com",
        createdAt: new Date(2020, 10, 29),
      },
      {
        name: "test3-2",
        email: "test3-2@example.com",
        createdAt: new Date(2020, 10, 31),
      },
      {
        name: "test5",
        email: "test5@example.com",
        createdAt: new Date(2020, 10, 27),
      },
    ]);
  });

  describe("name", () => {
    test("名前でlike検索したレコードが取れること", async () => {
      const contacts = await Contact.search({ name: "est" });

      expect(contacts.length).toBe(5);
      expect(contacts[0].name).toBe("test5");
      expect(contacts[1].name).toBe("test3-2");
      expect(contacts[2].name).toBe("test3");
      expect(contacts[3].name).toBe("test2");
      expect(contacts[4].name).toBe("test");
    });

    test("名前でlike検索したレコードが取れること", async () => {
      const contacts = await Contact.search({ name: "test3" });

      expect(contacts.length).toBe(2);
      expect(contacts[0].name).toBe("test3-2");
      expect(contacts[1].name).toBe("test3");
    });
  });

  describe("email", () => {
    test("emailでlike検索したレコードが取れること", async () => {
      const contacts = await Contact.search({ email: "est" });

      expect(contacts.length).toBe(5);
      expect(contacts[0].name).toBe("test5");
      expect(contacts[1].name).toBe("test3-2");
      expect(contacts[2].name).toBe("test3");
      expect(contacts[3].name).toBe("test2");
      expect(contacts[4].name).toBe("test");
    });

    test("emailでlike検索したレコードが取れること", async () => {
      const contacts = await Contact.search({ email: "2@example" });

      expect(contacts.length).toBe(2);
      expect(contacts[0].name).toBe("test3-2");
      expect(contacts[1].name).toBe("test2");
    });
  });

  describe("sinceDaysAgo", () => {
    test("sinceDaysAgoの日数分以前から作成されたレコードが取れること", async () => {
      const contacts = await Contact.search(
        { sinceDaysAgo: 3 },
        new Date(2020, 11, 1)
      );

      expect(contacts.length).toBe(3);
      expect(contacts[0].name).toBe("test3-2");
      expect(contacts[1].name).toBe("test3");
      expect(contacts[2].name).toBe("test2");
    });
  });

  describe("複合的な検索", () => {
    test("name、email, sinceDaysAgo の3要素で絞り込まれた結果が取得できること", async () => {
      const contacts = await Contact.search(
        { name: "3", email: "2@example", sinceDaysAgo: 3 },
        new Date(2020, 11, 1)
      );

      expect(contacts.length).toBe(1);
      expect(contacts[0].name).toBe("test3-2");
    });
  });
});
