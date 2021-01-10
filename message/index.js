/**
 * This source code below is free, please DO NOT sell this in any form!
 * Source code ini gratis, jadi tolong JANGAN jual dalam bentuk apapun!
 *
 * If you copying one of our source code, please give us CREDITS. Because this is one of our hardwork.
 * Apabila kamu menjiplak salah satu source code ini, tolong berikan kami CREDIT. Karena ini adalah salah satu kerja keras kami.
 *
 * If you want to contributing to this source code, pull requests are always open.
 * Apabila kamu ingin berkontribusi ke source code ini, pull request selalu kami buka.
 * 
 * Thanks for the contributions.
 * Terima kasih atas kontribusinya.
 */

/********** MODULES **********/
const { decryptMedia, Client } = require('@open-wa/wa-automate')
const fs = require('fs-extra')
const config = require('../config.json')
const Nekos = require('nekos.life')
const neko = new Nekos()
const os = require('os')
const nhentai = require('nhentai-js')
const { API } = require('nhentai-api')
const api = new API()
const sagiri = require('sagiri')
const saus = sagiri(config.nao, { results: 5 })
const axios = require('axios')
const tts = require('node-gtts')
const bent = require('bent')
const ms = require('parse-ms')
const toMs = require('ms')
const canvas = require('canvacord')
const mathjs = require('mathjs')
const emojiUnicode = require('emoji-unicode')
const moment = require('moment-timezone')
moment.tz.setDefault('Asia/Jakarta').locale('id')
/********** END OF MODULES **********/

/********** UTILS **********/
const { msgFilter, color, processTime, isUrl, createSerial } = require('../tools')
const { nsfw, weeaboo, downloader, sticker, fun, misc, toxic } = require('../lib')
const { uploadImages } = require('../tools/fetcher')
const { ind, eng } = require('./text/lang/')
const { limit, level, card, register, afk, reminder, premium } = require('../function')
const cd = 4.32e+7
const errorImg = 'https://i.ibb.co/jRCpLfn/user.png'
const tanggal = moment.tz('Asia/Jakarta').format('DD-MM-YYYY')
/********** END OF UTILS **********/

/********** DATABASES **********/
const _nsfw = JSON.parse(fs.readFileSync('./database/group/nsfw.json'))
const _antilink = JSON.parse(fs.readFileSync('./database/group/antilink.json'))
const _leveling = JSON.parse(fs.readFileSync('./database/group/leveling.json'))
const _welcome = JSON.parse(fs.readFileSync('./database/group/welcome.json'))
const _autosticker = JSON.parse(fs.readFileSync('./database/group/autosticker.json'))
const _ban = JSON.parse(fs.readFileSync('./database/bot/banned.json'))
const _premium = JSON.parse(fs.readFileSync('./database/bot/premium.json'))
const _registered = JSON.parse(fs.readFileSync('./database/bot/registered.json'))
const _level = JSON.parse(fs.readFileSync('./database/user/level.json'))
const _limit = JSON.parse(fs.readFileSync('./database/user/limit.json'))
const _afk = JSON.parse(fs.readFileSync('./database/user/afk.json'))
const _reminder = JSON.parse(fs.readFileSync('./database/user/reminder.json'))
const _bg = JSON.parse(fs.readFileSync('./database/user/card/background.json'))
const _setting = JSON.parse(fs.readFileSync('./database/bot/setting.json'))
let { memberLimit, groupLimit } = _setting
/********** END OF DATABASES **********/

