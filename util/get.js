import fs from 'fs'
import ax from './ax.js'
import protobufjs from "protobufjs";
import path from "path";
import cc from './cocos2d-js-min'


let url1 = 'https://cat-match.easygame2021.com/sheep/v1/game/personal_info?t='
let url2 = 'https://cat-match.easygame2021.com/sheep/v1/game/skin/info'
let url3 = 'https://cat-match.easygame2021.com/sheep/v1/game/map_info_ex?matchType=3'
let url4 = 'https://cat-match-static.easygame2021.com/maps/'
let url5 = 'https://cat-match.easygame2021.com/sheep/v1/game/topic/game_start'
let url6 = 'https://cat-match.easygame2021.com/sheep/v1/game/topic/game_join?'
let url7 = 'https://cat-match.easygame2021.com/sheep/v1/game/topic/rank'
let url8 = 'https://cat-match.easygame2021.com/sheep/v1/game/topic/info'

let urlmap = {
    me: url1,
    skin: url2,
    match: url3,
    map: url4,
    topic: url5,
    t_join: url6,
    t_rank: url7,
    t_info: url8,
}

let argv = process.argv[2]
let url = urlmap[argv]
if (url) {
    let req
    if (argv == 'map') {
        let str = fs.readFileSync('data/match')
        let match = JSON.parse(str)
        let name = match.data.map_md5[1] + '.map'
        url += name
        console.log(url)
        // console.log(axios.defaults.headers)
        req = ax.get(url, {
            'headers': {
                'Host': ''
            }
        })
    } else if (argv == 't_join') {
        let t = process.argv[3] || 2 //1=left, 2=right
        req = ax.post(url, {'type': parseInt(t)})
    } else {
        req = ax.get(url)
    }
    req.then((resp) => {
        console.log(resp.data)
        fs.writeFileSync('./data/' + argv, JSON.stringify(resp.data))
        console.log(new Date())
        if (argv == 'topic') {
            fs.writeFileSync('./data/match', JSON.stringify(resp.data))
            console.log('sync topic to match..')
        }
    }).catch(e => {
        console.log(e)
    })
}


function toUint8Arr(str) {
    const buffer = [];
    for (let i of str) {
        const _code = i.charCodeAt(0);
        if (_code < 0x80) {
            buffer.push(_code);
        } else if (_code < 0x800) {
            buffer.push(0xc0 + (_code >> 6));
            buffer.push(0x80 + (_code & 0x3f));
        } else if (_code < 0x10000) {
            buffer.push(0xe0 + (_code >> 12));
            buffer.push(0x80 + (_code >> 6 & 0x3f));
            buffer.push(0x80 + (_code & 0x3f));
        }
    }
    return Uint8Array.from(buffer);
}