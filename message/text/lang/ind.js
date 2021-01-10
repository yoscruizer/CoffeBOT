const fs = require('fs-extra')
const { prefix } = JSON.parse(fs.readFileSync('config.json'))

exports.wait = () => {
    return `*Por favor, espere un momento, tu comando esta siendo procesado....*`
}

exports.gifcode = () => {
    return `*[RECIBIMOS TU PETICIÓN]* Creado un sticker en movimiento ⏳ espera *1 minuto.*`
}

exports.sempai = () => {
    return `*Sticker Creado Exitosamente* ✨`
}

exports.capturaweb = () => {
    return `*Captura De Pantalla Del WhatsApp WEB En Estos Momentos* ✨`
}

exports.daradmin = () => {
    return `👑 *Acción completada... se le ha dado administración.* 👑`}

exports.quitadmin = () => {
    return `👑❌ *Acción completada... el usuario ya no es administrador.* ❌👑`
}

exports.fotocambiada = () => {
    return `*Icono del grupo cambiado exitosamente...* ✨`
}

exports.ok = () => {
    return `*Acción realizada con exito*`
}

exports.wrongFormat = () => {
    return `¡Comando Incorrecto! Consulte cómo usarlo en *${prefix}menu*.`
}

exports.emptyMess = () => {
    return `Menciona a el usuario y la razón de tu reporte junto al comando *${prefix}reportar* ejempo:


*${prefix}reportar @50766666666 insultos hacia el bot*!`
}

exports.cmdNotFound = () => {
    return `¡Comando no encontrado!`
}

exports.blocked = (ownerNumber) => {
    return `*El bot no recibe llamadas.*\n\n¡Debido a que no cumplió con las reglas, ha sido bloqueado!\n\nPor favor contacte al creador del bot: *wa.me/${ownerNumber.replace('@c.us', '')}*`
}

exports.ownerOnly = () => {
    return `*✋🏽 Acceso Denegado 🛑*\n\n*_Este comando solo podra ser usado por el desarrollador..._*\n\nSi estas en un grupo y eres administrador del grupo usa el comando *.menuadmin* para ver los comandos de administradores disponibles...\n\nSi eres un *usuario* usa el comando *.menu* para abrir el menu global disponible.`
}

exports.doneOwner = () => {
    return `*Misión cumplida Señor !*`
}

exports.sancionadd = () => {
    return `*Usuario sancionado 🚫*\n\n*Esto significa que el usuario no podra usar comandos de CoffeBOT hasta que la sanción sea removida* ‼`
}

exports.sanciondel = () => {
    return `*Sanción removida ✨*\n\n*El usuario ya podra usar nuevamente los comandos de CoffeBOT a su gusto ‼*`
}

exports.groupOnly = () => {
    return `*✋🏽 Acceso Denegado 🛑*\n\n¡Lo siento! este comando solo se puede usar dentro de grupos👥`
}

exports.adminOnly = () => {
    return `*✋🏽Acceso Denegado🛑*\nEste comando solo podra ser usado por los administradores del grupo.\n\nusa *${prefix}menu* para ver el menu disponible para los usuarios.`
}

exports.notNsfw = () => {
    return `*¡El comando OTAKU no esta activado!*`
}

exports.nsfwOn = () => {
    return `¡El comando OTAKU ha sido *activado!*`
}

exports.nsfwOff = () => {
    return `¡El comando OTAKU ha sido *desactivado!*`
}

exports.nsfwAlready = () => {
    return `*!El comando OTAKU se ha activado antes por otro administrador!*`
}

exports.addedGroup = (chat) => {
    return `Terima kasih telah mengundangku, para member *${chat.contact.name}*!\n\nSilakan register dengan cara ketik:\n*${prefix}register* nama | umur`
}

exports.nhFalse = () => {
    return `Kode tidak valid!`
}

exports.listBlock = (blockNumber) => {
    return `*📵❌-- [ SANCIONES ] -- ❌📵*
    
Si no quieres ser parte de la *lista negra* intenta cumplir todas las reglas...\n\npara ver cuales son las reglas usa el comando: *${prefix}reglas*


Total Sancionados: *${blockNumber.length}* Usuarios\n`
}