/********** MESSAGE HANDLER **********/
module.exports = msgHandler = async (bocchi = new Client(), message) => {
    try {
        const { type, id, from, t, sender, isGroupMsg, chat, caption, isMedia, mimetype, quotedMsg, quotedMsgObj, mentionedJidList } = message
        let { body } = message
        const { name, formattedTitle } = chat
        let { pushname, verifiedName, formattedName } = sender
        pushname = pushname || verifiedName || formattedName
        const botNumber = await bocchi.getHostNumber() + '@c.us'
        const blockNumber = await bocchi.getBlockedIds()
        const ownerNumber = config.ownerBot
        const groupId = isGroupMsg ? chat.groupMetadata.id : ''
        const groupAdmins = isGroupMsg ? await bocchi.getGroupAdmins(groupId) : ''
        const time = moment(t * 1000).format('DD/MM/YY HH:mm:ss')

        const chats = (type === 'chat') ? body : ((type === 'image' || type === 'video')) ? caption : ''
        const prefix  = config.prefix
        body = (type === 'chat' && body.startsWith(prefix)) ? body : (((type === 'image' || type === 'video') && caption) && caption.startsWith(prefix)) ? caption : ''
        const command = body.slice(1).trim().split(/ +/).shift().toLowerCase()
        const args = body.trim().split(/ +/).slice(1)
        const uaOverride = config.uaOverride
        const q = args.join(' ')
        const ar = args.map((v) => v.toLowerCase())
        const url = args.length !== 0 ? args[0] : ''

        /********** VALIDATOR **********/
        const isCmd = body.startsWith(prefix)
        const isBlocked = blockNumber.includes(sender.id)
        const isOwner = sender.id === ownerNumber
        const isGroupAdmins = groupAdmins.includes(sender.id) || false
        const isBotGroupAdmins = groupAdmins.includes(botNumber) || false
        const isBanned = _ban.includes(sender.id)
        const isPremium = premium.checkPremiumUser(sender.id, _premium)
        const isRegistered = register.checkRegisteredUser(sender.id, _registered)
        const isNsfw = isGroupMsg ? _nsfw.includes(groupId) : false
        const isWelcomeOn = isGroupMsg ? _welcome.includes(groupId) : false
        const isDetectorOn = isGroupMsg ? _antilink.includes(groupId) : false
        const isLevelingOn = isGroupMsg ? _leveling.includes(groupId) : false
        const isAutoStickerOn = isGroupMsg ? _autosticker.includes(groupId) : false
        const isAfkOn = afk.checkAfkUser(sender.id, _afk)
        const isQuotedImage = quotedMsg && quotedMsg.type === 'image'
        const isQuotedVideo = quotedMsg && quotedMsg.type === 'video'
        const isQuotedSticker = quotedMsg && quotedMsg.type === 'sticker'
        const isQuotedGif = quotedMsg && quotedMsg.mimetype === 'image/gif'
        const isImage = type === 'image'
        /********** END OF VALIDATOR **********/

        // Automate
        premium.expiredCheck(_premium)

        // Leveling [BETA] by Slavyan
        if (isGroupMsg && isRegistered && !isBanned && isLevelingOn) {
            const currentLevel = level.getLevelingLevel(sender.id, _level)
            const checkId = level.getLevelingId(sender.id, _level)
            const checkBg = card.getBg(sender.id, _bg)
            try {
                if (currentLevel === undefined && checkId === undefined) level.addLevelingId(sender.id, _level)
                if (checkBg === undefined) card.addBg(sender.id, _bg)
                const amountXp = Math.floor(Math.random() * 10) + 20
                const requiredXp = 200 * (Math.pow(2, currentLevel) - 1)
                const getLevel = level.getLevelingLevel(sender.id, _level)
                level.addLevelingXp(sender.id, amountXp, _level)
                if (requiredXp <= level.getLevelingXp(sender.id, _level)) {
                    level.addLevelingLevel(sender.id, 1, _level)
                    await bocchi.reply(from, `*「 LEVEL UP 」*\n\n➸ *Name*: ${pushname}\n➸ *XP*: ${level.getLevelingXp(sender.id, _level)}\n➸ *Level*: ${getLevel} -> ${level.getLevelingLevel(sender.id, _level)}\n\nCongrats!! 🎉🎉`, id)
                }
            } catch (err) {
                console.error(err)
            }
        }

        // Anti-group link detector
        if (isGroupMsg && !isGroupAdmins && isBotGroupAdmins && isDetectorOn && !isOwner) {
            if (chats.match(new RegExp(/(https:\/\/chat.whatsapp.com)/gi))) {
                await bocchi.reply(from, ind.linkDetected(), id)
                await bocchi.removeParticipant(groupId, sender.id)
            }
        }

        // Auto-sticker
        if (isGroupMsg && isAutoStickerOn && isMedia && isImage && !isCmd) {
            const mediaData = await decryptMedia(message, uaOverride)
            const imageBase64 = `data:${mimetype};base64,${mediaData.toString('base64')}`
            await bocchi.sendImageAsSticker(from, imageBase64)
                .then(() => {
                    console.log(`Sticker processed for ${processTime(t, moment())} seconds`)
                })
                .catch(async (err) => {
                    console.error(err)
                    await bocchi.reply(from, 'Error!', id)
                })
        }

        // AFK by Slavyan
        if (isGroupMsg) {
            for (let ment of mentionedJidList) {
                if (afk.checkAfkUser(ment, _afk)) {
                    const getId = afk.getAfkId(ment, _afk)
                    const getReason = afk.getAfkReason(getId, _afk)
                    const getTime = afk.getAfkTime(getId, _afk)
                    await bocchi.reply(from, ind.afkMentioned(getReason, getTime), id)
                }
            }
            if (afk.checkAfkUser(sender.id, _afk) && !isCmd) {
                _afk.splice(afk.getAfkPosition(sender.id, _afk), 1)
                fs.writeFileSync('./database/user/afk.json', JSON.stringify(_afk))
                await bocchi.sendText(from, ind.afkDone(pushname))
            }
        }

        // Ignore banned and blocked users
        if (isCmd && (isBanned || isBlocked) && !isGroupMsg) return console.log(color('[BAN]', 'red'), color(time, 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname))
        if (isCmd && (isBanned || isBlocked) && isGroupMsg) return console.log(color('[BAN]', 'red'), color(time, 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname), 'in', color(name || formattedTitle))

        // Anti-spam
        // Log
        if (isCmd && !isGroupMsg) console.log(color('[CMD]'), color(time, 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname))
        if (isCmd && isGroupMsg) console.log(color('[CMD]'), color(time, 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname), 'in', color(name || formattedTitle))

        // Anti-spam
        msgFilter.addFilter(from)

        switch (command) {
            // Register by Slavyan
            case 'registrar':
            case 'register':
                if (isRegistered) return await bocchi.reply(from, ind.registeredAlready(), id)
                if (!q.includes('/')) return await bocchi.reply(from, ind.wrongFormat(), id)
                const namaUser = q.substring(0, q.indexOf('/') - 1)
                const umurUser = q.substring(q.lastIndexOf('/') + 2)
                const serialUser = createSerial(20)
                if (isGroupMsg) {
                    register.addRegisteredUser(sender.id, namaUser, umurUser, time, serialUser, _registered)
                    await bocchi.reply(from, ind.pc(pushname), id)
                    await bocchi.sendText(sender.id, ind.registered(namaUser, umurUser, sender.id, time, serialUser))
                    console.log(color('[REGISTER]'), color(time, 'yellow'), 'Name:', color(namaUser, 'cyan'), 'Age:', color(umurUser, 'cyan'), 'Serial:', color(serialUser, 'cyan'), 'in', color(name || formattedTitle))
                } else {
                    register.addRegisteredUser(sender.id, namaUser, umurUser, time, serialUser, _registered)
                    await bocchi.reply(from, ind.registered(namaUser, umurUser, sender.id, time, serialUser), id)
                    console.log(color('[REGISTER]'), color(time, 'yellow'), 'Name:', color(namaUser, 'cyan'), 'Age:', color(umurUser, 'cyan'), 'Serial:', color(serialUser, 'cyan'))
                }
            break

            // Level [BETA] by Slavyan
            case 'level12312312312':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                if (!isLevelingOn) return await bocchi.reply(from, ind.levelingNotOn(), id)
                if (!isGroupMsg) return await bocchi.reply(from, ind.groupOnly(), id)
                const userLevel = level.getLevelingLevel(sender.id, _level)
                const userXp = level.getLevelingXp(sender.id, _level)
                if (userLevel === undefined && userXp === undefined) return await bocchi.reply(from, ind.levelNull(), id)
                const ppLink = await bocchi.getProfilePicFromServer(sender.id)
                if (ppLink === undefined) {
                    var pepe = errorImg
                } else {
                    var pepe = ppLink
                }
                const bege = card.getBg(sender.id, _bg)
                const requiredXp = 200 * (Math.pow(2, userLevel) - 1)
                const randomHexs = `#${(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0')}`
                const randomHex = `#${(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0')}`
                const rank = new canvas.Rank()
                    .setAvatar(pepe)
                    .setLevel(userLevel)
                    .setRank(1, '', false)
                    .setCurrentXP(userXp)
                    .setRequiredXP(requiredXp)
                    .setProgressBar([randomHexs, randomHex], 'GRADIENT')
                    .setBackground('IMAGE', bege)
                    .setUsername(pushname)
                    .setDiscriminator(sender.id.substring(6, 10))
                rank.build()
                    .then(async (buffer) => {
                        canvas.write(buffer, `${pushname}_card.png`)
                        await bocchi.sendFile(from, `${pushname}_card.png`, `${pushname}_card.png`, '', id)
                        fs.unlinkSync(`${pushname}_card.png`)
                    })
                    .catch(async (err) => {
                        console.error(err)
                        await bocchi.reply(from, 'Error!', id)
                    })
            break
            case 'leaderboard123123123':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                if (!isLevelingOn) return await bocchi.reply(from, ind.levelingNotOn(), id)
                if (!isGroupMsg) return await bocchi.reply(from. ind.groupOnly(), id)
                _level.sort((a, b) => (a.xp < b.xp) ? 1 : -1)
                let leaderboard = '-----[ *LEADERBOARD* ]----\n\n'
                let nom = 0
                try {
                    for (let i = 0; i < 10; i++) {
                        nom++
                        leaderboard += `${nom}. @${_level[i].id.replace('@c.us', '')}\n➸ XP: *${_level[i].xp}* Level: *${_level[i].level}*\n\n`
                    }
                    await bocchi.sendTextWithMentions(from, leaderboard)
                } catch (err) {
                    console.error(err)
                    await bocchi.reply(from, ind.minimalDb(), id)
                }
            break
            case 'setbackground123123123':
            case 'setbg12312312312':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                if (!isLevelingOn) return await bocchi.reply(from, ind.levelingNotOn(), id)
                if (!isGroupMsg) return await bocchi.reply(from, ind.groupOnly(), id)
                if (!isUrl(url)) return await bocchi.reply(from, ind.wrongFormat(), id)
                const levels = level.getLevelingLevel(sender.id, _level)
                const xps = level.getLevelingXp(sender.id, _level)
                if (levels === undefined && xps === undefined) return await bocchi.reply(from, ind.levelNull(), id)
                card.replaceBg(sender.id, url, _bg)
                await bocchi.reply(from, 'Success set new background!', id)
            break

            // Downloader
            case 'joox123123':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                if (!q) return await bocchi.reply(from, ind.wrongFormat(), id)
                await bocchi.reply(from, ind.wait(), id)
                downloader.joox(q)
                    .then(async ({ result }) => {
                        await bocchi.sendFileFromUrl(from, result[0].linkImg, `${result[0].judul}.jpg`, ind.joox(result), id)
                        await bocchi.sendFileFromUrl(from, result[0].linkMp3, `${result[0].judul}.mp3`, '', id)
                        console.log('Success sending music from Joox!')
                    })
                    .catch(async (err) => {
                        console.error(err)
                        await bocchi.reply(from, 'Error!', id)
                    })
            break
            case 'igdl123123': // by: VideFrelan
            case 'instadl123123':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                if (!isUrl(url) && !url.includes('instagram.com')) return await bocchi.reply(from, ind.wrongFormat(), id)
                await bocchi.reply(from, ind.wait(), id)
                downloader.insta(url)
                    .then(async ({ result }) => {
                        for (let i = 0; i < result.post.length; i++) {
                            if (result.post[i].type === "image") {
                                await bocchi.sendFileFromUrl(from, result.post[i].urlDownload, 'igpostdl.jpg', `*...:* *Instagram Downloader* *:...*\n\nUsername: ${result.owner_username}\nCaption: ${result.caption}`, id)
                            } else if (result.post[i].type === "video") {
                                await bocchi.sendFileFromUrl(from, result.post[i].urlDownload, 'igpostdl.mp4', `*...:* *Instagram Downloader* *:...*\n\nUsername: ${result.owner_username}\nCaption: ${result.caption}`, id)
                            }
                        }
                        console.log('Success sending Instagram media!')
                    })
                    .catch(async (err) => {
                        console.error(err)
                        await bocchi.reply(from, 'Error!', id)
                    })
            break
            case 'facebook123123123':
            case 'fb123123123':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(pushname), id)
                if (!isUrl(url) && !url.includes('facebook.com')) return await bocchi.reply(from, `URL bukan dari facebook!`, id)
                await bocchi.reply(from, ind.wait(), id)
                downloader.fb(q)
                .then(async ({ result }) => {
                            await bocchi.sendFileFromUrl(from, result.VideoUrl, 'videofb.mp4', '', id)
                            console.log(from, 'Success sending Facebook video!')
                    })
                    .catch(async (err) => {
                        console.error(err)
                        await bocchi.reply(from, `Ada yang Error!`, id)
                    })
            break
            case 'ytmp32123123':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                if (!isUrl(url) && !url.includes('youtu.be')) return await bocchi.reply(from, ind.wrongFormat(), id)
                await bocchi.reply(from, ind.wait(), id)
                downloader.ytdl(url)
                    .then(async (res) => {
                        if (res.status === 'error') {
                            await bocchi.reply(from, res.pesan, id)
                        } else if (Number(res.size.split(' MB')[0]) >= 30) {
                            await bocchi.reply(from, ind.videoLimit(), id)
                        } else {
                            await bocchi.sendFileFromUrl(from, res.thumbnail, `${res.title}.jpg`, ind.ytFound(res), id)
                            await bocchi.sendFileFromUrl(from, res.url_audio, `${res.title}.mp3`, '', id)
                            console.log('Success sending YouTube video!')
                        }
                    })
                    .catch(async (err) => {
                        console.error(err)
                        await bocchi.reply(from, 'Error!', id)
                    })
            break
            case '23123123ytmp4':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                if (!isUrl(url) && !url.includes('youtu.be')) return await bocchi.reply(from, ind.wrongFormat(), id)
                await bocchi.reply(from, ind.wait(), id)
                downloader.ytdl(url)
                    .then(async (res) => {
                        if (res.status === 'error') {
                            await bocchi.reply(from, res.pesan, id)
                        } else if (Number(res.size.split(' MB')[0]) >= 30) {
                            await bocchi.reply(from, ind.videoLimit(), id)
                        } else {
                            await bocchi.sendFileFromUrl(from, res.thumbnail, `${res.title}.jpg`, ind.ytFound(res), id)
                            await bocchi.sendFileFromUrl(from, res.url_video, `${res.title}.mp4`, '', id)
                            console.log('Success sending YouTube video!')
                        }
                    })
                    .catch(async (err) => {
                        console.error(err)
                        await bocchi.reply(from, 'Error!', id)
                    })
            break
            case 'perfiltik':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                if (args.length == 0) return bocchi.reply(from, `Para descargar el perfil de algun usuario de *TikTok* usa el comando *${prefix}perfiltik "Usuario"*\n\nEjemplo:\n*${prefix}perfiltik tiktok*`, id)
                if (!q) return await bocchi.reply(from, ind.wrongFormat(), id)
                await bocchi.reply(from, ind.wait(), id)
                try {
                    console.log(`Getting profile pic for ${q}`)
                    const tkt = await axios.get(`https://docs-jojo.herokuapp.com/api/tiktokpp?user=${q}`)
                    if (tkt.data.error) return bocchi.reply(from, tkt.data.error, id)
                    await bocchi.sendFileFromUrl(from, tkt.data.result, 'tiktokpic.jpg', 'TOMA :D', id)
                    console.log('Success sending TikTok profile pic!')
                } catch (err) {
                    console.error(err)
                    await bocchi.reply(from, 'Error!', id)
                }
            break
            case 'tiktokasdasdasdasd': 
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                if (!isUrl(url) && !url.includes('tiktok.com')) return await bocchi.reply(from, ind.wrongFormat(), id)
                await bocchi.reply(from, ind.wait(), id)
                downloader.tik(url)
                    .then(async ({ result })=> {
                        await bocchi.sendFileFromUrl(from, result.video, 'tiktok.mp4', '', id)
                    })
                    .catch(async (err) => {
                        console.log(err)
                        await bocchi.reply(from, 'Error!', id)
                    })
            break
            case 'tw':
            case 'twt':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                if (args.length == 0) return bocchi.reply(from, `Para descargar algun video de *Twitter* usa el comando: *${prefix}tw "enlace del video"*\n\nEjemplo:\n*${prefix}tw https://twitter.com/claudeponz/status/1347410310114627584*`, id)
                if (!isUrl(url) && !url.includes('twitter.com')) return await bocchi.reply(from, ind.wrongFormat(), id)
                await bocchi.reply(from, ind.wait(), id)
                downloader.tweet(url)
                    .then(async (data) => {
                        if (data.type === 'video') {
                            const content = data.variants.filter((x) => x.content_type !== 'application/x-mpegURL').sort((a, b) => b.bitrate - a.bitrate)
                            const result = await misc.shortener(content[0].url)
                            console.log('Shortlink:', result)
                            await bocchi.sendFileFromUrl(from, content[0].url, 'video.mp4', `Enlace Del Video HD: ${result}`, id)
                                .then(() => console.log('Success sending Twitter media!'))
                                .catch(async (err) => {
                                    console.error(err)
                                    await bocchi.reply(from, 'Error!', id)
                                })
                        } else if (data.type === 'photo') {
                            for (let i = 0; i < data.variants.length; i++) {
                                await bocchi.sendFileFromUrl(from, data.variants[i], data.variants[i].split('/media/')[1], '', id)
                                .then(() => console.log('Success sending Twitter media!'))
                                .catch(async (err) => {
                                    console.error(err)
                                    await bocchi.reply(from, 'Error!', id)
                                })
                            }
                        }
                    })
                    .catch(async (err) => {
                        console.error(err)
                        await bocchi.reply(from, 'Error!', id)
                    })
            break

            // Misc
            case 'repite':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                if (args.length == 0) return bocchi.reply(from, `Para hacer que *CoffeBOT* repita el mensaje que enviaste usa: *${prefix}repite "mensaje"*\n\nEjemplo: *${prefix}repite Buenos Días*`, id)
                if (!q) return await bocchi.reply(from, ind.wrongFormat(), id)
                await bocchi.sendText(from, q)
            break
            case 'afk':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                if (args.length == 0) return bocchi.reply(from, `Para poner el modo *AFK O FUERA DE SERVICIO* usa el comando *${prefix}afk "razón de inactividad"*\n\nEjemplo: *${prefix}afk Fregando Los Trastes*`, id)
                if (!isGroupMsg) return await bocchi.reply(from, ind.groupOnly(), id)
                if (isAfkOn) return await bocchi.reply(from, ind.afkOnAlready(), id)
                const reason = q ? q : 'Ninguna'
                afk.addAfkUser(sender.id, time, reason, _afk)
                await bocchi.reply(from, ind.afkOn(pushname, reason), id)
            break
            case 'lyric234234234':
            case 'lirik4234234234':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                if (!q) return await bocchi.reply(from, ind.wrongFormat(), id)
                await bocchi.reply(from, ind.wait(), id)
                misc.lirik(q)
                    .then(async ({ result }) => {
                        if (result.code !== 200) return await bocchi.reply(from, 'Not found.', id)
                        await bocchi.reply(from, result.result, id)
                        console.log('Success sending lyric!')
                    })
                    .catch(async (err) => {
                        console.error(err)
                        await bocchi.reply(from, 'Error!', id)
                    })
            break
            case 'enlacepeque':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                if (args.length == 0) return bocchi.reply(from, `Acorta tu enlace usando *${prefix}enlacepeque <Enlace que quieres acortar>* 🐾`, id)
                if (!isUrl(url)) return await bocchi.reply(from, ind.wrongFormat(), id)
                const urlShort = await misc.shortener(url)
                await bocchi.reply(from, ind.wait(), id)
                await bocchi.reply(from, urlShort, id)
                console.log('Success!')
            break
            case 'wikipedia12312312312':
            case 'wiki123123123123':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                if (!q) return await bocchi.reply(from, ind.wrongFormat(), id)
                await bocchi.reply(from, ind.wait(), id)
                misc.wiki(q)
                    .then(async ({ result, status }) => {
                        if (status !== 200) {
                            return await bocchi.reply(from, 'Not found.', id)
                        } else {
                            await bocchi.reply(from, result, id)
                                .then(() => console.log('Success sending Wiki!'))
                        }
                    })
                    .catch(async (err) => {
                        console.error(err)
                        await bocchi.reply(from, 'Error!', id)
                    })
            break
            case 'instastoryqweqweqwe': //By: VideFrelan
            case 'igstoryqweqwqweqwe':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                if (!q) return bocchi.reply(from, ind.wrongFormat(), id)
                await bocchi.reply(from, ind.wait(), id)
                misc.its(q)
                    .then(async ({ result }) => {
                        for (let i = 0; i < result.story.itemlist.length; i++) {
                            const { urlDownload } = result.story.itemlist[i]
                            await bocchi.sendFileFromUrl(from, urlDownload, '', 'By: VideFrelan', id)
                            console.log('Success sending IG Story!')
                        }
                    })
            break
            case 'kbbi123123123123':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                if (!q) return await bocchi.reply(from, ind.wrongFormat(), id)
                await bocchi.reply(from, ind.wait(), id)
                misc.kbbi(q)
                    .then(async ({ status, result, pesan }) => {
                        if (status === 'error') {
                            await bocchi.reply(from, pesan, id)
                        } else {
                            await bocchi.reply(from, result, id)
                                .then(() =>  console.log('Success sending definition!'))
                        }
                    })
                    .catch(async (err) => {
                        console.error(err)
                        await bocchi.reply(from, 'Error!', id)
                    })
            break
            case 'linesticker213123123':
            case 'linestiker123123123':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                await bocchi.reply(from, ind.wait(), id)
                misc.linesticker()
                    .then(async ({ result }) => {
                        let lines = `-----[ *NEW STICKER* ]-----`
                        for (let i = 0; i < result.hasil.length; i++) {
                            lines +=  `\n\n➸ *Title*: ${result.hasil[i].title}\n➸ *URL*: ${result.hasil[i].uri}\n\n=_=_=_=_=_=_=_=_=_=_=_=_=`
                        }
                        await bocchi.reply(from, lines, id)
                        console.log('Success sending sticker Line!')
                    })
                    .catch(async (err) => {
                        console.error(err)
                        await bocchi.reply(from, `Error!\n{err}`, id)
                    })
            break
            case 'jadwalsholat':
            case 'jadwalsolat':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                if (!q) return await bocchi.reply(from, ind.wrongFormat(), id)
                await bocchi.reply(from, ind.wait(), id)
                misc.jadwalSholat(q)
                    .then((data) => {
                        data.map(async ({isya, subuh, dzuhur, ashar, maghrib, terbit}) => {
                            const x  = subuh.split(':')
                            const y = terbit.split(':')
                            const xy = x[0] - y[0]
                            const yx = x[1] - y[1]
                            const perbandingan = `${xy < 0 ? Math.abs(xy) : xy} jam ${yx < 0 ? Math.abs(yx) : yx} menit`
                            const msg = `Jadwal sholat untuk ${q} dan sekitarnya ( *${tanggal}* )\n\nDzuhur: ${dzuhur}\nAshar: ${ashar}\nMaghrib: ${maghrib}\nIsya: ${isya}\nSubuh: ${subuh}\n\nDiperkirakan matahari akan terbit pada pukul ${terbit} dengan jeda dari subuh sekitar ${perbandingan}`
                            await bocchi.reply(from, msg, id)
                            console.log('Success sending jadwal sholat!')
                        })
                    })
                    .catch(async (err) => {
                        console.error(err)
                        await bocchi.reply(from, 'Error!', id)
                    })
            break
            case 'gempa34234234':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                await bocchi.reply(from, ind.wait(), id)
                misc.bmkg()
                    .then(async ({ kedalaman, koordinat, lokasi, magnitude, map, potensi, waktu }) => {
                        let teksInfo = `${lokasi}\n\nKoordinat: ${koordinat}\nKedalaman: ${kedalaman}\nMagnitudo: ${magnitude} SR\nPotensi: ${potensi}\n\n${waktu}`
                        await bocchi.sendFileFromUrl(from, map, 'gempa.jpg', teksInfo, id)
                            .then(() => console.log('Success sending info!'))
                    })
                    .catch(async (err) => {
                        console.error(err)
                        await bocchi.reply(from, 'Error!', id)
                    })
            break
            case 'igstalk123123123123':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                if (!q) return await bocchi.reply(from, ind.wrongFormat(), id)
                await bocchi.reply(from, ind.wait(), id)
                misc.igStalk(q)
                    .then(async ({ Biodata, Jumlah_Followers, Jumlah_Following, Jumlah_Post, Profile_pic, Username, status, error }) => {
                        if (status !== 200) {
                            return await bocchi.reply(from, error, id)
                        } else {
                            let igCaption = `${Biodata.split('\nby: ArugaZ').join('')}\n\nUsername: ${Username}\nFollowers: ${Jumlah_Followers}\nFollowing: ${Jumlah_Following}\nPost: ${Jumlah_Post}`
                            await bocchi.sendFileFromUrl(from, Profile_pic, `${Username}.jpg`, igCaption, null, null, true)
                                .then(() => console.log('Success sending Instagram info!'))
                        }
                    })
                    .catch(async (err) => {
                        console.error(err)
                        await bocchi.reply(from, 'Error!', id)
                    })
            break
            case 'gsmarena123123123':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                if (!q) return await bocchi.reply(from, ind.wrongFormat(), id)
                await bocchi.reply(from, ind.wait(), id)
                try {
                    misc.gsmarena(q)
                        .then(async ({ result }) => {
                            await bocchi.sendFileFromUrl(from, result.image, `${result.title}.jpg`, ind.gsm(result), id)
                                .then(() => console.log('Success sending phone info!'))
                        })
                } catch (err) {
                    console.error(err)
                    await bocchi.reply(from, 'Error!', id)
                }
            break
            case 'receipt123123':
            case 'resep12312312':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                if (!q) return await bocchi.reply(from, ind.wrongFormat(), id)
                await bocchi.reply(from, ind.wait(), id)
                try {
                    misc.resep(q)
                        .then(async ({ result }) => {
                            await bocchi.sendFileFromUrl(from, result.image, `${result.title}.jpg`, ind.receipt(result), id)
                                .then(() => console.log('Success sending food receipt!'))
                        })
                } catch (err) {
                    console.error(err)
                    await bocchi.reply(from, 'Error!', id)
                }
            break
            case 'findsticker1231231':
            case 'findstiker123123123':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                if (!q) return await bocchi.reply(from, ind.wrongFormat(), id)
                await bocchi.reply(from, ind.wait(), id)
                try {
                    misc.sticker(q)
                        .then(async ({ result }) => {
                            if (result.response !== 200) return await bocchi.reply(from, 'Not found!', id)
                            for (let i = 0; i < result.data.length; i++) {
                                await bocchi.sendStickerfromUrl(from, result.data[i])
                            }
                            console.log('Success sending sticker!')
                        })
                } catch (err) {
                    console.error(err)
                    await bocchi.reply(from, `Error!\n\n${err}`, id)
                }
            break
            case 'movie1111112222222357':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                if (!q) return await bocchi.reply(from, ind.wrongFormat(), id)
                await bocchi.reply(from, ind.wait(), id)
                misc.movie(q)
                    .then(async ({ result }) => {
                        let movies = `Result for: *${result.judul}*`
                        for (let i = 0; i < result.data.length; i++) {
                            movies +=  `\n\n➸ *Quality:* : ${result.data[i].resolusi}\n➸ *URL*: ${result.data[i].urlDownload}\n\n=_=_=_=_=_=_=_=_=_=_=_=_=`
                        }
                        movies += '\n\nBy: VideFrelan'
                        await bocchi.reply(from, movies, id)
                        console.log('Success sending movie result!')
                    })
                    .catch(async (err) => {
                        console.error(err)
                        await bocchi.reply(from, 'Error!', id)
                    })
            break
            case 'cekongkir3423423': // By: VideFrelan
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                if (!q) return await bocchi.reply(from, ind.wrongFormat(), id)
                await bocchi.reply(from, ind.wait(), id)
                const kurir = q.substring(0, q.indexOf('|') - 1)
                const askot = q.substring(q.indexOf('|') + 2, q.lastIndexOf('|') - 1)
                const tukot = q.substring(q.lastIndexOf('|') + 2)
                misc.ongkir(kurir, askot, tukot)
                    .then(async ({ result }) => {
                        let onkir = `-----[ *${result.title}* ]-----`
                        for (let i = 0; i < result.data.length; i++) {
                            onkir +=  `\n\n➸ *Layanan*: ${result.data[i].layanan}\n➸ *Estimasi*: ${result.data[i].etd}\n➸ *Tarif*: ${result.data[i].tarif}\n➸ *Info*: ${result.informasi}\n\n=_=_=_=_=_=_=_=_=_=_=_=_=`
                        }
                        onkir += '\n\nBy: VideFrelan'
                        await bocchi.reply(from, onkir, id)
                        console.log('Success sending ongkir info!')
                    })
                    .catch(async (err) => {
                        console.error(err)
                        await bocchi.reply(from, 'Error!', id)
                    })
            break
            case 'distance213123123':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                if (!q) return await bocchi.reply(from, ind.wrongFormat(), id)
                const kotaAsal = q.substring(0, q.indexOf('|') - 1)
                const kotaTujuan = q.substring(q.lastIndexOf('|') + 2)
                misc.distance(kotaAsal, kotaTujuan)
                    .then(async ({ result }) => {
                        if (result.response !== 200) {
                            await bocchi.reply(from, 'Error!', id)
                        } else {
                            await bocchi.reply(from, result.data, id)
                            console.log('Success sending distance info!')
                        }
                    })
            break
            case 'ytsearch12312312':
            case 'yts123123123':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                if (!q) return await bocchi.reply(from, ind.wrongFormat(), id)
                await bocchi.reply(from, ind.wait(), id)
                try {
                    misc.ytSearch(q)
                        .then(async ({ result }) => {
                            for (let i = 0; i < 5; i++) {
                                const { urlyt, image, title, channel, duration, views } = await result[i]
                                await bocchi.sendFileFromUrl(from, image, `${title}.jpg`, ind.ytResult(urlyt, title, channel, duration, views), id)
                                console.log('Success sending YouTube results!')
                            }
                        })
                } catch (err) {
                    console.error(err)
                    await bocchi.reply(from, 'Error!', id)
                }
            break
            case 'voz':
            case 'tts123123123':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                if (args.length == 0) return bocchi.reply(from, `Convierte tu texto en sonido (voz del traductor de Google)\nusa: *${prefix}voz* es (es : español) (tu texto) 🗣️\nejemplo : *${prefix}voz es Hola como estas 🗣️*`, id)
                if (!q) return await bocchi.reply(from, ind.wrongFormat(), id)
                const speech = q.substring(q.indexOf('') + 2)
                const ptt = tts(ar[0])
                try {
                    ptt.save(`${speech}.mp3`, speech, async () => {
                        await bocchi.sendPtt(from, `${speech}.mp3`, id)
                        fs.unlinkSync(`${speech}.mp3`)
                    })
                } catch (err) {
                    console.error(err)
                    await bocchi.reply(from, 'Error!', id)
                }
            break
            case 'playstore123123123':
            case 'ps123123123':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                if (!q) return await bocchi.reply(from, ind.wrongFormat(), id)
                await bocchi.reply(from, ind.wait(), id)
                try {
                    misc.playstore(q)
                        .then(async ({ result }) => {
                            for (let i = 0; i < 5; i++) {
                                const { app_id, icon, title, developer, description, price, free } = result[i]
                                await bocchi.sendFileFromUrl(from, icon, `${title}.jpg`, ind.playstore(app_id, title, developer, description, price, free))
                            }
                            console.log('Success sending PlayStore result!')
                        })
                } catch (err) {
                    console.error(err)
                    await bocchi.reply(from, `Error!\n\n${err}`, id)
                }
            break
            case 'mate':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                if (args.length == 0) return bocchi.reply(from, `Para resolver operaciones de matemática solo usa el comando *${prefix}mate "OPERACION"*\n\nEjemplo: *${prefix}mate 10+10*\n\nAquí estan las variantes que se pueden usar:\n+ = *Suma*\n- = *Resta*\n* = *Multiplicación*\n/ = *División*`, id)
                if (!q) return await bocchi.reply(from, ind.wrongFormat(), id)
                if (typeof mathjs.evaluate(q) !== "number") {
                    await bocchi.reply(from, ind.notNum(q), id)
                } else {
                    await bocchi.reply(from, `*🧮-- [ MATEMÁTICA ] --🧮*\n\n*${q}*\n\nRESULTADO: *${mathjs.evaluate(q)} 🧮*`, id)
                }
            break
            case 'shopee123123123':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                if (!q) return await bocchi.reply(from, ind.wrongFormat(), id)
                const namaBarang = q.substring(0, q.indexOf('|') - 1)
                const jumlahBarang = q.substring(q.lastIndexOf('|') + 2)
                await bocchi.reply(from, ind.wait(), id)
                try {
                    misc.shopee(namaBarang, jumlahBarang)
                        .then(async ({ result }) => {
                            for (let i = 0; i < result.items.length; i++) {
                                const { nama, harga, terjual, shop_location, description, link_product, image_cover } = result.items[i]
                                await bocchi.sendFileFromUrl(from, image_cover, `${nama}.jpg`, ind.shopee(nama, harga, terjual, shop_location, description, link_product))
                            }
                            console.log('Success sending Shopee data!')
                        })
                } catch (err) {
                    console.error(err)
                    await bocchi.reply(from, `Error!\n\n${err}`, id)
                }
            break
            case 'socio21231231':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                if (isGroupMsg) return await bocchi.reply(from, 'Command ini tidak bisa digunakan di dalam grup!', id)
                await bocchi.reply(from, 'Looking for a partner...', id)
                await bocchi.sendContact(from, register.getRegisteredRandomId(_registered))
                await bocchi.sendText(from, `Partner found: 🙉\n*${prefix}next* — find a new partner`)
            break
            case 'next234234234':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                if (isGroupMsg) return await bocchi.reply(from, 'Command ini tidak bisa digunakan di dalam grup!', id)
                await bocchi.reply(from, 'Looking for a partner...', id)
                await bocchi.sendContact(from, register.getRegisteredRandomId(_registered))
                await bocchi.sendText(from, `Partner found: 🙉\n*${prefix}next* — find a new partner`)
            break
            case 'tafsir234234234':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                if (args.length === 0) return bocchi.reply(from, `Untuk menampilkan ayat Al-Qur'an tertentu beserta tafsir dan terjemahannya\ngunakan ${prefix}tafsir surah ayat\n\nContoh: ${prefix}tafsir Al-Mulk 10`, id)
                await bocchi.reply(from, ind.wait(), id)
                const responSurah = await axios.get('https://raw.githubusercontent.com/VideFrelan/words/main/tafsir.txt')
                const { data } = responSurah.data
                const idx = data.findIndex((post) => {
                    if ((post.name.transliteration.id.toLowerCase() === args[0].toLowerCase()) || (post.name.transliteration.en.toLowerCase() === args[0].toLowerCase())) return true
                })
                const nomerSurah = data[idx].number
                if (!isNaN(nomerSurah)) {
                    const responseh = await axios.get('https://api.quran.sutanlab.id/surah/'+ nomerSurah + '/'+ args[1])
                    const { data } = responseh.data
                    let pesan = ''
                    pesan += 'Tafsir Q.S. ' + data.surah.name.transliteration.id + ':' + args[1] + '\n\n'
                    pesan += data.text.arab + '\n\n'
                    pesan += '_' + data.translation.id + '_\n\n' + data.tafsir.id.long
                    await bocchi.reply(from, pesan, id)
                }
            break
            case 'listsurah123123123':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                await bocchi.reply(from, ind.wait(), id)
                misc.listSurah()
                    .then(async ({ result }) => {
                        let list = '-----[ AL-QUR\'AN LIST ]-----\n\n'
                        for (let i = 0; i < result.list.length; i++) {
                            list += `${result.list[i]}\n\n`
                        }
                        await bocchi.reply(from, list, id)
                        console.log('Success sending Al-Qur\'an list!')
                    })
                    .catch(async (err) => {
                        console.error(err)
                        await bocchi.reply(from, 'Error!', id)
                    })
            break
            case 'sura123123123h':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                if (args.length !== 1) return await bocchi.reply(from, ind.wrongFormat(), id)
                await bocchi.reply(from, ind.wait(), id)
                misc.getSurah(args[0])
                    .then(async ({ result }) => {
                        await bocchi.reply(from, `${result.surah}\n\n${result.quran}`, id)
                        console.log('Success sending surah!')
                    })
                    .catch(async (err) => {
                        console.error(err)
                        await bocchi.reply(from, 'Error!', id)
                    })
            break
            case 'motivasi':
            case 'motivacion':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                misc.motivasi()
                    .then(async (body) => {
                        const motivasiSplit = body.split('\n')
                        const randomMotivasi = motivasiSplit[Math.floor(Math.random() * motivasiSplit.length)]
                        await bocchi.sendText(from, randomMotivasi)
                    })
                    .catch(async (err) => {
                        console.error(err)
                        await bocchi.reply(from, 'Error!', id)
                    })
            break	
            case 'play123123123':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                if (!q) return await bocchi.reply(from, ind.wrongFormat(), id)
                await bocchi.reply(from, ind.wait(), id)
                misc.ytPlay(q)
                    .then(async ({ result }) => {
                        if (Number(result.size.split(' MB')[0]) >= 10.00) return bocchi.sendFileFromUrl(from, result.image, `${result.title}.jpg`, `Judul: ${result.title}\nSize: *${result.size}*\n\nGagal, Maksimal video size adalah *10MB*!`, id)
                        await bocchi.sendFileFromUrl(from, result.image, `${result.title}.jpg`, ind.ytPlay(result), id)
                        await bocchi.sendFileFromUrl(from, result.mp3, `${result.title}.mp3`, '', id)
                    })
                    .catch(async (err) => {
                        console.error(err)
                        await bocchi.reply(from, 'Error!', id)
                    })
            break
            case 'whois123123123':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                if (args.length !== 1) return await bocchi.reply(from, ind.wrongFormat(), id)
                await bocchi.reply(from, ind.wait(), id)
                misc.whois(args[0])
                    .then(async ({ result }) => {
                        await bocchi.reply(from, `*「 WHOIS 」*\n\n➸ *IP address*: ${result.ip_address}\n➸ *City*: ${result.city}\n➸ *Region*: ${result.region}\n➸ *Country*: ${result.country}\n➸ *ZIP code*: ${result.postal_code}\n➸ *Latitude and longitude*: ${result.latitude_longitude}\n➸ *Time zone*: ${result.time_zone}\n➸ *Call code*: ${result.calling_code}\n➸ *Currency*: ${result.currency}\n➸ *Language code*: ${result.languages}\n➸ *ASN*: ${result.asn}\n➸ *Organization*: ${result.org}`, id)
                    })
                    .catch(async (err) => {
                        console.error(err)
                        await bocchi.reply(from, 'Error!', id)
                    })
            break
            case 'sms123123123':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                if (!q.includes('|')) return await bocchi.reply(from, ind.wrongFormat(), id)
                const pesanPengirim = q.substring(0, q.indexOf('|') - 1)
                const nomorPenerima = q.substring(q.lastIndexOf('|') + 2)
                await bocchi.reply(from, ind.wait(), id)
                misc.sms(nomorPenerima, pesanPengirim)
                    .then(async ({ status, pesan }) => {
                        if (status !== 'success') return await bocchi.reply(from, pesan, id)
                        await bocchi.reply(from, `Success sending SMS to: ${nomorPenerima}\nMessage: ${pesanPengirim}`, id)
                        console.log(`Success sending SMS to ${nomorPenerima}!`)
                    })
                    .catch(async (err) => {
                        console.error(err)
                        await bocchi.reply(from, 'Error!', id)
                    })
            break
            case 'toxic11111111111111':
                if (!isRegistered) return await bocchi.reply(from , ind.notRegistered(), id)
                await bocchi.reply(from, toxic(), id)
            break
            case 'alkitab1231231':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                if (!q) return await bocchi.reply(from, ind.wrongFormat(), id)
                await bocchi.reply(from, ind.wait(), id)
                misc.alkitab(q)
                    .then(async ({ result }) => {
                        let alkitab = `-----[ *AL-KITAB* ]-----`
                        for (let i = 0; i < result.length; i++) {
                            alkitab +=  `\n\n➸ *Ayat*: ${result[i].ayat}\n➸ *Isi*: ${result[i].isi}\n➸ *Link*: ${result[i].link}\n\n=_=_=_=_=_=_=_=_=_=_=_=_=`
                        }
                        await bocchi.reply(from, alkitab, id)
                        console.log('Success sending Al-Kitab!')
                    })
            break
            case 'recordatorio':
            case 'reminder': // by Slavyan
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                if (args.length == 0) return bocchi.reply(from, `Para crear un recordatorio usa el comando *${prefix}recordatorio "tiempo" | "Mensaje"*\n\nEjemplo: *${prefix}recordatorio 10m | Jugar Futbol*\n\nLas variantes del tiempo disponible son:\n\n*s* - segundos\n*m* - minuto\n*h* - hora\n*d* - día\n\nUna vez que el tiempo pasé *CoffeBOT* te dara un aviso junto a una mención de tu recordatorio.`, id)
                if (!q.includes('|')) return await bocchi.reply(from, ind.wrongFormat(), id)
                const timeRemind = q.substring(0, q.indexOf('|') - 1)
                const messRemind = q.substring(q.lastIndexOf('|') + 2)
                const parsedTime = ms(toMs(timeRemind))
                reminder.addReminder(sender.id, messRemind, timeRemind, _reminder)
                await bocchi.sendTextWithMentions(from, `*「 RECORDATORIO 」*\n\n*¡Recordatorio activado!*\n\n➸ *Mensaje*: ${messRemind}\n➸ *Duración*: ${parsedTime.hours} horas ${parsedTime.minutes} minutos ${parsedTime.seconds} segundos\n➸ *usuario*: @${sender.id.replace('@c.us', '')}`, id)
                const intervRemind = setInterval(async () => {
                    if (Date.now() > reminder.getReminderTime(sender.id, _reminder)) {
                        await bocchi.sendTextWithMentions(from, `⏰ *「 RECORDATORIO 」* ⏰\n\nFinalmente a tiempo @${sender.id.replace('@c.us', '')}\n\n➸ *Mensaje*: ${reminder.getReminderMsg(sender.id, _reminder)}`)
                        _reminder.splice(reminder.getReminderPosition(sender.id, _reminder), 1)
                        fs.writeFileSync('./database/user/reminder.json', JSON.stringify(_reminder))
                        clearInterval(intervRemind)
                    }
                }, 1000)
            break
            case 'imagenlink':
            case 'imgtourl':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                if (isMedia && isImage || isQuotedImage) {
                    await bocchi.reply(from, ind.wait(), id)
                    const encryptMedia = isQuotedImage ? quotedMsg : message
                    const mediaData = await decryptMedia(encryptMedia, uaOverride)
                    const linkImg = await uploadImages(mediaData, `${sender.id}_img`)
                    await bocchi.reply(from, linkImg, id)
                } else {
                    await bocchi.reply(from, ind.wrongFormat(), id)
                }
            break

            // Bot
            case 'menudescarga':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                await bocchi.sendText(from, ind.menuDescarga())
            break
            case 'menubot':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                await bocchi.sendText(from, ind.menuBot1())
            break
            case 'menumix':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                await bocchi.sendText(from, ind.menuMisc1())
            break
            case 'menusticker':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                await bocchi.sendText(from, ind.menuSticker1())
            break
            case 'menuanime':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                await bocchi.sendText(from, ind.menuAnime1())
            break
            case 'menuotaku':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                await bocchi.sendText(from, ind.menuNsfw1())
                .then(() => ((isGroupMsg)) ? bocchi.sendText(from, `Para usar este menu algun administrador debe activarlo usando el comando: *${prefix}otaku activar*`) : null)
            break
            case 'santo':
                if (!isOwner) return await bocchi.reply(from, ind.ownerOnly(), id)
                await bocchi.sendText(from, ind.menuOwner1())
            break
            case 'menu':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                    await bocchi.sendText(from, ind.menu())
                    .then(() => ((isGroupMsg) && (isGroupAdmins)) ? bocchi.sendText(from, `Para ver el menú de administradores usa: *${prefix}menuadmin* ✨👑`) : null)
            break
            case 'menuadmin':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                if (!isGroupMsg) return await bocchi.reply(from, ind.groupOnly(), id)
                if (!isGroupAdmins) return await bocchi.reply(from, ind.adminOnly(), id)
                await bocchi.sendText(from, ind.menuAdmin())
            break
            case 'reglas':
            case 'rule':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                await bocchi.sendText(from, ind.rules())
            break
            case 'otaku':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                if (!isGroupMsg) return await bocchi.reply(from, ind.groupOnly(), id)
                if (!isGroupAdmins) return await bocchi.reply(from, ind.adminOnly(), id)
                if (args.length == 0) return bocchi.reply(from, `Para activar el menu *OTAKU* en el grupo usa el comando *${prefix}otaku activar*\n\nPara apagar el menu usa el comando *${prefix}otaku apagar*`, id)
                if (ar[0] === 'activar') {
                    if (isNsfw) return await bocchi.reply(from, ind.nsfwAlready(), id)
                    _nsfw.push(groupId)
                    fs.writeFileSync('./database/group/nsfw.json', JSON.stringify(_nsfw))
                    await bocchi.reply(from, ind.nsfwOn(), id)
                } else if (ar[0] === 'apagar') {
                    _nsfw.splice(groupId, 1)
                    fs.writeFileSync('./database/group/nsfw.json', JSON.stringify(_nsfw))
                    await bocchi.reply(from, ind.nsfwOff(), id)
                } else {
                    await bocchi.reply(from, ind.wrongFormat(), id)
                }
            break
            case 'pc':
                if (!isOwner) return await bocchi.reply(from, ind.ownerOnly(), id)
                await bocchi.sendText(from, `*RAM*: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB / ${Math.round(os.totalmem / 1024 / 1024)} MB\n*CPU*: ${os.cpus()[0].model}`)
            break
            case 'sanciones':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                if (!isGroupMsg) return await bocchi.reply(from, ind.groupOnly(), id)
                if (!isGroupAdmins) return await bocchi.reply(from, ind.adminOnly(), id)
                let block = ind.listBlock(blockNumber)
                for (let i of blockNumber) {
                    block += `@${i.replace('@c.us', '\n')}\n`
                }
                await bocchi.sendTextWithMentions(from, block)
            break
            case 'creador':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                await bocchi.sendContact(from, ownerNumber)
                .then(() => bocchi.sendText(from, 'Escribeme a mi numero personal, para reportar algun error o para pedir ayuda sobre *CoffeBOT.*'))
            break
            case 'velocidad':
            case 'v':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                await bocchi.sendText(from, `Velocidad de respuesta entre *CoffeBOT y Usted*!\n\n*Velocidad:* ${processTime(t, moment())} segundos`)
            break
            case 'del':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                if (!isGroupMsg) return await bocchi.reply(from, ind.groupOnly(), id)
                if (!isGroupAdmins) return await bocchi.reply(from, ind.adminOnly(), id)
                if (!quotedMsg) return await bocchi.reply(from, ind.wrongFormat(), id)
                if (!quotedMsgObj.fromMe) return await bocchi.reply(from, ind.wrongFormat(), id)
                await bocchi.deleteMessage(quotedMsgObj.chatId, quotedMsgObj.id, false)
            break
            case 'reportar':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                if (!q) return await bocchi.reply(from, ind.emptyMess(), id)
                    if (isGroupMsg) {
                        await bocchi.sendText(ownerNumber, `*👨🏻‍⚖---[ REPORTE ]---👨🏻‍⚖*\n\n*Usuario*: ${pushname}\n*ID*: ${sender.id}\n*Grupo*: ${(name || formattedTitle)}\n*Razón*: ${q}`)
                        await bocchi.reply(from, ind.received(pushname), id)
                    } else {
                        await bocchi.sendText(ownerNumber, `*👨🏻‍⚖---[ REPORTE ]---👨🏻‍⚖*\n\n*Usuario*: ${pushname}\n*ID*: ${sender.id}\n*Razón*: ${q}`)
                        await bocchi.reply(from, ind.received(pushname), id)
                }
            break
            case 'info':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                bocchi.sendFile(from, './yoga.jpg', '', '*Términos y condiciones de CoffeBOT*\n\nEl codigo fuente de *CoffeBOT* es un programa de código abierto *(gratuito)* escrito con *JavaScript*\n\n*Puede usar, copiar, modificar, combinar, publicar, distribuir, sublicenciar o vender copias sin eliminar el autor principal del código fuente de CoffeBOT.*\n\nAl usar el código fuente de CoffeBOT, acepta los siguientes términos y condiciones:\n\n*• sexo / trata de personas*\n*• juegos de azar*\n*• comportamiento adictivo dañino*\n*• crimen*\n*• violencia (A MENOS QUE SEA NECESARIA PARA PROTEGER LA SEGURIDAD PÚBLICA)*\n*• quema de bosques / deforestación*\n*• discurso de odio o discriminación por motivos de edad, sexo, identidad de género, raza, sexualidad, religión, nacionalidad.*\n\n*Es un simple BOT de whatsapp creado sin fines de lucro, no se busca ganar ni recibir nada por el uso del mismo...*\n\n\n*Santo® Todos los derechos reservados.*', id)
            break
            case 'toxica23123123':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                await bocchi.sendLinkWithAutoPreview(from, 'https://github.com/SlavyanDesu/BocchiBot', ind.tos(ownerNumber))
            break
            case 'entrar':
            case 'joinasdasdas':
                if (!isOwner) return bocchi.reply(from, '*✋🏽 Acceso Denegado 🛑*\n\nSi deseas invitar a el bot a tu grupo contacta con el creador usando el comando *.creador*', id)
                if (!isUrl(url) && !url.includes('chat.whatsapp.com')) return await bocchi.reply(from, `Para entrar a un grupo usar el comando *.entrar* Enlace De Grupo`, id)
                const checkInvite = await bocchi.inviteInfo(url)
                if (isOwner) {
                    await bocchi.joinGroupViaLink(url)
                    await bocchi.reply(from, ind.ok(), id)
                    await bocchi.sendText(checkInvite.id, `Buenas yo soy *CoffeBOT* ✨\n\nsoy un pequeño *BOT* creado y programado usando como base el lenguaje de programación *JavaScript.*\n\nPara ver todas las opciones que tengo usen el comando: *${prefix}menu*`)
                } else {
                    const getGroupData = await bocchi.getAllGroups()
                    if (getGroupData.length >= group
) {
                        await bocchi.reply(from, `Invite refused. Max group is: ${groupLimit}`, id)
                    } else if (getGroupData.size <= memberLimit) {
                        await bocchi.reply(from, `Invite refused. Minimum member is: ${memberLimit}`, id)
                    } else {
                        await bocchi.joinGroupViaLink(url)
                        await bocchi.reply(from, ind.ok(), id)
                        await bocchi.sendText(checkInvite.id, `Buenas yo soy *CoffeBOT* ✨\n\nsoy un pequeño *BOT* creado y programado usando como base el lenguaje de programación *JavaScript.*\n\nPara ver todas las opciones que tengo usen el comando: *${prefix}menu*`)
                    }
                }
            break
            case 'ipremium':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                if (!isPremium) return await bocchi.reply(from, ind.notPremium(), id)
                const cekExp = ms(premium.getPremiumExpired(sender.id, _premium) - Date.now())
                await bocchi.reply(from, `「 *PREMIUM EXPIRE* 」\n\n➸ *ID*: ${sender.id}\n➸ *Premium left*: ${cekExp.days} day(s) ${cekExp.hours} hour(s) ${cekExp.minutes} minute(s)`, id)
            break
            case 'verperfil':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                if (args.length == 0) return bocchi.reply(from, `Para ver el perfil de un usuario que lo tenga publico usa el comando: *${prefix}verperfil "@usuario"*\n\nTambien puedes hacerlo poniendo su número de telefono mas el código postal.\n\nejemplo: *${prefix}verpefil 50766666666*`, id)
                if (mentionedJidList.length !== 0) {
                    const userPic = await bocchi.getProfilePicFromServer(mentionedJidList[0])
                    if (userPic === undefined) {
                        pek = errorImg
                    } else {
                        pek = userPic
                    }
                    await bocchi.sendFileFromUrl(from, pek, 'pic.jpg', '', id)
                } else if (args.length !== 0) {
                    const userPic = await bocchi.getProfilePicFromServer(args[0] + '@c.us')
                    if (userPic === undefined) {
                        peks = errorImg
                    } else {
                        peks = userPic
                    }
                    await bocchi.sendFileFromUrl(from, peks, 'pic.jpg', '', id)
                } else {
                    await bocchi.reply(from, ind.wrongFormat(), id)
                }
            break

            // Weeb zone
            case 'neko':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                await bocchi.reply(from, ind.wait(), id)
                console.log('Getting neko image...')
                await bocchi.sendFileFromUrl(from, (await neko.sfw.neko()).url, 'neko.jpg', '', null, null, true)
                    .then(() => console.log('Success sending neko image!'))
                    .catch(async (err) => {
                        console.error(err)
                        await bocchi.reply(from, 'Error!', id)
                    })
            break 
            case 'wallpaper':
            case 'wp':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                await bocchi.reply(from, ind.wait(), id)
                console.log('Getting wallpaper image...')
                await bocchi.sendFileFromUrl(from, (await neko.sfw.wallpaper()).url, 'wallpaper.jpg', '', null, null, true)
                    .then(() => console.log('Success sending wallpaper image!'))
                    .catch(async (err) => {
                        console.error(err)
                        await bocchi.reply(from, 'Error!', id )
                    })
            break
            case 'kemono':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                await bocchi.reply(from, ind.wait(), id)
                console.log('Getting kemonomimi image...')
                await bocchi.sendFileFromUrl(from, (await neko.sfw.kemonomimi()).url, 'kemono.jpg', '', null, null, true)
                    .then(() => console.log('Success sending kemonomimi image!'))
                    .catch(async (err) => {
                        console.error(err)
                        await bocchi.reply(from, 'Error!', id)
                    })
            break
            case 'banime':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                if (!q) return await bocchi.reply(from, ind.wrongFormat(), id)
                await bocchi.reply(from, ind.wait(), id)
                weeaboo.anime(q)
                    .then(async ({ info, link_dl, sinopsis, thumb, title, error, status }) => {
                        if (status === false) {
                            return await bocchi.reply(from, error, id)
                        } else {
                            let animek = `${title}\n\n${info}\n\nSinopsis: ${sinopsis}\n\nEnlace De Descarga:\n${link_dl}`
                            await bocchi.sendFileFromUrl(from, thumb, 'animek.jpg', animek, null, null, true)
                                .then(() => console.log('Success sending anime info!'))
                        }
                    })
                    .catch(async (err) => {
                        console.error(err)
                        await bocchi.reply(from, 'Error!', id)
                    })
            break
            case 'komikuasdasdasda':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                if (!q) return await bocchi.reply(from, ind.wrongFormat(), id)
                await bocchi.reply(from, ind.wait(), id)
                weeaboo.manga(q)
                    .then(async ({ genre, info, link_dl, sinopsis, thumb }) => {
                        let mangak = `${info}${genre}\nSinopsis: ${sinopsis}\nLink download:\n${link_dl}`
                        await bocchi.sendFileFromUrl(from, thumb, 'mangak.jpg', mangak, null, null, true)
                            .then(() => console.log('Success sending manga info!'))
                    })
                    .catch(async (err) => {
                        console.error(err)
                        await bocchi.reply(from, 'Error!', id)
                    })
            break
            case 'banime143234234234':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                if (isMedia && isImage || isQuotedImage) {
                    await bocchi.reply(from, ind.wait(), id)
                    const encryptMedia = isQuotedImage ? quotedMsg : message
                    const _mimetype = isQuotedImage ? quotedMsg.mimetype : mimetype
                    const mediaData = await decryptMedia(encryptMedia, uaOverride)
                    const imageBase64 = `data:${_mimetype};base64,${mediaData.toString('base64')}`
                    weeaboo.wait(imageBase64)
                        .then(async (result) => {
                            if (result.docs && result.docs.length <= 0) {
                                return await bocchi.reply(from, 'Anime not found! :(', id)
                            } else {
                                const { title, title_romaji, title_english, episode, similarity, filename, at, tokenthumb, anilist_id } = result.docs[0]
                                let teks = ''
                                if (similarity < 0.92) {
                                    teks = 'Low similarity. 🤔\n\n'
                                } else {
                                    teks += `*Title*: ${title}\n*Romaji*: ${title_romaji}\n*English*: ${title_english}\n*Episode*: ${episode}\n*Similarity*: ${(similarity * 100).toFixed(1)}%`
                                    const video = `https://media.trace.moe/video/${anilist_id}/${encodeURIComponent(filename)}?t=${at}&token=${tokenthumb}`
                                    await bocchi.sendFileFromUrl(from, video, `${title_romaji}.mp4`, teks, id)
                                        .then(() => console.log('Success sending anime source!'))
                                }
                            }
                        })
                        .catch(async (err) => {
                            console.error(err)
                            await bocchi.reply(from, 'Error!', id)
                        })
                } else {
                    await bocchi.reply(from, ind.wrongFormat(), id)
                }
            break
            case 'source':
            case 'sauce':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                if (isMedia && isImage || isQuotedImage) {
                    await bocchi.reply(from, ind.wait(), id)
                    const encryptMedia = isQuotedImage ? quotedMsg : message
                    const mediaData = await decryptMedia(encryptMedia, uaOverride)
                    try {
                        const imageLink = await uploadImages(mediaData, `sauce.${sender.id}`)
                        console.log('Searching for source...')
                        const results = await saus(imageLink)
                        for (let i = 0; i < results.length; i++) {
                            let teks = ''
                            if (results[i].similarity < 80.00) {
                                teks = 'Low similarity. 🤔\n\n'
                            } else {
                                teks += `*Link*: ${results[i].url}\n*Site*: ${results[i].site}\n*Author name*: ${results[i].authorName}\n*Author link*: ${results[i].authorUrl}\n*Similarity*: ${results[i].similarity}%`
                                await bocchi.sendLinkWithAutoPreview(from, results[i].url, teks)
                                    .then(() => console.log('Source found!'))
                            }
                        }
                    } catch (err) {
                        console.error(err)
                        await bocchi.reply(from, 'Error!', id)
                    }
                } else {
                    await bocchi.reply(from, ind.wrongFormat(), id)
                }
            break
            case 'waifu':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                await bocchi.reply(from, ind.wait(), id)
                weeaboo.waifu(false)
                    .then(async ({ url }) => {
                        await bocchi.sendFileFromUrl(from, url, 'waifu.png', '', id)
                            .then(() => console.log('Success sending waifu!'))
                    })
                    .catch(async (err) => {
                        console.error(err)
                        await bocchi.reply(from, 'Error!', id)
                    })
            break
            case 'anitoki234234234':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                await bocchi.reply(from, ind.wait(), id)
                weeaboo.anitoki()
                    .then(async ({ result }) => {
                        let anitoki = `-----[ *ANITOKI LATEST* ]-----`
                        for (let i = 0; i < result.length; i++) {
                            anitoki += `\n\n➸ *Title*: ${result[i].title}\n➸ *URL*: ${result[i].link}\n\n=_=_=_=_=_=_=_=_=_=_=_=_=`
                        }
                        await bocchi.reply(from, anitoki, id)
                    })
                    .catch(async (err) => {
                        console.error(err)
                        await bocchi.reply(from, 'Error!', id)
                    })
            break
            case 'neonime234234234':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                await bocchi.reply(from, ind.wait(), id)
                weeaboo.neonime()
                    .then(async ({ status, result }) => {
                        if (status !== 200) return await bocchi.reply(from, `Not found.`, id)
                        let neoInfo = '-----[ *NEONIME LATEST* ]-----'
                        for (let i = 0; i < result.length; i++) {
                            const { date, title, link, desc } = result[i]
                            neoInfo += `\n\n➸ *Title*: ${title}\n➸ *Date*: ${date}\n➸ *Synopsis*: ${desc}\n➸ *Link*: ${link}\n\n=_=_=_=_=_=_=_=_=_=_=_=_=`
                        }
                        await bocchi.reply(from, neoInfo, id)
                        console.log('Success sending Neonime latest update!')
                    })
                    .catch(async (err) => {
                        console.error(err)
                        await bocchi.reply(from, 'Error!', id)
                    })
            break
            case 'anoboy2342342342':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                await bocchi.reply(from, ind.wait(), id)
                weeaboo.anoboy()
                    .then(async ({ result }) => {
                        let anoboyInfo = '-----[ *ANOBOY ON-GOING* ]-----'
                        for (let i = 0; i < result.length; i++) {
                            anoboyInfo += `\n\n➸ *Title*: ${result[i].title}\n➸ *URL*: ${result[i].url}\n\n=_=_=_=_=_=_=_=_=_=_=_=_=`
                        }
                        await bocchi.reply(from, anoboyInfo, id)
                        console.log('Success sending on-going anime!')
                    })
                    .catch(async (err) => {
                        console.error(err)
                        await bocchi.reply(from, 'Error!', id)
                    })
            break

            // Fun
            case 'asupan234234234':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                await bocchi.reply(from, ind.wait(), id)
                fun.asupan()
                    .then(async (body) => {
                        const asupan = body.split('\n')
                        const asupanx = asupan[Math.floor(Math.random() * asupan.length)]
                        await bocchi.sendFileFromUrl(from, `http://sansekai.my.id/ptl_repost/${asupanx}`, 'asupan.mp4', 'Follow IG: https://www.instagram.com/ptl_repost untuk mendapatkan asupan lebih banyak.', id)
                        console.log('Success sending video!')
                    })
                    .catch(async (err) => {
                        console.error(err)
                        await bocchi.reply(from, 'Error!', id)
                    })
            break
            case 'citacitawwwwwwwwwww': // Piyobot
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                fun.cita()
                    .then(async (body) => {
                        const cita = body.split('\n')
                        const randomCita = cita[Math.floor(Math.random() * cita.length)]
                        await bocchi.sendFileFromUrl(from, randomCita, 'cita.mp3', '', id)
                    })
                    .catch(async (err) => {
                        console.error(err)
                        await bocchi.reply(from, 'Error!', id)
                    })
            break
            case 'yo':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                if (quotedMsg) {
                    const getQuoted = quotedMsgObj.sender.id
                    const profilePic = await bocchi.getProfilePicFromServer(getQuoted)
                    const username = quotedMsgObj.sender.name
                    const statuses = await bocchi.getStatus(getQuoted)
                    const benet = _ban.includes(getQuoted) ? 'Si' : 'No'
                    const adm = groupAdmins.includes(getQuoted) ? 'Si' : 'No'
                    const premi = premium.checkPremiumUser(getQuoted, _premium) ? 'Si' : 'No'
                    const { status } = statuses
                    if (profilePic === undefined) {
                        var pfp = errorImg
                    } else {
                        var pfp = profilePic
                    }
                    await bocchi.sendFileFromUrl(from, pfp, `${username}.jpg`, ind.profile(username, status, premi, benet, adm), id)
                } else {
                    const profilePic = await bocchi.getProfilePicFromServer(sender.id)
                    const username = pushname
                    const statuses = await bocchi.getStatus(sender.id)
                    const benet = isBanned ? 'Si' : 'No'
                    const adm = isGroupAdmins ? 'Si' : 'No'
                    const premi = isPremium ? 'Si' : 'No'
                    const { status } = statuses
                    if (profilePic === undefined) {
                        var pfp = errorImg
                    } else {
                        var pfp = profilePic
                    }
                    await bocchi.sendFileFromUrl(from, pfp, `${username}.jpg`, ind.profile(username, status, premi, benet, adm), id)
                }
            break
            case 'hartatahta123123123':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                if (!q) return await bocchi.reply(from, ind.wrongFormat(), id)
                await bocchi.reply(from, ind.wait(), id)
                console.log('Creating harta tahta text...')
                await bocchi.sendFileFromUrl(from, `https://api.vhtear.com/hartatahta?text=${q}&apikey=${config.vhtear}`, `${q}.jpg`, '', id)
                    .then(() => console.log('Success creating image!'))
                    .catch(async (err) => {
                        console.error(err)
                        await bocchi.reply(from, 'Error!', id)
                    })
            break
            case 'calendar123123123':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                if (isMedia && isImage || isQuotedImage) {
                    await bocchi.reply(from, ind.wait(), id)
                    const encryptMedia = isQuotedImage ? quotedMsg : message
                    const mediaData = await decryptMedia(encryptMedia, uaOverride)
                    const imageLink = await uploadImages(mediaData, `calendar.${sender.id}`)
                    fun.calendar(imageLink)
                        .then(async ({ result }) => {
                            await bocchi.sendFileFromUrl(from, result.imgUrl, 'calendar.jpg', '', id)
                                .then(() => console.log('Success creating image!'))
                        })
                        .catch(async (err) => {
                            console.error(err)
                            await bocchi.reply(from, 'Error!', id)
                        })
                } else {
                    await bocchi.reply(from, ind.wrongFormat(), id)
                }
            break
            case 'partner2132123123':
            case 'pasangan123123123':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                if (!q) return await bocchi.reply(from, ind.wrongFormat(), id)
                const nama = q.substring(0, q.indexOf('|') - 1)
                const pasangan = q.substring(q.lastIndexOf('|') + 2)
                await bocchi.reply(from, ind.wait(), id)
                fun.pasangan(nama, pasangan)
                    .then(async ({ result }) => {
                        await bocchi.reply(from, result.hasil, id)
                            .then(() => console.log('Success sending fortune!'))
                    })
                    .catch(async (err) => {
                        console.error(err)
                        await bocchi.reply(from, 'Error!', id)
                    })
            break
            case 'zodiac1231231':
            case 'zodiak12312312':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                if (args.length !== 1) return await bocchi.reply(from, ind.wrongFormat(), id)
                await bocchi.reply(from, ind.wait(), id)
                fun.zodiak(args[0])
                    .then(async ({ result }) => {
                        if (result.status === 204) {
                            return await bocchi.reply(from, result.ramalan, id)
                        } else {
                            let ramalan = `Zodiak: ${result.zodiak}\n\nRamalan: ${result.ramalan}\n\nAngka laksek: ${result.nomorKeberuntungan}\n\n${result.motivasi}\n\n${result.inspirasi}`
                            await bocchi.reply(from, ramalan, id)
                                .then(() => console.log('Success sending zodiac fortune!'))
                        }
                    })
                    .catch(async (err) => {
                        console.error(err)
                        await bocchi.reply(from, 'Error!', id)
                    })
            break
            case 'write':
            case 'nulis':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                if (!q) return await bocchi.reply(from, ind.wrongFormat(), id)
                await bocchi.reply(from, ind.wait(), id)
                console.log('Creating writing...')
                await bocchi.sendFileFromUrl(from, `https://arugaz.herokuapp.com/api/nulis?text=${q}&apikey=${config.vhtear}`, 'nulis.jpg', '', id)
                    .then(() => console.log('Success sending write image!'))
                    .catch(async (err) => {
                        console.error(err)
                        await bocchi.reply(from, 'Error!', id)
                    })
            break
            case 'missing1111111':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                if (!q) return await bocchi.reply(from, ind.wrongFormat(), id)
                const atas = q.substring(0, q.indexOf('|') - 1)
                const tengah = q.substring(q.indexOf('|') + 2, q.lastIndexOf('|') - 1)
                const bawah = q.substring(q.lastIndexOf('|') + 2)
                if (isMedia && isImage || isQuotedImage) {
                    await bocchi.reply(from, ind.wait(), id)
                    const encryptMedia = isQuotedImage ? quotedMsg : message
                    const mediaData = await decryptMedia(encryptMedia, uaOverride)
                    const imageLink = await uploadImages(mediaData, `missing.${sender.id}`)
                    fun.missing(atas, tengah, bawah, imageLink)
                        .then(async ({ result }) => {
                            await bocchi.sendFileFromUrl(from, result.imgUrl, 'missing.jpg', '', id)
                            console.log('Success sending image!')
                        })
                        .catch(async (err) => {
                            console.error(err)
                            await bocchi.reply(from, 'Error!', id)
                        })
                } else {
                    await bocchi.reply(from, ind.wrongFormat(), id)
                }
            break
            case 'ffbanner': //By: VideFrelan
            if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
            if (!q.includes('|')) return bocchi.reply(from, `Untuk membuat banner Freefire\ngunakan ${prefix}ffbanner teks1 | teks 2\n\nContoh: ${prefix}ffbanner fikri gans | pake banget`, id)
            await bocchi.reply(from, ind.wait(), id)
            console.log('Creating FF Banner...')
            const teks1ffanjg = q.substring(0, q.indexOf('|') - 1)
            const teks2ffanjg = q.substring(q.lastIndexOf('|') + 2)
            await bocchi.sendFileFromUrl(from, `https://api.vhtear.com/bannerff?title=${teks1ffanjg}&text=${teks2ffanjg}&apikey=${config.vhtear}`, id)
            console.log('Sukes mengirimkan Banner Freefire!')
            break
            case 'fflogo': //By: VideFrelan
            if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
            if (!q.includes('|')) return bocchi.reply(from, `Untuk membuat Logo Karakter Freefire\ngunakan ${prefix}fflogo karakter | teks\n\nContoh: ${prefix}fflogo alok | Fikri gans`, id)
            await bocchi.reply(from, ind.wait(), id)
            console.log('Creating FF Logo...')
            const karakter = q.substring(0, q.indexOf('|') - 1)
            const teksff = q.substring(q.lastIndexOf('|') + 2)
            await bocchi.sendFileFromUrl(from, `https://api.vhtear.com/logoff?hero=${karakter}&text=${teksff}&apikey=${config.vhtear}`, id)
            console.log('Sukes mengirimkan Logo Freefire!')
            break
            case 'text3d':
            case '3dtext':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                if (!q) return await bocchi.reply(from, ind.wrongFormat(), id)
                await bocchi.reply(from, ind.wait(), id)
                console.log('Creating 3D text...')
                await bocchi.sendFileFromUrl(from, `https://docs-jojo.herokuapp.com/api/text3d?text=${q}`,`${q}.jpg`, '', id)
                console.log('Success creating 3D text!')
            break
            case 'valentine123123123':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                if (!q) return await bocchi.reply(from, ind.wrongFormat(), id)
                if (isMedia && isImage || isQuotedImage) {
                    await bocchi.reply(from, ind.wait(), id)
                    const nama = q.substring(0, q.indexOf('|') - 1)
                    const pasangan = q.substring(q.lastIndexOf('|') + 2)
                    const encryptMedia = isQuotedImage ? quotedMsg : message
                    const dataPasangan = await decryptMedia(encryptMedia, uaOverride)
                    const foto = await bocchi.getProfilePicFromServer(sender.id)
                    const dataMu = await bent('buffer')(foto)
                    const fotoMu = await uploadImages(dataMu, `fotoMu.${sender.id}`)
                    const fotoPasangan = await uploadImages(dataPasangan, `fotoPasangan.${sender.id}`)
                    fun.valentine(nama, pasangan, fotoMu, fotoPasangan)
                        .then(async ({ result }) => {
                            await bocchi.sendFileFromUrl(from, result.imgUrl, `${nama}_${pasangan}.jpg`, '', id)
                                .then(() => console.log('Success creating image!'))
                        })
                        .catch(async (err) => {
                            console.error(err)
                            await bocchi.reply(from, 'Error!', id)
                        })
                } else {
                    await bocchi.reply(from, ind.wrongFormat(), id)
                }
            break
            case 'simi123123123':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                if (!isGroupMsg) return await bocchi.reply(from, ind.groupOnly(), id)
                if (!q) return await bocchi.reply(from, ind.wrongFormat(), id)
                fun.simi(q)
                  .then(async ({ success }) => {
                      await bocchi.reply(from, success, id)
                  })
                  .catch(async (err) => {
                      console.error(err)
                      await bocchi.reply(from, `Error!\n\n${err}`, id)
                  })
            break
            case 'glitchte2xt123123':
            case 'glitext132312312':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                if (!q) return await bocchi.reply(from, ind.wrongFormat(), id)
                const teks1 = q.substring(0, q.indexOf('|') - 1)
                const teks2 = q.substring(q.lastIndexOf('|') + 2)
                await bocchi.reply(from, ind.wait(), id)
                console.log('Creating glitch text...')
                await bocchi.sendFileFromUrl(from, `https://api.vhtear.com/glitchtext?text1=${teks1}&text2=${teks2}&apikey=${config.vhtear}`, 'glitch.jpg', '', id)
                    .then(() => console.log('Success creating image!'))
                    .catch(async (err) => {
                        console.error(err)
                        await bocchi.reply(from, 'Error!', id)
                    })
            break
            case 'phmaker':
            case 'phlogo':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                if (args.length === 0) return bocchi.reply(from, `*Para crear una imagen al estilo de PORNHUB usa el comando:*\n\n*.phlogo TEXTO | TEXTO*\nEs obligatorio que uses esta raya *" | "* para devidir cada texto.....\n\nEjemplo : *${prefix}phlogo Santo | Coffe*`, id)
                if (!q) return await bocchi.reply(from, ind.wrongFormat(), id)
                const kiri = q.substring(0, q.indexOf('|') - 1)
                const kanan = q.substring(q.lastIndexOf('|') + 2)
                await bocchi.reply(from, ind.wait(), id)
                console.log('Creating Pornhub text...')
                await bocchi.sendFileFromUrl(from, `https://docs-jojo.herokuapp.com/api/phblogo?text1=${kiri}&text2=${kanan}`, 'ph.jpg', '', id)
                    .then(() => console.log('Success creating image!'))
                    .catch(async (err) => {
                        console.error(err)
                        await bocchi.reply(from, '*Para crear una imagen al estilo de PORNHUB usa el comando:*\n\n*.phlogo TEXTO | TEXTO*\nEs obligatorio que uses esta raya *" | "* para devidir cada texto.....\n\nEjemplo : *${prefix}phlogo Santo | Coffe*', id)
                    })
            break
            case 'blackpink123123123':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                if (!q) return await bocchi.reply(from, ind.wrongFormat(), id)
                await bocchi.reply(from, ind.wait(), id)
                console.log('Creating Blackpink text...')
                await bocchi.sendFileFromUrl(from, `https://api.vhtear.com/blackpinkicon?text=${q}&apikey=${config.vhtear}`, `${q}.jpg`, '', id)
                    .then(() => console.log('Success creting image!'))
                    .catch(async (err) => {
                        console.error(err)
                        await bocchi.reply(from, 'Error!', id)
                    })
            break
            case 'galaxy3123123123':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                if (!q) return await bocchi.reply(from, ind.wrongFormat(), id)
                await bocchi.reply(from, ind.wait(), id)
                console.log('Creating galaxy text...')
                await bocchi.sendFileFromUrl(from, `https://api.vhtear.com/galaxytext?text=${q}&apikey=${config.vhtear}`, `${q}.jpg`, '', id)
                    .then(() => console.log('Success creating image!'))
                    .catch(async (err) => {
                        console.error(err)
                        await bocchi.reply(from, 'Error!', id)
                    })
            break
            case 'verdadomentira':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                await bocchi.reply(from, 'Sebelum bermain berjanjilah akan melaksanakan apapun perintah yang diberikan.' , id)
                await bocchi.sendText(from, `Silakan ketik *${prefix}truth* atau *${prefix}dare*`)
            break
            case 'fecha':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                if (!q.includes('|')) return await bocchi.reply(from, ind.wrongFormat(), id)
                const tgl = q.substring(0, q.indexOf('|') - 1)
                const bln = q.substring(q.indexOf('|') + 2, q.lastIndexOf('|') - 1)
                const thn = q.substring(q.lastIndexOf('|') + 2)
                await bocchi.reply(from, ind.wait(), id)
                fun.weton(tgl, bln, thn)
                    .then(async ({ result }) => {
                        if (result.response !== 200) return await bocchi.reply(from, 'Invalid!', id)
                        await bocchi.reply(from, result.hasil, id)
                        console.log('Success sending weton info!')
                    })
                    .catch(async (err) => {
                        console.error(err)
                        await bocchi.reply(from, 'Error!', id)
                    })
            break
            case 'truth':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                fun.truth()
                    .then(async (body) => {
                        const tod = body.split('\n')
                        const randomTod = tod[Math.floor(Math.random() * tod.length)]
                        await bocchi.reply(from, randomTod, id)
                    })
                    .catch(async (err) => {
                        console.error(err)
                        await bocchi.reply(from, 'Error!', id)
                    })
            break
            case 'dare':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                fun.dare()
                    .then(async (body) => {
                        const dare = body.split('\n')
                        const randomDare = dare[Math.floor(Math.random() * dare.length)]
                        await bocchi.reply(from, randomDare, id)
                    })
                    .catch(async (err) => {
                        console.error(err)
                        await bocchi.reply(from, 'Error!', id)
                    })
            break
            case 'macha22':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                try {
                    if (isMedia && isImage) {
                        const ppRaw = await decryptMedia(message, uaOverride)
                        canvas.Canvas.trigger(ppRaw)
                            .then(async (buffer) => {
                                canvas.write(buffer, `${sender.id}_machete.png`)
                                await bocchi.sendFile(from, `${sender.id}_machete.png`, `${sender.id}_machete.png`, 'PINOCHO', id)
                                fs.unlinkSync(`${sender.id}_machete.png`)
                            })
                    } else if (quotedMsg) {
                        const ppRaw = await bocchi.getProfilePicFromServer(quotedMsgObj.sender.id)
                        canvas.Canvas.trigger(ppRaw)
                            .then(async (buffer) => {
                                canvas.write(buffer, `${sender.id}_machete.png`)
                                await bocchi.sendFile(from, `${sender.id}_machete.png`, `${sender.id}_machete.png`, 'PINOCHO', id)
                                fs.unlinkSync(`${sender.id}_machete.png`)
                            })
                    } else {
                        const ppRaw = await bocchi.getProfilePicFromServer(sender.id)
                        canvas.Canvas.trigger(ppRaw)
                            .then(async (buffer) => {
                                canvas.write(buffer, `${sender.id}_machete.png`)
                                await bocchi.sendFile(from, `${sender.id}_machete.png`, `${sender.id}_machete.png`, 'PINNOCHO', id)
                                fs.unlinkSync(`${sender.id}_machete.png`)
                            })
                    }
                } catch (err) {
                    console.error(err)
                    await bocchi.reply(from, 'Error!', id)
                }
            break
            case 'beso12312312':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                if (args.length == 0) return bocchi.reply(from, `Para crear 2 imagenes besandose envia una imagen o mencionala junto al comando *${prefix}beso*`, id)
                try {
                    if (isMedia && isImage) {
                        const ppRaw = await bocchi.getProfilePicFromServer(sender.id)
                        const ppSecond = await decryptMedia(message, uaOverride)
                        if (ppRaw === undefined) {
                            var ppFirst = errorImg
                        } else {
                            var ppFirst = ppRaw
                        }
                        canvas.Canvas.kiss(ppFirst, ppSecond)
                            .then(async (buffer) => {
                                canvas.write(buffer, `${sender.id}_kiss.png`)
                                await bocchi.sendFile(from, `${sender.id}_kiss.png`, `${sender.id}_kiss.png`, '', id)
                                fs.unlinkSync(`${sender.id}_kiss.png`)
                            })
                    } else if (quotedMsg) {
                        const ppRaw = await bocchi.getProfilePicFromServer(sender.id)
                        const ppSecond = await bocchi.getProfilePicFromServer(quotedMsgObj.sender.id)
                        if (ppRaw === undefined) {
                            var ppFirst = errorImg
                        } else {
                            var ppFirst = ppRaw
                        }
                        canvas.Canvas.kiss(ppFirst, ppSecond)
                            .then(async (buffer) => {
                                canvas.write(buffer, `${sender.id}_kiss.png`)
                                await bocchi.sendFile(from, `${sender.id}_kiss.png`, `${sender.id}_kiss.png`, '', id)
                                fs.unlinkSync(`${sender.id}_kiss.png`)
                            })
                    } else {
                        await bocchi.reply(from, ind.wrongFormat(), id)
                    }
                } catch (err) {
                    console.error(err)
                    await bocchi.reply(from, 'Error!', id)
                }
            break
            case 'phc':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                if (args.length == 0) return bocchi.reply(from, `Para crear un comentario imagen al estilo de PORNHUB usa el comando:*\n\n*${prefix}phc TEXTO | TEXTO*\nEs obligatorio que uses esta raya *" | "* para devidir cada texto.....\n\nEjemplo : *${prefix}phc Santo | Hola mundo*`, id)
                if (!q.includes('|')) return await bocchi.reply(from, ind.wrongFormat(), id)
                const usernamePh = q.substring(0, q.indexOf('|') - 1)
                const commentPh = q.substring(q.lastIndexOf('|') + 2)
                const ppPhRaw = await bocchi.getProfilePicFromServer(sender.id)
                if (ppPhRaw === undefined) {
                    var ppPh = errorImg
                } else {
                    var ppPh = ppPhRaw
                }
                const dataPpPh = await bent('buffer')(ppPh)
                const linkPpPh = await uploadImages(dataPpPh, `${sender.id}_ph`)
                await bocchi.reply(from, ind.wait(), id)
                const preproccessPh = await axios.get(`https://nekobot.xyz/api/imagegen?type=phcomment&image=${linkPpPh}&text=${commentPh}&username=${usernamePh}`)
                await bocchi.sendFileFromUrl(from, preproccessPh.data.message, 'ph.jpg', '', id)
                console.log('Success creating image!')
            break

            // Sticker
            case 'sticker':
            case 'stiker':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                if (isMedia && isImage || isQuotedImage) {
                    await bocchi.reply(from, ind.wait(), id)
                    const encryptMedia = isQuotedImage ? quotedMsg : message
                    const _mimetype = isQuotedImage ? quotedMsg.mimetype : mimetype
                    const mediaData = await decryptMedia(encryptMedia, uaOverride)
                    const imageBase64 = `data:${_mimetype};base64,${mediaData.toString('base64')}`
                    await bocchi.sendImageAsSticker(from, imageBase64)
                        .then(async () => {
                            await bocchi.sendText(from, ind.sempai())
                            console.log(`Sticker processed for ${processTime(t, moment())} seconds`)
                        })
                        .catch(async (err) => {
                            console.error(err)
                            await bocchi.reply(from, 'Error!', id)
                        })
                } else {
                    await bocchi.reply(from, ind.wrongFormat(), id)
                }
            break
            case 'stikergif':
            case 'gif':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                if (isMedia && type === 'video' || mimetype === 'image/gif') {
                    await bocchi.reply(from, ind.gifcode(), id)
                    try {
                        const mediaData = await decryptMedia(message, uaOverride)
                        const videoBase64 = `data:${mimetype};base64,${mediaData.toString('base64')}`
                        await bocchi.sendMp4AsSticker(from, videoBase64, { fps: 24, startTime: `00:00:00.0`, endTime : `00:00:10.0`, loop: 0 })
                            .then(async () => {
                                console.log(`Sticker Procesado ${processTime(t, moment())} segundos`)
                                await bocchi.sendText(from, ind.sempai())
                            })
                    } catch (err) {
                        console.error(err)
                        await bocchi.reply(from, ind.videoLimit(), id)
                    }
                } else if (isQuotedGif || isQuotedVideo) {
                    await bocchi.reply(from, ind.wait(), id)
                    try {
                        const mediaData = await decryptMedia(quotedMsg, uaOverride)
                        const videoBase64 = `data:${quotedMsg.mimetype};base64,${mediaData.toString('base64')}`
                        await bocchi.sendMp4AsSticker(from, videoBase64, { fps: 30, startTime: `00:00:00.0`, endTime : `00:00:10.0`, loop: 0 })
                            .then(async () => {
                                console.log(`Sticker Procesado ${processTime(t, moment())} segundos`)
                                await bocchi.sendText(from, ind.sempai())
                            })
                    } catch (err) {
                        console.error(err)
                        await bocchi.reply(from, ind.videoLimit(), id)
                    }
                } else {
                    await bocchi.reply(from, ind.wrongFormat(), id)
                }
            break
            case 'stickerlightning123123123123':
            case 'slightning3123123123123':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                if (isMedia && isImage || isQuotedImage) {
                    await bocchi.reply(from, ind.wait(), id)
                    const encryptMedia = isQuotedImage ? quotedMsg : message
                    const mediaData = await decryptMedia(encryptMedia, uaOverride)
                    const imageLink = await uploadImages(mediaData, `lightning.${sender.id}`)
                    sticker.stickerLight(imageLink)
                        .then(async ({ result }) => {
                            await bocchi.sendStickerfromUrl(from, result.imgUrl)
                                .then(async () => {
                                    console.log(`Sticker processed for ${processTime(t, moment())} seconds`)
                                    await bocchi.sendText(from, ind.ok())
                                })
                        })
                        .catch(async (err) => {
                            console.error(err)
                            await bocchi.reply(from, 'Error!', id)
                        })
                } else {
                    await bocchi.reply(from, ind.wrongFormat(), id)
                }
            break
            case 'stickerfire3423423423423':
            case 'sf34234234234ire':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                if (isMedia && isImage || isQuotedImage) {
                    await bocchi.reply(from, ind.wait(), id)
                    const encryptMedia = isQuotedImage ? quotedMsg : message
                    const mediaData = await decryptMedia(encryptMedia, uaOverride)
                    const imageLink = await uploadImages(mediaData, `fire.${sender.id}`)
                    sticker.stickerFire(imageLink)
                        .then(async ({ result }) => {
                            if (result.error) return await bocchi.reply(from, 'Error... :(', id)
                            await bocchi.sendStickerfromUrl(from, result.imgUrl)
                                .then(async () => {
                                    console.log(`Sticker processed for ${processTime(t, moment())} seconds`)
                                    await bocchi.sendText(from, ind.ok())
                                })
                        })
                        .catch(async (err) => {
                            console.error(err)
                            await bocchi.reply(from, 'Error!', id)
                        })
                } else {
                    await bocchi.reply(from, ind.wrongFormat(), err)
                }
            break
            case 'ttg2342342342':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                if (!q) return await bocchi.reply(from, ind.wrongFormat(), id)
                await bocchi.reply(from, ind.wait(), id)
                await bocchi.sendStickerfromUrl(from, `https://api.vhtear.com/textxgif?text=${q}&apikey=${config.vhtear}`)
                    .then(() => console.log('Success creating GIF!'))
                    .catch(async (err) => {
                        console.error(err)
                        await bocchi.reply(from, 'Error!', id)
                    })
            break
            case 'stickertoimg':
            case 'stikertoimg':
            case 'stick':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                if (isQuotedSticker) {
                    await bocchi.reply(from, ind.wait(), id)
                    try {
                        const mediaData = await decryptMedia(quotedMsg, uaOverride)
                        const imageBase64 = `data:${quotedMsg.mimetype};base64,${mediaData.toString('base64')}`
                        await bocchi.sendFile(from, imageBase64, 'sticker.jpg', '', id)
                    } catch (err) {
                        console.error(err)
                        await bocchi.reply(from, 'Error!', id)
                    }
                } else {
                    await bocchi.reply(from, ind.wrongFormat(), id)
                }
            break
            case 'emojisticker123123123123':
            case 'emojistiker3123123123123':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                if (args.length !== 1) return bocchi.reply(from, ind.wrongFormat(), id)
                const emoji = emojiUnicode(args[0])
                await bocchi.reply(from, ind.wait(), id)
                console.log('Creating emoji code for =>', emoji)
                await bocchi.sendStickerfromUrl(from, `https://api.vhtear.com/emojitopng?code=${emoji}&apikey=${config.vhtear}`)
                    .then(async () => {
                        await bocchi.reply(from, ind.ok(), id)
                        console.log(`Sticker processed for ${processTime(t, moment())} seconds`)
                    })
                    .catch(async (err) => {
                        console.error(err)
                        await bocchi.reply(from, 'Emoji not supported!', id)
                    })
            break

            // NSFW
            case 'premium1':
                // Premium feature, contact the owner.
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                if (isGroupMsg) {
                    if (!isNsfw) return await bocchi.reply(from, ind.notNsfw(), id)
                    if (!isPremium) return await bocchi.reply(from, ind.notPremium(), id)
                    await bocchi.reply(from, ind.botNotPremium(), id)
                } else {
                    if (!isPremium) return await bocchi.reply(from, ind.notPremium(), id)
                    await bocchi.reply(from, ind.botNotPremium(), id)
                }
            break
            case 'premium3':
                // Premium feature, contact the owner.
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                if (isGroupMsg) {
                    if (!isNsfw) return await bocchi.reply(from, ind.notNsfw(), id)
                    if (!isPremium) return await bocchi.reply(from, ind.notPremium(), id)
                    await bocchi.reply(from, ind.botNotPremium(), id)
                } else {
                    if (!isPremium) return await bocchi.reply(from, ind.notPremium(), id)
                    await bocchi.reply(from, ind.botNotPremium(), id)
                }
            break
            case 'echi':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                if (isGroupMsg) {
                    if (!isNsfw) return await bocchi.reply(from, ind.notNsfw(), id)
                    await bocchi.reply(from, ind.wait(), id)
                    nsfw.randomLewd()
                        .then(async ({ url }) => {
                            await bocchi.sendFileFromUrl(from, url, 'lewd.jpg', '', null, null, true)
                                .then(() => console.log('Success sending lewd!'))
                        })
                        .catch(async (err) => {
                            console.error(err)
                            await bocchi.reply(from, 'Error!', id)
                        })
                } else {
                    await bocchi.reply(from, ind.wait(), id)
                    nsfw.randomLewd()
                        .then(async ({ url }) => {
                            await bocchi.sendFileFromUrl(from, url, 'lewd.jpg', '', null, null, true)
                                .then(() => console.log('Success sending lewd!'))
                        })
                        .catch(async (err) => {
                            console.error(err)
                            await bocchi.reply(from, 'Error!', id)
                        })
                }
            break
            case 'fetiche':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                if (args.length == 0) return bocchi.reply(from, `Para ver imagenes de fetiches de anime usa *${prefix}fetiche "FETICHE DISPONIBLE EN LAS VARIANTES"*\n\nLas variantes disponibles son:\n*axilas*\n*pies*\n*muslos*\n*culo*\n*tetas*\n*barriga*\n*tetaslaterales*\n*ahegao*`, id)
                if (ar.length !== 1) return await bocchi.reply(from, ind.wrongFormat(), id)
                if (isGroupMsg) {
                    if (!isNsfw) return await bocchi.reply(from, ind.notNsfw(), id)
                    await bocchi.reply(from, ind.wait(), id)
                    try {
                        if (ar[0] === 'axilas') {
                            nsfw.armpits()
                                .then(async ({ url }) => {
                                    await bocchi.sendFileFromUrl(from, url, 'armpits.jpg', '', id)
                                        .then(() => console.log('Success sending armpits pic!'))
                                })
                        } else if (ar[0] === 'pies') {
                            nsfw.feets()
                                .then(async ({ url }) => {
                                    await bocchi.sendFileFromUrl(from, url, 'feets.jpg', '', id)
                                        .then(() => console.log('Success sending feets pic!'))
                                })
                        } else if (ar[0] === 'muslos') {
                            nsfw.thighs()
                                .then(async ({ url }) => {
                                    await bocchi.sendFileFromUrl(from, url, 'thighs.jpg', '', id)
                                        .then(() => console.log('Success sending thighs pic!'))
                                })
                        } else if (ar[0] === 'culo') {
                            nsfw.ass()
                                .then(async ({ url }) => {
                                    await bocchi.sendFileFromUrl(from, url, 'ass.jpg', '', id)
                                        .then(() => console.log('Success sending ass pic!'))
                                })
                        } else if (ar[0] === 'tetas') {
                            nsfw.boobs()
                                .then(async ({ url }) => {
                                    await bocchi.sendFileFromUrl(from, url, 'boobs.jpg', '', id)
                                        .then(() => console.log('Success sending boobs pic!'))
                                })
                        } else if (ar[0] === 'barriga') {
                            nsfw.belly()
                                .then(async ({ url }) => {
                                    await bocchi.sendFileFromUrl(from, url, 'belly.jpg', '', id)
                                        .then(() => console.log('Success sending belly pic!'))
                                })
                        } else if (ar[0] === 'tetaslaterales') {
                            nsfw.sideboobs()
                                .then(async ({ url }) => {
                                    await bocchi.sendFileFromUrl(from, url, 'sideboobs.jpg', '', id)
                                        .then(() => console.log('Success sending sideboobs pic!'))
                                })
                        } else if (ar[0] === 'ahegao') {
                            nsfw.ahegao()
                                .then(async ({ url }) => {
                                    await bocchi.sendFileFromUrl(from, url, 'ahegao.jpg', '', id)
                                        .then(() => console.log('Success sending ahegao pic!'))
                                })
                        } else {
                            await bocchi.reply(from, 'Tag not found.', id)
                        }
                    } catch (err) {
                        console.error(err)
                        await bocchi.reply(from, err, id)
                    }
                } else {
                    await bocchi.reply(from, ind.wait(), id)
                    try {
                        if (ar[0] === 'armpits') {
                            nsfw.armpits()
                                .then(async ({ url }) => {
                                    await bocchi.sendFileFromUrl(from, url, 'armpits.jpg', '', id)
                                        .then(() => console.log('Success sending armpits pic!'))
                                })
                        } else if (ar[0] === 'feets') {
                            nsfw.feets()
                                .then(async ({ url }) => {
                                    await bocchi.sendFileFromUrl(from, url, 'feets.jpg', '', id)
                                        .then(() => console.log('Success sending feets pic!'))
                                })
                        } else if (ar[0] === 'thighs') {
                            nsfw.thighs()
                                .then(async ({ url }) => {
                                    await bocchi.sendFileFromUrl(from, url, 'thighs.jpg', '', id)
                                        .then(() => console.log('Success sending thighs pic!'))
                                })
                        } else if (ar[0] === 'ass') {
                            nsfw.ass()
                                .then(async ({ url }) => {
                                    await bocchi.sendFileFromUrl(from, url, 'ass.jpg', '', id)
                                        .then(() => console.log('Success sending ass pic!'))
                                })
                        } else if (ar[0] === 'boobs') {
                            nsfw.boobs()
                                .then(async ({ url }) => {
                                    await bocchi.sendFileFromUrl(from, url, 'boobs.jpg', '', id)
                                        .then(() => console.log('Success sending boobs pic!'))
                                })
                        } else if (ar[0] === 'belly') {
                            nsfw.belly()
                                .then(async ({ url }) => {
                                    await bocchi.sendFileFromUrl(from, url, 'belly.jpg', '', id)
                                        .then(() => console.log('Success sending belly pic!'))
                                })
                        } else if (ar[0] === 'sideboobs') {
                            nsfw.sideboobs()
                                .then(async ({ url }) => {
                                    await bocchi.sendFileFromUrl(from, url, 'sideboobs.jpg', '', id)
                                        .then(() => console.log('Success sending sideboobs pic!'))
                                })
                        } else if (ar[0] === 'ahegao') {
                            nsfw.ahegao()
                                .then(async ({ url }) => {
                                    await bocchi.sendFileFromUrl(from, url, 'ahegao.jpg', '', id)
                                        .then(() => console.log('Success sending ahegao pic!'))
                                })
                        } else {
                            await bocchi.reply(from, 'Tag not found.', id)
                        }
                    } catch (err) {
                        console.error(err)
                        await bocchi.reply(from, 'Error!', id)
                    }
                }
            break
            case 'nh':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                const kode = args[0]
                if (!kode) return await bocchi.reply(from, ind.wrongFormat(), id)
                if (isGroupMsg) {
                    if (!isNsfw) return await bocchi.reply(from, ind.notNsfw(), id)
                    await bocchi.reply(from, ind.wait(), id)
                    console.log(`Searching nHentai for ${kode}...`)
                    const validate = await nhentai.exists(kode)
                    if (validate === true) {
                        try {
                            const pic = await api.getBook(kode)
                                .then((book) => {
                                     return api.getImageURL(book.cover)
                                })
                            const dojin = await nhentai.getDoujin(kode)
                            const { title, details, link } = dojin
                            const { tags, artists, languages, categories } = await details
                            let teks = `*Title*: ${title}\n\n*Tags*: ${tags.join(', ')}\n\n*Artists*: ${artists}\n\n*Languages*: ${languages.join(', ')}\n\n*Categories*: ${categories}\n\n*Link*: ${link}`
                            await bocchi.sendFileFromUrl(from, pic, 'nhentai.jpg', teks, id)
                                .then(() => console.log('Success sending nHentai info!'))
                        } catch (err) {
                            console.error(err)
                            await bocchi.reply(from, 'Error!', id)
                        }
                    } else {
                        await bocchi.reply(from, ind.nhFalse(), id)
                    }
                } else {
                    await bocchi.reply(from, ind.wait(), id)
                    console.log(`Searching nHentai for ${kode}...`)
                    const validate = await nhentai.exists(kode)
                    if (validate === true) {
                        try {
                            const pic = await api.getBook(kode)
                                .then((book) => {
                                     return api.getImageURL(book.cover)
                                })
                            const dojin = await nhentai.getDoujin(kode)
                            const { title, details, link } = dojin
                            const { tags, artists, languages, categories } = await details
                            let teks = `*Title*: ${title}\n\n*Tags*: ${tags.join(', ')}\n\n*Artists*: ${artists}\n\n*Languages*: ${languages.join(', ')}\n\n*Categories*: ${categories}\n\n*Link*: ${link}`
                            await bocchi.sendFileFromUrl(from, pic, 'nhentai.jpg', teks, id)
                                .then(() => console.log('Success sending nHentai info!'))
                        } catch (err) {
                            console.error(err)
                            await bocchi.reply(from, 'Error!', id)
                        }
                    } else {
                        await bocchi.reply(from, ind.nhFalse(), id)
                    }
                }
            break
            case 'premium2':
                // Premium feature, contact the owner.
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                if (isGroupMsg) {
                    if (!isNsfw) return await bocchi.reply(from, ind.notNsfw(), id)
                    if (!isPremium) return await bocchi.reply(from, ind.notPremium(), id)
                    await bocchi.reply(from, ind.botNotPremium(), id)
                } else {
                    if (!isPremium) return await bocchi.reply(from, ind.notPremium(), id)
                    await bocchi.reply(from, ind.botNotPremium(), id)
                }
            break
            case 'nekopoi123123123': // Thanks to ArugaZ
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                if (isGroupMsg) {
                    if (!isNsfw) return await bocchi.reply(from, ind.notNsfw(), id)
                    await bocchi.reply(from, ind.wait(), id)
                    nsfw.getLatest()
                        .then((result) => {
                            nsfw.getVideo(result.link)
                                .then(async (res) => {
                                    let heheq = '\n'
                                    for (let i of res.links) {
                                        heheq += `${i}\n`
                                    }
                                    await bocchi.sendText(from, `Title: ${res.title}\n\nLink:${heheq}`)
                                })
                        })
                        .catch(async (err) => {
                            console.error(err)
                            await bocchi.reply(from, 'Error!', id)
                        })
                } else {
                    await bocchi.reply(from, ind.wait(), id)
                    nsfw.getLatest()
                        .then((result) => {
                            nsfw.getVideo(result.link)
                                .then(async (res) => {
                                    let heheq = '\n'
                                    for (let i of res.links) {
                                        heheq += `${i}\n`
                                    }
                                    await bocchi.sendText(from, `Title: ${res.title}\n\nLink:${heheq}`)
                                })
                        })
                        .catch(async (err) => {
                            console.error(err)
                            await bocchi.reply(from, 'Error!', id)
                        })
                }
            break
            case 'waifu18':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                if (isGroupMsg) {
                    if (!isNsfw) return await bocchi.reply(from, ind.notNsfw(), id)
                    await bocchi.reply(from, ind.wait(), id)
                    weeaboo.waifu(true)
                        .then(async ({ url }) => {
                            await bocchi.sendFileFromUrl(from, url, 'waifu.png', '', id)
                                .then(() => console.log('Success sending waifu!'))
                        })
                        .catch(async (err) => {
                            console.error(err)
                            await bocchi.reply(from, 'Error!', id)
                        })
                } else {
                    await bocchi.reply(from, ind.wait(), id)
                    weeaboo.waifu(true)
                        .then(async ({ url }) => {
                            await bocchi.sendFileFromUrl(from, url, 'waifu.png', '', id)
                                .then(() => console.log('Success sending waifu!'))
                        })
                        .catch(async (err) => {
                            console.error(err)
                            await bocchi.reply(from, 'Error!', id)
                        })
                }
            break
            case 'phdl123123':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                if (isGroupMsg) {
                    if (!isNsfw) return await bocchi.reply(from, ind.notNsfw(), id)
                    if (!isUrl(url) && !url.includes('pornhub.com')) return await bocchi.reply(from, ind.wrongFormat(), id)
                    await bocchi.reply(from, ind.wait(), id)
                    try {
                        nsfw.phDl(url)
                            .then(async ({ title, download_urls, thumbnail_url }) => {
                                const count = Object.keys(download_urls).length
                                if (count !== 2) {
                                    const shortsLow = await misc.shortener(download_urls['240P'])
                                    const shortsMid = await misc.shortener(download_urls['480P'])
                                    const shortsHigh = await misc.shortener(download_urls['720P'])
                                    await bocchi.sendFileFromUrl(from, thumbnail_url, `${title}`, `Title: ${title}\n\nLinks:\n${shortsLow} (240P)\n${shortsMid} (480P)\n${shortsHigh} (720P)`, id)
                                        .then(() => console.log('Success sending pornhub metadata!'))
                                } else {
                                    const shortsLow = await misc.shortener(download_urls['240P'])
                                    await bocchi.sendFileFromUrl(from, thumbnail_url, `${title}`, `Title: ${title}\n\nLinks:\n${shortsLow} (240P)`, id)
                                        .then(() => console.log('Success sending pornhub metadata!'))
                                }
                            })
                    } catch (err) {
                        console.error(err)
                        await bocchi.reply(from, 'Error!', id)
                    }
                } else {
                    if (!isUrl(url) && !url.includes('pornhub.com')) return await bocchi.reply(from, ind.wrongFormat(), id)
                    await bocchi.reply(from, ind.wait(), id)
                    try {
                        nsfw.phDl(url)
                            .then(async ({ title, download_urls, thumbnail_url }) => {
                                const count = Object.keys(download_urls).length
                                if (count !== 2) {
                                    const shortsLow = await misc.shortener(download_urls['240P'])
                                    const shortsMid = await misc.shortener(download_urls['480P'])
                                    const shortsHigh = await misc.shortener(download_urls['720P'])
                                    await bocchi.sendFileFromUrl(from, thumbnail_url, `${title}`, `Title: ${title}\n\nLinks:\n${shortsLow} (240P)\n${shortsMid} (480P)\n${shortsHigh} (720P)`, id)
                                        .then(() => console.log('Success sending pornhub metadata!'))
                                } else {
                                    const shortsLow = await misc.shortener(download_urls['240P'])
                                    await bocchi.sendFileFromUrl(from, thumbnail_url, `${title}`, `Title: ${title}\n\nLinks:\n${shortsLow} (240P)`, id)
                                        .then(() => console.log('Success sending pornhub metadata!'))
                                }
                            })
                    } catch (err) {
                        console.error(err)
                        await bocchi.reply(from, 'Error!', id)
                    }
                }
            break
            case 'yuri':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                if (isGroupMsg) {
                    if (!isNsfw) return await bocchi.reply(from, ind.notNsfw(), id)
                    await bocchi.reply(from, ind.wait(), id)
                    await bocchi.sendFileFromUrl(from, (await neko.nsfw.eroYuri()).url, 'yuri.jpg', '', id)
                } else {
                    await bocchi.reply(from, ind.wait(), id)
                    await bocchi.sendFileFromUrl(from, (await neko.nsfw.eroYuri()).url, 'yuri.jpg', '', id)
                }
            break
            case 'leavatar':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                if (isGroupMsg) {
                    if (!isNsfw) return await bocchi.reply(from, ind.notNsfw(), id)
                    await bocchi.reply(from, ind.wait(), id)
                    await bocchi.sendFileFromUrl(from, (await neko.nsfw.avatar()).url, 'avatar.jpg', '', id)
                } else {
                    await bocchi.reply(from, ind.wait(), id)
                    await bocchi.sendFileFromUrl(from, (await neko.nsfw.avatar()).url, 'avatar.jpg', '', id)
                }
            break
            case 'erotica':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                if (isGroupMsg) {
                    if (!isNsfw) return await bocchi.reply(from, ind.notNsfw(), id)
                    await bocchi.reply(from, ind.wait(), id)
                    await bocchi.sendFileFromUrl(from, (await neko.nsfw.femdom()).url, 'femdom.jpg', '', id)
                } else {
                    await bocchi.reply(from, ind.wait(), id)
                    await bocchi.sendFileFromUrl(from, (await neko.nsfw.femdom()).url, 'femdom.jpg', '', id)
                }
            break

            // Moderation command
            case 'mutegc':
            case 'silencio': 
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                if (!isGroupMsg) return bocchi.reply(from, ind.groupOnly(), id)
                if (!isGroupAdmins) return bocchi.reply(from, ind.adminOnly(), id)
                if (!isBotGroupAdmins) return bocchi.reply(from, ind.botNotAdmin(), id)
		if (args.length !== 1) return bocchi.reply(from, `Para cambiar la configuración del chat grupal para que solo los administradores puedan chatear\n\nuse:\n *${prefix}silencio activar* --para activarlo\n *${prefix}silencio apagar* --para apagarlo`, id)
                if (ar[0] === 'activar') {
                    await bocchi.setGroupToAdminsOnly(groupId, true)
                    await bocchi.sendText(from, ind.gcMute())
                } else if (ar[0] === 'apagar') {
                    await bocchi.setGroupToAdminsOnly(groupId, false)
                    await bocchi.sendText(from, ind.gcUnmute())
                } else {
                    await bocchi.reply(from, ind.wrongFormat(), id)
                }
            break
            case 'add123123123':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                if (!isGroupMsg) return await bocchi.reply(from, ind.groupOnly(), id)
                if (!isGroupAdmins) return await bocchi.reply(from, ind.adminOnly(), id)
                if (!isBotGroupAdmins) return await bocchi.reply(from, ind.botNotAdmin(), id)
                if (args.length !== 1) return await bocchi.reply(from, ind.wrongFormat(), id)
                try {
                    await bocchi.addParticipant(from, `${args[0]}@c.us`)
                    await bocchi.sendText(from, '🎉 Welcome! 🎉')
                } catch (err) {
                    console.error(err)
                    await bocchi.reply(from, 'Error!', id)
                }
            break
            case 'echar':
            case 'kick123123123':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                if (!isGroupMsg) return await bocchi.reply(from, ind.groupOnly(), id)
                if (!isGroupAdmins) return await bocchi.reply(from, ind.adminOnly(), id)
                if (!isBotGroupAdmins) return await bocchi.reply(from, ind.botNotAdmin(), id)
                if (args.length == 0) return bocchi.reply(from, `Para eliminar a alguien mencionalo junto al comando */echar*\n\nEjemplo: */echar @usuario*\n\nPara echar a 2 o mas usuario a la vez, usa el comando:\n*/echar @usuario @usuario @usuario*`, id)
                if (mentionedJidList.length === 0) return await bocchi.reply(from, ind.wrongFormat(), id)
                if (mentionedJidList[0] === botNumber) return await bocchi.reply(from, ind.wrongFormat(), id)
                await bocchi.sendTextWithMentions(from, `*Expulsando a el usuario* *${mentionedJidList.map(x => `@${x.replace('@c.us', '')}`).join('\n')}*\n\n*Si no quieren ser eliminados sigan las regla del grupo.*`)
                for (let i of mentionedJidList) {
                    if (groupAdmins.includes(i)) return await bocchi.sendText(from, ind.wrongFormat())
                    await bocchi.removeParticipant(groupId, i)
                }
            break
            case 'up':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                if (!isGroupMsg) return await bocchi.reply(from, ind.groupOnly(), id)
                if (!isGroupAdmins) return await bocchi.reply(from, ind.adminOnly(), id)
                if (!isBotGroupAdmins) return await bocchi.reply(from, ind.botNotAdmin(), id)
                if (mentionedJidList.length !== 1) return bocchi.reply(from, 'Para agregar a un usuario de administrador\nmencionalo junto al comando */up*\n\nEjemplo : */up @usuario*', id)
                if (mentionedJidList[0] === botNumber) return await bocchi.reply(from, ind.wrongFormat(), id)
                if (groupAdmins.includes(mentionedJidList[0])) return await bocchi.reply(from, ind.adminAlready(), id)
                await bocchi.promoteParticipant(groupId, mentionedJidList[0])
                await bocchi.reply(from, ind.daradmin(), id)
            break
            case 'quitar':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                if (!isGroupMsg) return await bocchi.reply(from, ind.groupOnly(), id)
                if (!isGroupAdmins) return await bocchi.reply(from, ind.adminOnly(), id)
                if (!isBotGroupAdmins) return await bocchi.reply(from, ind.botNotAdmin(), id)
                if (mentionedJidList.length !== 1) return bocchi.reply(from, 'Para quitar a un usuario de administrador mencionalo junto al comando */quitar*\n\nEjemplo : */quitar @usuario*', id)
                if (mentionedJidList[0] === botNumber) return await bocchi.reply(from, ind.wrongFormat(), id)
                if (!groupAdmins.includes(mentionedJidList[0])) return await bocchi.reply(from, ind.notAdmin(), id)
                await bocchi.demoteParticipant(groupId, mentionedJidList[0])
                await bocchi.reply(from, ind.quitadmin(), id)
            break
            case 'adiosbot':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                if (!isGroupMsg) return await bocchi.reply(from, ind.groupOnly(), id)
                if (!isGroupAdmins) return await bocchi.reply(from, ind.adminOnly(), id)
                await bocchi.sendText(from, 'Un administrador me ha pedido que salga del grupo, si quieren que entre nuevamente al grupo escribanle al dueño, para ver su numero usen el comando ( ⇀‸↼‶ ) */creador*')
                await bocchi.leaveGroup(groupId)
            break
            case 'todos': // Thanks to ArugaZ
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                if (!isGroupMsg) return await bocchi.reply(from, ind.groupOnly(), id)
                if (!isGroupAdmins) return await bocchi.reply(from, ind.adminOnly(), id)
                const groupMem = await bocchi.getGroupMembers(groupId)
                    let txt = '╔══✪〘 *C O F F E - B O T* 〙✪══\n'
                        for (let i = 0; i < groupMem.length; i++) {
                            txt += '╠➥'
                            txt += ` @${groupMem[i].id.replace(/@c.us/g, '')}\n`
                        }
                    txt += '╚═〘 *C O F F E - B O T* 〙'
                    await bocchi.sendTextWithMentions(from, txt)
            break
            case 'iconog':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                if (!isGroupMsg) return await bocchi.reply(from, ind.groupOnly(), id)
                if (!isGroupAdmins) return await bocchi.reply(from, ind.adminOnly(), id)
                if (!isBotGroupAdmins) return bocchi.reply(from, ind.botNotAdmin(), id)
                if (isMedia && isImage || isQuotedImage) {
                    await bocchi.reply(from, ind.wait(), id)
                    const encryptMedia = isQuotedImage ? quotedMsg : message
                    const _mimetype = isQuotedImage ? quotedMsg.mimetype : mimetype
                    const mediaData = await decryptMedia(encryptMedia, uaOverride)
                    const imageBase64 = `data:${_mimetype};base64,${mediaData.toString('base64')}`
                    await bocchi.setGroupIcon(groupId, imageBase64)
                    await bocchi.sendText(from, ind.fotocambiada())
                } else {
                    await bocchi.reply(from, ind.wrongFormat(), id)
                }
            break
            case 'antienlace':
            case 'antilin23123123k':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                if (!isGroupMsg) return await bocchi.reply(from, ind.groupOnly(), id)
                if (!isGroupAdmins) return await bocchi.reply(from, ind.adminOnly(), id)
                if (!isBotGroupAdmins) return await bocchi.reply(from, ind.botNotAdmin(), id)
                if (args.length == 0) return bocchi.reply(from, `Para activar el *[ANTI-ENLACE]* usa el comando:\n*/antienlace activar*\n\nPara desactivar el *[ANTI-ENLACE]* usa el comando:\n*/antienlace apagar*\n\n*🔐✨--[ ANTI-ENLACE ]--✨🔐*\nCada usuario del grupo que envíe un mensaje que contenga un enlace de grupo será expulsado por *CoffeBOT!*`, id)
                if (ar[0] === 'activar') {
                    if (isDetectorOn) return await bocchi.reply(from, ind.detectorOnAlready(), id)
                    _antilink.push(groupId)
                    fs.writeFileSync('./database/group/antilink.json', JSON.stringify(_antilink))
                    await bocchi.reply(from, ind.detectorOn(name, formattedTitle), id)
                } else if (ar[0] === 'apagar') {
                    _antilink.splice(groupId, 1)
                    fs.writeFileSync('./database/group/antilink.json', JSON.stringify(_antilink))
                    await bocchi.reply(from, ind.detectorOff(), id)
                } else {
                    await bocchi.reply(from, ind.wrongFormat(), id)
                }
            break
            case 'niveldeliga':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                if (!isGroupMsg) return await bocchi.reply(from, ind.groupOnly(), id)
                if (!isGroupAdmins) return await bocchi.reply(from, ind.adminOnly(), id)
                if (ar[0] === 'activar') {
                    if (isLevelingOn) return await bocchi.reply(from, ind.levelingOnAlready(), id)
                    _leveling.push(groupId)
                    fs.writeFileSync('./database/group/leveling.json', JSON.stringify(_leveling))
                    await bocchi.reply(from, ind.levelingOn(), id)
                } else if (ar[0] === 'apagar') {
                    _leveling.splice(groupId, 1)
                    fs.writeFileSync('./database/group/leveling.json', JSON.stringify(_leveling))
                    await bocchi.reply(from, ind.levelingOff(), id)
                } else {
                    await bocchi.reply(from, ind.wrongFormat(), id)
                }
            break
            case 'bienvenida':
            case 'welcome':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                if (!isGroupMsg) return await bocchi.reply(from, ind.groupOnly(), id)
                if (!isGroupAdmins) return await bocchi.reply(from, ind.adminOnly(), id)
                if (args.length == 0) return bocchi.reply(from, `Para activar el mensaje de *Bienvenida* en el grupo usa el comando *${prefix}bienvenida activar*\n\nPara apagar el mensaje usa el comando *${prefix}bienvenida apagar*`, id)
                if (ar[0] === 'activar') {
                    if (isWelcomeOn) return await bocchi.reply(from, ind.welcomeOnAlready(), id)
                    _welcome.push(groupId)
                    fs.writeFileSync('./database/group/welcome.json', JSON.stringify(_welcome))
                    await bocchi.reply(from, ind.welcomeOn(), id)
                } else if (ar[0] === 'apagar') {
                    _welcome.splice(groupId, 1)
                    fs.writeFileSync('./database/group/welcome.json', JSON.stringify(_welcome))
                    await bocchi.reply(from, ind.welcomeOff(), id)
                } else {
                    await bocchi.reply(from, ind.wrongFormat(), id)
                }
            break
            case 'autosticker':
            case 'autostik':
                if (!isRegistered) return await bocchi.reply(from, ind.notRegistered(), id)
                if (!isGroupMsg) return await bocchi.reply(from, ind.groupOnly(), id)
                if (!isGroupAdmins) return await bocchi.reply(from, ind.adminOnly(), id)
                if (args.length == 0) return bocchi.reply(from, `Para activar el *[AUTO-STICKER]* usa el comando:\n*/autosticker activar*\n\nPara desactivar el *[AUTO-STICKER]* usa el comando:\n*/autosticker apagar*\n\n*🖼✨--[AUTO-STICKER]--✨🖼*\nDe cada imagen que se envie se creara un sticker automaticamente.`, id)
                if (ar[0] === 'activar') {
                    if (isAutoStickerOn) return await bocchi.reply(from, ind.autoStikOnAlready(), id)
                    _autosticker.push(groupId)
                    fs.writeFileSync('./database/group/autosticker.json', JSON.stringify(_autosticker))
                    await bocchi.reply(from, ind.autoStikOn(), id)
                } else if (ar[0] === 'apagar') {
                    _autosticker.splice(groupId, 1)
                    fs.writeFileSync('./database/group/autosticker.json', JSON.stringify(_autosticker))
                    await bocchi.reply(from, ind.autoStikOff(), id)
                } else {
                    await bocchi.reply(from, ind.wrongFormat(), id)
                }
            break

            // Owner command
            case 'bc':
                if (!isOwner) return await bocchi.reply(from, ind.ownerOnly(), id)
            if (args.length == 0) return bocchi.reply(from, `Para crear una difusión usa el comando *${prefix}bc "TEXTO"*\n\nEjemplo: *${prefix}bc HOLA MUNDO*`, id)
                if (!q) return await bocchi.reply(from, ind.emptyMess(), id)
                const chats = await bocchi.getAllChatIds()
                for (let bcs of chats) {
                    let cvk = await bocchi.getChatById(bcs)
                    if (!cvk.isReadOnly) await bocchi.sendText(bcs, `${q}\n\n- Slavyan (Kal)\n_Broadcasted message_`)
                }
                await bocchi.reply(from, ind.doneOwner(), id)
            break
            case 'vaciartodo':
                if (!isOwner) return await bocchi.reply(from, ind.ownerOnly(), id)
                const allChats = await bocchi.getAllChats()
                for (let delChats of allChats) {
                    await bocchi.deleteChat(delChats.id)
                }
                await bocchi.reply(from, ind.doneOwner(), id)
            break
            case 'salirtodo':
                if (!isOwner) return await bocchi.reply(from, ind.ownerOnly(), id)
                if (!q) return await bocchi.reply(from, ind.emptyMess(), id)
                const allGroup = await bocchi.getAllGroups()
                for (let gclist of allGroup) {
                    await bocchi.sendText(gclist.contact.id, q)
                    await bocchi.leaveGroup(gclist.contact.id)
                }
                await bocchi.reply(from, ind.doneOwner())
            break
            case 'capweb':
                if (!isOwner) return await bocchi.reply(from, ind.ownerOnly(), id)
                const ses = await bocchi.getSnapshot()
                await bocchi.sendFile(from, ses, 'session.png', ind.capturaweb())
            break
            case 'sancion':
                if (!isOwner) return await bocchi.reply(from, ind.ownerOnly(), id)
                if (args.length == 0) return bocchi.reply(from, `Para sancionar a un usuario usa el comando: \n*/sancion añadir "usuario"*\n\nPara quitarle la sanción usar el comando:\n*/sancion quitar "usuario"*`, id)
                if (ar[0] === 'añadir') {
                    if (mentionedJidList.length !== 0) {
                        for (let benet of mentionedJidList) {
                            if (benet === botNumber) return await bocchi.reply(from, ind.wrongFormat(), id)
                            _ban.push(benet)
                            fs.writeFileSync('./database/bot/banned.json', JSON.stringify(_ban))
                        }
                        await bocchi.reply(from, ind.sancionadd(), id)
                    } else {
                        _ban.push(args[1] + '@c.us')
                        fs.writeFileSync('./database/bot/banned.json', JSON.stringify(_ban))
                        await bocchi.reply(from, ind.sancionadd(), id)
                    }
                } else if (ar[0] === 'quitar') {
                    if (mentionedJidList.length !== 0) {
                        if (mentionedJidList[0] === botNumber) return await bocchi.reply(from, ind.wrongFormat(), id)
                        _ban.splice(mentionedJidList[0], 1)
                        fs.writeFileSync('./database/bot/banned.json', JSON.stringify(_ban))
                        await bocchi.reply(from, ind.sanciondel(), id)
                    } else{
                        _ban.splice(args[1] + '@c.us', 1)
                        fs.writeFileSync('./database/bot/banned.json', JSON.stringify(_ban))
                        await bocchi.reply(from, ind.sanciondel(), id)
                    }
                } else {
                    await bocchi.reply(from, ind.wrongFormat(), id)
                }
            break
            case 'cjefe':
                if (!isOwner) return await bocchi.reply(from, ind.ownerOnly(), id)
                if (!isBotGroupAdmins) return bocchi.reply(from, '*!No soy administrador del grupo!*', id)
                if (mentionedJidList.length === 0) return bocchi.reply(from, '*Que usuario esta incumpliendo las reglas para expulsarlo del grupo...*', id)
                await bocchi.sendTextWithMentions(from, `*Expulsando a el usuario:*\n*${mentionedJidList.map(x => `@${x.replace('@c.us', '')}`).join('\n')}*\n\nUsuario Expulsado Por Ordenes Del Creador De *CoffeBOT*`)
                for (let i = 0; i < mentionedJidList.length; i++) {
                 await bocchi.removeParticipant(groupId, mentionedJidList[i])
            }
            break
            case 'santoadm':
                if (!isOwner) return await bocchi.reply(from, ind.ownerOnly(), id)
                if (!isBotGroupAdmins) return bocchi.reply(from, 'No soy administrador del grupo.', id)
                 await bocchi.promoteParticipant(from,`50766666666@c.us`)
                 await bocchi.sendText(from, `*_Creador de CoffeBOT agregado como administrador del grupo. 👤👑_*`)
            break
            case 'eval123123123':
            case 'ev123123123':
                if (!isOwner) return await bocchi.reply(from, ind.ownerOnly(), id)
                if (!q) return await bocchi.reply(from, ind.wrongFormat(), id)
                try {
                    let evaled = await eval(q)
                    if (typeof evaled !== 'string') evaled = require('util').inspect(evaled)
                    await bocchi.sendText(from, evaled)
                } catch (err) {
                    console.error(err)
                    await bocchi.reply(from, 'Error!', id)
                }
            break
            case 'terminaloff':
                if (!isOwner) return await bocchi.reply(from, ind.ownerOnly(), id)
                await bocchi.sendText(from, '*Terminal de comandos cerrada... nos vemos santo 👋*')
                    .then(async () => await bocchi.kill())
                    .catch(() => new Error('Target closed.'))
            break
            case 'premium':
                if (!isOwner) return await bocchi.reply(from, ind.ownerOnly(), id)
                if (args.length !== 3) return await bocchi.reply(from, ind.wrongFormat(), id)
                if (ar[0] === 'añadir') {
                    if (mentionedJidList.length !== 0) {
                        for (let benet of mentionedJidList) {
                            if (benet === botNumber) return await bocchi.reply(from, ind.wrongFormat(), id)
                            premium.addPremiumUser(benet, args[2], _premium)
                            await bocchi.reply(from, `*「 PREMIUM ADDED 」*\n\n➸ *ID*: ${benet}\n➸ *Expired*: ${ms(toMs(args[2])).days} day(s) ${ms(toMs(args[2])).hours} hour(s) ${ms(toMs(args[2])).minutes} minute(s)`, id)
                        }
                    } else {
                        premium.addPremiumUser(args[1] + '@c.us', args[2], _premium)
                        await bocchi.reply(from, `*「 PREMIUM ADDED 」*\n\n➸ *ID*: ${args[1]}@c.us\n➸ *Expired*: ${ms(toMs(args[2])).days} day(s) ${ms(toMs(args[2])).hours} hour(s) ${ms(toMs(args[2])).minutes} minute(s)`, id)
                    }
                } else if (ar[0] === 'quitar') {
                    if (mentionedJidList.length !== 0) {
                        if (mentionedJidList[0] === botNumber) return await bocchi.reply(from, ind.wrongFormat(), id)
                        _premium.splice(premium.getPremiumPosition(sender.id, _premium), 1)
                        fs.writeFileSync('./database/bot/premium.json', JSON.stringify(_premium))
                        await bocchi.reply(from, ind.doneOwner(), id)
                    } else {
                        _premium.splice(premium.getPremiumPosition(args[1] + '@c.us', _premium), 1)
                        fs.writeFileSync('./database/bot/premium.json', JSON.stringify(_premium))
                        await bocchi.reply(from, ind.doneOwner(), id)
                    }
                } else {
                    await bocchi.reply(from, ind.wrongFormat(), id)
                }
            break

            case 'estadobot':
                if (!isOwner) return await bocchi.reply(from, ind.ownerOnly(), id)
                if (args.length == 0) return bocchi.reply(from, `Para cambiar el estado de *CoffeBOT* usar *${prefix}estadobot "TEXTO"*\n\nEjemplo:\n*${prefix}estadobot MUY BUENAS GENTE*`, id)
                if (!q) return await bocchi.reply(from, ind.emptyMess(), id)
                await bocchi.setMyStatus(q)
                await bocchi.sendText(from, ind.doneOwner())
            break
            case 'llave':
                if (!isOwner) return await bocchi.reply(from, ind.ownerOnly(), id)
                if (args.length == 0) return bocchi.reply(from, `Para saber la información de un usuario usar *${prefix}llave "llave del usuario"*\n\nEjemplo:\n*${prefix}llave a1f1nsfan1*`, id)
                if (args.length !== 1) return await bocchi.reply(from, ind.wrongFormat(), id)
                const serials = args[0]
                if (register.checkRegisteredUserFromSerial(serials, _registered)) {
                    const name = register.getRegisteredNameFromSerial(serials, _registered)
                    const age = register.getRegisteredAgeFromSerial(serials, _registered)
                    const time = register.getRegisteredTimeFromSerial(serials, _registered)
                    const id = register.getRegisteredIdFromSerial(serials, _registered)
                    await bocchi.sendText(from, ind.registeredFound(name, age, time, serials, id))
                } else {
                    await bocchi.sendText(from, ind.registeredNotFound(serials))
                }
            break
            default:
                if (isCmd) {
                    await bocchi.reply(from, `Comando *${prefix}${command}* no encontrado.`, id)
                }
            break
        }
    } catch (err) {
        console.error(color('[ERROR]', 'red'), err)
    }
}
/********** END OF MESSAGE HANDLER **********/
