import { Markup, Context } from "telegraf";

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
    [Markup.button.callback("Змінити ім'я", "edit_name")],
    [Markup.button.callback("Змінити телефон", "edit_phone")],
    [Markup.button.callback("Змінити адресу", "edit_address")],
    [Markup.button.callback("Підтвердити", "confirm_contact")],
  ]);

export const getFirstPartByUnderscore = (str: string): string => {
  const parts = str.split("_");
  return parts[0] || "";
};

export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^\+380\d{9}$/;
  return phoneRegex.test(phone);
};