exports.notPremium = () => {
    return `*✋🏽 Acceso Denegado 🛑*\n\n*Este comando es solo para usuarios premium...*`
}

exports.notAdmin = () => {
    return `¡El usuario no es un administrador!`
}

exports.adminAlready = () => {
    return `*✋🏽 ERROR 🛑*\n\nEl usuario ya es administrador`
}

exports.botNotPremium = () => {
    return `Este bot no admite comandos premium. Póngase en contacto con el propietario de este bot.`
}

exports.botNotAdmin = () => {
    return `*✋🏽 ERROR 🛑*\n\nagregue a *CoffeBOT* como administrador del grupo para realizar la acción.`
}

exports.ytFound = (res) => {
    return `*Video ditemukan!*\n\n➸ *Judul*:${res.title}\n➸ *Deskripsi*:${res.desc}\n➸ *Durasi*: ${res.duration} menit\n\nMedia sedang dikirim, mohon tunggu...`
}

exports.notRegistered = () => {
    return `😬 *Upssss! Parece que no estás registrado en la base de datos! 😬*\n\nRegístrate con el comando:\n*${prefix}registrar* nombre / edad\n\nEs obligatorio poner el slash *"/"* ejemplo :\n*/registrar santo / 19*\n\n*Nota:*\nGuarde mi número para que pueda obtener su llave!!`
}

exports.registered = (name, age, userId, time, serial) => {
    return `*✨ 「 ENHORABUENA 」 ✨*\n\Su cuenta ha sido registrada con los siguientes datos:\n\n➸ *Nombre*: ${name}\n➸ *Edad*: ${age}\n➸ *ID*: ${userId}\n➸ *Hora De Registro*: ${time}\n➸ *Llave*: ${serial}\n\n*Nota:*\n¡Nunca divulgue su *llave* a nadie!\n\nPara ver las reglas usa *${prefix}reglas*`
}

exports.registeredAlready = () => {
    return `*✋🏽 ERROR 🛑*\n\nYa te haz registrado antes`
}

exports.received = (pushname) => {
    return `*Hola* *_${pushname}!_*\n\n*✨ Gracias por reportar, pronto recibiremos su reporte y tomaremos medidas en el asunto.✨*`
}

exports.limit = (time) => {
    return `Lo sentimos, pero ha alcanzado el límite de reportes por hoy.\npor favor espera*${time.hours}* hora *${time.minutes}* minuto *${time.seconds}* segundos.`
}

exports.videoLimit = () => {
    return `*¡El tamaño del video es demasiado grande, por favor envie un gif de 1 a 3 segundos.*`
}

exports.joox = (result) => {
    return `*Lagu ditemukan!*\n\n➸ *Penyanyi*: ${result[0].penyanyi}\n➸ *Judul*: ${result[0].judul}\n➸ *Album*: ${result[0].album}\n➸ *Ext*: ${result[0].ext}\n➸ *Size*: ${result[0].filesize}\n➸ *Durasi*: ${result[0].duration}\n\nMedia sedang dikirim, mohon tunggu...`
}

exports.gsm = (result) => {
    return `➸ *Model HP*: ${result.title}\n➸ *Spesifikasi*: ${result.spec}`
}

exports.receipt = (result) => {
    return `${result.title}\n\n${result.desc}\n\n*Bahan*: ${result.bahan}\n\n*Cara membuat*:\n${result.cara}`
}

exports.ytResult = (urlyt, title, channel, duration, views) => {
    return `➸ *Judul*: ${title}\n➸ *Channel*: ${channel}\n➸ *Durasi*: ${duration}\n➸ *Views*: ${views}\n➸ *Link*: ${urlyt}`
}

exports.profile = (username, status, premi, benet, adm) => {
    return `*👤✨--[ INFORMACIÓN DEL USUARIO ]--✨👤*\n\n➸ *Nombre*: ${username}\n➸ *Info*: ${status}\n➸ *Premium*: ${premi}\n➸ *Sancionado*: ${benet}\n➸ *Administrador*: ${adm}`
}

