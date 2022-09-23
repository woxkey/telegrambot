const { Telegraf, Markup } = require("telegraf");
require("dotenv").config(); //need for .env file to work here so my token is hidden
const text = require("./const");

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.start((ctx) => {
  const firstName = ctx.message.from.first_name
    ? ctx.message.from.first_name
    : "Anonymos";
  ctx.reply(`Hello ${firstName}`);
});
bot.help((ctx) => ctx.reply(text.commands));

bot.command("course", async (ctx) => {
  try {
    await ctx.replyWithHTML(
      "<b>Courses</b>",
      Markup.inlineKeyboard([
        [
          Markup.button.callback("Redactors", "btn-1"),
          Markup.button.callback("Обзоры", "btn-2"),
        ],
        [Markup.button.callback("Обзоры", "btn-3")],
      ])
    );
  } catch (err) {
    console.error(err);
  }
});
function addActionBot(name, src, text) {
  bot.action(name, async (ctx) => {
    try {
      await ctx.answerCbQuery();
      if (src !== false) {
        await ctx.replyWithPhoto({
          source: src,
        });
      }
      await ctx.replyWithHTML(text, {
        disable_web_page_preview: true,
      });
    } catch (e) {
      console.error(e);
    }
  });
}

addActionBot("btn-1", "./img/1.png", text.text1);
addActionBot("btn-2", "./img/1.png", text.text2);
addActionBot("btn-3", false, text.text3);

bot.launch();

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
