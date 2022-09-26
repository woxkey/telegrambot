const { Telegraf, Markup } = require("telegraf");
require("dotenv").config();
const myConsts = require("./const");

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.start(async (ctx) => {
  const firstName = ctx.message.from.first_name
    ? ctx.message.from.first_name
    : "Anonymos";
  await ctx.reply(
    `
Привет, ${firstName}
Чем тебе помочь?
  `,
    Markup.inlineKeyboard([
      [Markup.button.url("Посмотреть план обучения", myConsts.plan)],
      [Markup.button.callback("Помощь", "help-btn")],
    ])
  );
});
bot.help((ctx) => ctx.reply(myConsts.commands));

bot.command("plan", async (ctx) => {
  try {
    console.log(ctx);
    await ctx.reply(
      "Посмотреть план обучения:",
      Markup.inlineKeyboard([[Markup.button.url("Ссылка", myConsts.plan)]])
    );
  } catch (e) {
    console.error(e);
  }
});

bot.command("time", async (ctx) => {
  try {
    const currentTime = getCurrentTime();
    await ctx.reply(`${currentTime}`);
  } catch (e) {
    console.log(e);
  }
});

function getCurrentTime() {
  let today = new Date();
  today.toString();
  const dateOfTheWeek = myConsts.weekdays[today.getDay()];
  const day = today.getDate();
  const nameOfCurrentMonth = myConsts.monthNames[today.getMonth()];
  const hours = today.getHours();
  const minutes = today.getMinutes();
  const seconds = today.getSeconds();
  const fullDate = `Today is ${dateOfTheWeek}, ${nameOfCurrentMonth} ${day}\nCurrent time is: ${hours}:${minutes}:${seconds}`;
  return fullDate;
}

// bot.command("course", async (ctx) => {
//   try {
//     await ctx.replyWithHTML(
//       "<b>Courses</b>",
//       Markup.inlineKeyboard([
//         [
//           Markup.button.callback("Redactors", "btn-1"),
//           Markup.button.callback("12", "btn-2"),
//         ],
//       ])
//     );
//   } catch (err) {
//     console.error(err);
//   }
// });
function addActionBot(name, src, text) {
  bot.action(name, async (ctx) => {
    try {
      await ctx.answerCbQuery();
      if (src !== false) {
        await ctx.replyWithPhoto({
          source: src,
        });
      }
      await ctx.reply(text, {
        disable_web_page_preview: true,
      });
    } catch (e) {
      console.error(e);
    }
  });
}

bot.action("help-btn", async (ctx) => {
  try {
    await ctx.answerCbQuery();
    await ctx.reply(myConsts.commands);
  } catch (e) {
    console.error(e);
  }
});

addActionBot("plan-btn", false, myConsts.text1);

addActionBot("btn-1", "./img/1.png", myConsts.text1);

bot.launch();

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