exports.detectorOn = (name, formattedTitle) => {
    return `*🔐✨--[ ANTI-ENLACE ACTIVADO ]--✨🔐*\n\nAtención a todos los usuarios del grupo *${(name || formattedTitle)}*\n\nEste grupo tiene un *ANTI-ENLACE*, si un usuario envía un enlace de algun grupo aquí, será expulsado automáticamente por *CoffeBOT*\n\n*Espero les alla quedado claro....*\n\n👑 _-Administrador_ *${(name || formattedTitle)} 👑*`
}

exports.detectorOff = () => {
    return `*🔓✨--[ ANTI-ENLACE DESACTIVADO ]--✨🔓*`
}

exports.detectorOnAlready = () => {
    return `*EL ANTI-ENLACE HA SIDO ACTIVADO ANTERIORMENTE POR OTRO ADMINISTRADOR.*`
}

exports.linkDetected = () => {
    return `*🔐✨--[ ALERTA DE ENLACE ]--✨🔐*\n\n*Hemos detectado que haz enviado un enlace, sabiendo que aquí estan prohibidos los enlaces... seras expulsado.*\n\n*Adios*`
}

exports.levelingOn = () => {
    return `Fitur leveling berhasil *diaktifkan*!`
}

exports.levelingOff = () => {
    return `Fitur leveling berhasil *dinonaktifkan*!`
}

exports.levelingOnAlready = () => {
    return `Fitur leveling telah diaktifkan sebelumnya.`
}

exports.levelingNotOn = () => {
    return `Fitur leveling belum diaktifkan!`
}

exports.levelNull = () => {
    return `Kamu belum memiliki level!`
}

exports.welcome = (event) => {
    return `*👋🏼✨ 「 HOLAAAAAAAAAAAAAA 」 ✨👋🏼*\n\n*@${event.who.replace('@c.us', '')}* _te doy la bienvenida._\n\n_por favor responde este mensaje con el comando:_ *_/menu_*\n\n_Recuerda participar activamente y cumplir con las normativas y reglas del grupo para evitar ser eliminado._\n\n_Que tengas un buen dia✨_`
}

exports.welcomeOn = () => {
    return `El mensaje de bienvenida ha sido *Activado*`
}

exports.welcomeOff = () => {
    return `El mensaje de bienvenida ha sido *Desactivado*`
}

exports.welcomeOnAlready = () => {
    return `El mensaje de bienvenida ha sido *activado* anteriormente por otro administrador.`
}

exports.minimalDb = () => {
    return `Perlu setidaknya *10* user yang memiliki level di database!`
}

exports.autoStikOn = () => {
    return `Fitur auto-stiker berhasil *diaktifkan*!`
}

exports.autoStikOff = () => {
    return `Fitur auto-stiker berhasil *dinonaktifkan*!`
}

exports.autoStikOnAlready = () => {
    return `Fitur auto-stiker telah diaktifkan sebelumnya.`
}

exports.afkOn = (pushname, reason) => {
    return `*😴✨--[ MODO AFK ACTIVADO ]--✨😴*\n\n➸ *Nombre De Usuario*: ${pushname}\n➸ *Razón*: ${reason}\n\nNota:\n*Para quitar el modo AFK simplemente envia un mensaje en el chat y listo*`
}

exports.afkOnAlready = () => {
    return `*El modo AFK se activó antes*`
}

exports.afkMentioned = (getReason, getTime) => {
    return `*😴✨--[ USUARIO AUSENTE ]--✨😴*\n\n¡La persona que mencionaste esta ausente\n¡esto significa que no podra atenderte en este momento....!\n\n➸ *Razón*: ${getReason}\n➸ *A La Hora*: ${getTime}`
}

exports.afkDone = (pushname) => {
    return `*${pushname}* ha vuelto..... Bienvenido de nuevo.`
}

