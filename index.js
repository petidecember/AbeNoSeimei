'use strict';

const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

let maxCleanUpTimer = 5;
let maxMantraTimer = 2;
let spamTrigger = 3;
let spammedOnes = new Map();

let quotes = [
    'Within this virgin of cold ore, who shall swallow even your screams with her embrace, suffer in anguish as your entire body is stabbed and skewered! <@{0}>',

    'I call upon the power of the Dark Lordis and I invite the great demons, you may enter <@{0}>',

    'Belial, Behemoth, Beelzebub, Asmodeus, Satanas, Lucifer, <@{0}>',

    'In the name of <@{0}>, monarch of the globe, and the sovereign of the world, the chief of safes, the satanic chants commands the forces of the dimness to bequeath thy inner supremacy upon us.',

    'To <@{0}>, giver of youth and happiness. Come, almighty eternal devil!',

    'O Blessed One, <@{0}>, precious treasury of compassion, bestower of supreme inner peace',

    'With folded hands I turn to you, supreme unchanging friend, I request from the depths of my heart: Git yer fokin arse here, <@{0}>!',

    'Mount <@{0}>, glorious mountain at the centre of the world, may all beings enjoy it as the field supreme.',

    'On every atom is found a <@{0}>',

    'Oh <@{0}> oh <@{0}> I call you forth to me, in 1 night its you I shall see, oh <@{0}> oh <@{0}> come join me.',

    'They are rage, brutal, without mercy. But you, <@{0}>. You will be worse. Rip and tear, until it is done.',
    
    'Fun Fact #1: Just because you\'re correct doesn\'t mean you are right, <@{0}>',

    'Fun Fact #2: <@{0}>, did you know? People die if they are killed!',

    'Fun Fact #3: A dead person is already dead, so you can\'t kill it, <@{0}>',
    
    'Fun Fact #4: <@{0}> is so stupid he\'d forget to die from something like being killed!',
    
    'Fun Fact #5: Fun things are fun, <@{0}>!',
    
    'Fun Fact #666: I will come and rape you tonight, <@{0}>',

    'Take this chip... and eat it <@{0}>!',

    'Hey Mister <@{0}>... I\'m a mad scientist. It\'s so coooor. sonuvabitch',

    'It\'s bargain day at the supermarket <@{0}>',

    'Griffith did nothing wrong, <@{0}>',

    'Quick, <@{0}>! Use your trusty frying pan as a drying pan!',

    '<@{0}> rolled a D20',

    'https://i3.kym-cdn.com/photos/images/original/000/666/867/e67.png <@{0}>',

    'YOU THOUGHT IT WAS DIO, BUT IT\'S <@{0}>'
];

let backbuffer = [];
console.log(quotes.length)

function randomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

String.prototype.format = function() {
    var formatted = this;
    for (var i = 0; i < arguments.length; i++) {
        var regexp = new RegExp('\\{'+i+'\\}', 'gi');
        formatted = formatted.replace(regexp, arguments[i]);
    }
    return formatted;
};

setInterval(() => {
    spammedOnes.forEach((val, key) => {
        if (val["spamCounter"] >= spamTrigger) {
            val["mantraTimer"]--;
        }
        else {
            val["cleanUpTimer"]--;
        }
    
        if(!val["cleanUpTimer"]) {
            if(spammedOnes.delete(key))
                console.log("Cleaned");
            else
                console.log("!Cleaned");
        }
        else if(!val["mantraTimer"]) {
            let idx = randomInt(quotes.length);
            let quote = quotes.splice(idx, 1)[0];
            backbuffer.push(quote);

            if(quotes.length === 0) {
                let temp = quotes;
                quotes = backbuffer;
                backbuffer = temp;
            }

            val["msg"].channel.send(quote.format(key));
            spammedOnes.delete(key);
        }
    })
}, 1000);

client.on('message', msg => {
    if (msg.author.bot)
        return;
    
    msg.mentions.members.forEach(member => {
        if(spammedOnes.has(member.id)) {
            let user = spammedOnes.get(member.id);
            user["spamCounter"]++;
            user["mantraTimer"] = maxMantraTimer;
        }
        else {
            spammedOnes.set(member.id, {
                msg: msg,
                spamCounter: 1,
                cleanUpTimer: maxCleanUpTimer,
                mantraTimer: maxMantraTimer
            });
        }
    });
});

client.login(process.env.DISCORD_KEY);