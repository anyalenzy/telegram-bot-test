import { Markup } from "telegraf";

export const createInlineKeyboardRows = (
  buttons: [string, string][],
  buttonsPerRow: number
) => {
  const rows: [string, string][][] = [];
  for (let i = 0; i < buttons.length; i += buttonsPerRow) {
    rows.push(buttons.slice(i, i + buttonsPerRow));
  }
  return rows.map((row) =>
    row.map(([label, callbackData]) =>
      Markup.button.callback(label, callbackData)
    )
  );
};

export const createEditButtons = () =>
  Markup.inlineKeyboard([
    [Markup.button.callback("Змінити ім'я", "name_edit")],
    [Markup.button.callback("Змінити телефон", "phone_edit")],
    [Markup.button.callback("Змінити адресу", "address_edit")],
    [Markup.button.callback("Підтвердити", "confirm")],
  ]);

export const getFirstPartByUnderscore = (str: string): string => {
  const parts = str.split("_");
  return parts[0] || "";
};

export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^\+380\d{9}$/;
  return phoneRegex.test(phone);
};