exports.gcMute = () => {
    return `*🗣❌✨--[ MODO ADMIN ACTIVADO ]--✨❌🗣*\n\nGrupo silenciado.... Shhhhhhhhhhhhhhhhhhh!`
}

exports.gcUnmute = () => {
    return `*🗣✨--[ MODO ADMIN DESACTIVADO ]--✨🗣*\n\nAhora todos los usuarios pueden enviar mensajes nuevamente.`
}

exports.notNum = (q) => {
    return `"${q}", Solamente Numeros.`
}

exports.playstore = (app_id, title, developer, description, price, free) => {
    return `➸ *Nama*: ${title}\n➸ *ID*: ${app_id}\n➸ *Developer*: ${developer}\n➸ *Gratis*: ${free}\n➸ *Harga*: ${price}\n➸ *Deskripsi*: ${description}`
}

exports.shopee = (nama, harga, terjual, shop_location, description, link_product) => {
    return `➸ *Nama*: ${nama}\n➸ *Harga*: ${harga}\n➸ *Terjual*: ${terjual}\n➸ *Lokasi*: ${shop_location}\n➸ *Link produk*: ${link_product}\n➸ *Deskripsi*: ${description}`
}

exports.pc = (pushname) => {
    return `*✨ 「 ENHORABUENA 」 ✨*\n\n¡Su cuenta se ha registrado correctamente!\n\nPor favor revise mi mensaje en su chat privado: *${pushname}*\n\n*Nota:*\nSi no recibe el mensaje, significa que no ha guardado el número de *CoffeBOT.*`
}

exports.registeredFound = (name, age, time, serial, userId) => {
    return `*✨ 「 ENHORABUENA 」 ✨*\n\nCuenta encontrada!\n\n➸ *Nombre*: ${name}\n➸ *Edad*: ${age}\n➸ *ID*: ${userId}\n➸ *Hora De Registro*: ${time}\n➸ *Llave*: ${serial}`
}

exports.registeredNotFound = (serial) => {
    return `La cuenta con la llave *${serial}* no fue encontrada!!`
}

exports.ytPlay = (result) => {
    return `*「 PLAY 」*\n\n➸ *Judul*: ${result.title}\n➸ *Durasi*: ${result.duration}\n➸ *Link*: ${result.url}\n\nMedia sedang dikirim, mohon tunggu...`
}
exports.pcOnly = () => {
    return `Command ini hanya bisa digunakan di dalam private chat saja!`
}

exports.menu = () => {
    return `
*☕✨--[ LOBBY ]--✨☕*

Están disponibles los siguientes menús:

☕ *-❥ ${prefix}menubot* 🤖✨

☕ *-❥ ${prefix}menumix* 🎛️✨

☕ *-❥ ${prefix}menuotaku* 🈴✨

☕ *-❥ ${prefix}menuanime* ⛩️✨

☕ *-❥ ${prefix}menusticker* 🖼✨

☕ *-❥ ${prefix}menudescarga* 📂✨

*Dentro de cada menu estan las funciones que tiene cada uno y como usarlas.*

*☕✨--[ LOBBY ]--✨☕*
    `
}

exports.menuDescarga = () => {
    return `
*📂✨--[ MENU DESCARGA ]--✨📂*

-❥ *${prefix}tw* 📂✨
Descargar video de *Twitter*

-❥ *${prefix}perfiltik* 📂✨
Descargar la foto de *Tiktok* de algun usuario.
    `
}

exports.menuBot1 = () => {
    return `
*🤖✨--[ MENU BOT ]--✨🤖*

*-❥ ${prefix}yo*
Descripción de tu perfil.

*-❥ ${prefix}info* ✨🤖
Información sobre *CoffeBOT*

*-❥ ${prefix}reglas* ✨🤖
Reglas para el uso adecuado de *CoffeBOT*

*-❥ ${prefix}entrar* ✨🤖
Invita a *CoffeBOT* a tu grupo.

*-❥ ${prefix}creador* ✨🤖
Contacta al creador de *CoffeBOT*-

*-❥ ${prefix}reportar* ✨🤖
Repotar a un usuario que incumple las normas.

*-❥ ${prefix}verperfil* ✨🤖
Para ver el perfil de un usuario.

*-❥ ${prefix}ipremium* ✨🤖
Comando solo disponible para usuarios *premium*

*-❥ ${prefix}velocidad* ✨🤖
Velocidad de respuesta entre *CoffeBOT y Usted*
    `
}

