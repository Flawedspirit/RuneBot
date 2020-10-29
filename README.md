# RuneBot
## (A Discord bot, not a _bot_ bot)

A really simple Discord OSRS bot that I'm making because the one I used to use kept going down for long periods at a time.

## Using and Building the Source

After cloning this repository, make sure to rename the included `config.json.dist` to `config.json`, and within it add your Discord application's token. This token can be found at https://discord.com/developers/applications under the **Bot** tab once you have created an application to contain the bot.

Additionally, a list of User IDs can be specified under `"owners": []` to allow these users access to bot-owner only commands (see the list of commands below).

Once your config has been configured, run the following command (with the root of the bot as your working directory)

```npm run start-win``` ***or*** ```npm run start-unix``` depending on your OS.

Alternatively, the bot can be run with a more verbose debugging mode by either running

```npm run debug```

or setting `"debug": true` in your `config.json`.

----
## Commands and Aliases

Command | Aliases | Description
------- | ------- | -----------
bosses | kc | View boss kill-count for `<user>`
dmmstats | 07stats-dmm, hsdmm | View deadman mode hiscores for `<user>`
hcstats | 07stats-hc, hshc | View hardcore ironman hiscores for `<user>`
help | commands, ? | Print a command list in Discord
invite | oauth, join | Creates a link to invite this bot to your server
ironstats | 07stats-im, hsim | View ironman hiscores for `<user>`
ping | p, poke | Ping the bot
price | 07price, ge | View `<item>` listing on the Grand Exchange
reload || Reloads a command config file without restarting the whole bot **[Owner Only]**
reset || Gets time until the game's faily reset at 00:00 UTC (time displayed is in your local time)
stats | 07stats, hs | View standard hiscores for `<user>`
uimstats | 07stats-uim, hsuim | View ultimate ironman hiscores for `<user>`

## To-do
- Implement a proper permissions system

----
## Developers/Credits

Creator: @Flawedspirit