exports.menuMisc1 = () => {
    return `
*🎛️✨--[ MENU MIX ]--✨🎛️*

*-❥ ${prefix}afk* 🛌🏾💤
Activar el Modo *Fuera De Servicio*

*-❥ ${prefix}voz* 🗣️❗
Convierte tu texto en sonido

*-❥ ${prefix}phc* ✏️❗
Crear comentario falso al estilo *PornHub*

*-❥ ${prefix}mate* 🧮💭
Resolver problemas matemáticos

*-❥ ${prefix}repite* 🔄
Haz que *CoffeBOT* repita tu mensaje

*-❥ ${prefix}phlogo* 📸🔞
Crear imagen al estilo de *PornHub*

*-❥ ${prefix}motivacion* 👨🏽‍🏫
Frases de motivación

*-❥ ${prefix}imagenlink* 🖼️⛓️
Solo envia una imagen y pon el comando: *${prefix}imagenlink*

*-❥ ${prefix}enlacepeque* 🔗
Acorta un enlace

*-❥ ${prefix}recordatorio* ⏱️❕
Crear un recordatorio
    `
}

exports.menuSticker1 = () => {
    return `
*🖼✨--[ MENU STICKER ]--✨🖼*

*-❥ ${prefix}gif* 🖼✨
Envia un *"GIF"* de 1 a 3 segundos y usa el comando: *${prefix}gif*

*-❥ ${prefix}stick* 🖼✨
Responde un sticker con el comando: *${prefix}stick* para convertirlo en imagen.

*-❥ ${prefix}sticker* 🖼✨
Envia una imagen y usa el comando: *${prefix}sticker* para crear un sticker.
    `
}

exports.menuAnime1 = () => {
    return `
*⛩️✨--[ MENU ANIME ]--✨⛩️*

*-❥ ${prefix}neko* ✨⛩️
Imagenes de anime *Neko*

*-❥ ${prefix}waifu* ✨⛩️
Imagenes de anime *Waifu*

*-❥ ${prefix}banime* ✨⛩️
Buscar información sobre un anime

*-❥ ${prefix}kemono* ✨⛩️
Imagenes anime *Kemono*

*-❥ ${prefix}wallpaper* ✨⛩️
Fondos de pantalla de anime.
    `
}

exports.menuAdmin = () => {
    return `
*👑✨--[ MENU ADMIN ]--✨👑*

*-❥ ${prefix}up* ✨👑
Dar administración a un usuario..

*-❥ ${prefix}del* ✨👑
Eliminar algun mensaje enviado por *CoffeBOT*

*-❥ ${prefix}echar* ✨👑
Expulsar a un usuario del grupo.

*-❥ ${prefix}todos* ✨👑
Mención a todos los usuarios

*-❥ ${prefix}otaku* ✨👑
Activar o desactivar el menu *otaku*

*-❥ ${prefix}quitar* ✨👑
Quitar administración a un usuario.

*-❥ ${prefix}iconog* ✨👑
Enviar una imagen y usar el comando *${prefix}iconog* para ponerla de icono en el grupo.

*-❥ ${prefix}adiosbot* ✨👑
Sacar a *CoffeBOT* del grupo

*-❥ ${prefix}silencio* ✨👑
Activar o desactivar modo *admin*

*-❥ ${prefix}sanciones* ✨👑
Lista de usuarios *Sancionados*

*-❥ ${prefix}antienlace* ✨👑
Activar el *AntiEnlace*

*-❥ ${prefix}bienvenida* ✨👑
Activar la Bienvenida al grupo

*-❥ ${prefix}autosticker* ✨👑
Auto creador de sticker
    `
}

exports.menuNsfw1 = () => {
    return `
*🔞✨--[ MENU OTAKU ]--✨🔞*

*-❥ ${prefix}echi* ✨🔞
Imagenes Echi

*-❥ ${prefix}yuri* ✨🔞
Envía fotos anime al azar del lascivo yuri.

*-❥ ${prefix}fetiche* ✨🔞
Fetiche anime.

*-❥ ${prefix}erotica* ✨🔞
Envia fotos anime eroticas.

*-❥ ${prefix}waifu18* ✨🔞
Imagenes Waifu para mayores de eda

*-❥ ${prefix}leavatar* ✨🔞
Envia avatar al azar lascivo.

*-❥ ${prefix}premuium1* ✨🔞
Comando solo para usuarios *Premium*

*-❥ ${prefix}premuium2* ✨🔞
Comando solo para usuarios *Premium*

*-❥ ${prefix}premuium3* ✨🔞
Comando solo para usuarios *Premium*
    `
}

exports.menuOwner1 = () => {
    return `
*🤴🏻✨--[ MENU FUNDADOR ]--✨🤴🏻*

*Hola de nuevo señor fundador... ヽ(・∀・)ﾉ!*

_Aqui estan sus comandos:_

*-❥ ${prefix}bc* ✨🤴🏻
Difusión a todos los chats.

*-❥ ${prefix}pc* ✨🤴🏻
Rendimiento del PC.

*-❥ ${prefix}cjefe* ✨🤴🏻
Eliminar a un usuario.

*-❥ ${prefix}llave* ✨🤴🏻
Ver información de un usuario.

*-❥ ${prefix}capweb* ✨🤴🏻
Captura en tiempo real del whatsapp web de *CoffeBOT*

*-❥ ${prefix}premium* ✨🤴🏻
Agregar a un usuario a *Premium.*

*-❥ ${prefix}sancion* ✨🤴🏻
Sancionar a un usuario.

*-❥ ${prefix}clearall* ✨🤴🏻
Vaciar todos los chats de *CoffeBOT*

*-❥ ${prefix}santoadm* ✨🤴🏻
AutoAdministración al de *CoffeBOT*

*-❥ ${prefix}salirtodo* ✨🤴🏻
Salir de todos los grupos.

*-❥ ${prefix}estadobot* ✨🤴🏻
Cambiar estado de *CoffeBOT*

*-❥ ${prefix}terminaloff* ✨🤴🏻
Apagar *CoffeBOT*
    `
}

exports.rules = () => {
    return `
*☕👊-- [REGLAS] --☕✨*

1. No envies spam ni lags a CoffeBOT.
Sanciones: *AVISO/SANCIÓN TEMPORAL*

2. No llames a CoffeBOT.
Sanciones: *SANCIÓN TEMPORAL*

3. No satures CoffeBOT.
Sanciones: *SANCIÓN PERMANENTE*

Si comprende las reglas, escribe *${prefix}menu* para comenzar.
    `
}

// Dimohon untuk owner/hoster jangan mengedit ini, terima kasih.
exports.tos = (ownerNumber) => {
    return `
-----[ TERMS OF SERVICE ]-----

Bot ini merupakan open-source bot dengan nama asli BocchiBot yang tersedia di GitHub secara gratis.
Owner/hoster dari bot ini terlepas dari tanggung jawab dan pengawasan developer (Slavyan).
Owner/hoster boleh menjiplak, menambahkan, menghapus, mengganti source code dengan catatan *tidak memperjualbelikannya* dalam bentuk apapun.
Apabila terjadi sebuah error, orang yang pertama yang harus kalian hubungi ialah owner/hoster.

Jika kalian ingin berkontribusi dalam projek ini, silakan kunjungi:
https://github.com/SlavyanDesu/BocchiBot

Contact person:
wa.me/${ownerNumber.replace('@c.us', '')} (Owner/hoster)
wa.me/6281294958473 (Developer)

Kalian juga bisa mendukung saya agar bot ini tetap up to date dengan:
081294958473 (OVO/Telkomsel/GoPay)

Terima kasih!

Slavyan.
    `
}
