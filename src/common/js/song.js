import { getLyric, getComment } from 'api/lyric.js'
export default class Song {
    constructor({ id, mid, singer, name, album, duration, image, url }) {
        this.id = id
        this.mid = mid
        this.singer = singer
        this.name = name
        this.album = album
        this.duration = duration
        this.image = image
        this.url = url
    }

    _getLyric() {
        if (this.lyric) { //有时需要将现有对象转为 Promise 对象，Promise.resolve()方法就起到这个作用
            return Promise.resolve(this.lyric)
        }
        return new Promise((resolve, reject) => {
            getLyric(this.id).then((res) => {
                resolve(res)
            }).catch((err) => {
                reject(err)
            })
        })
    }
    _getComment() {
        if (this.comment) {
            return Promise.resolve(this.comment)
        }
        return new Promise((resolve, reject) => {
            getComment(this.id).then((res) => {
                resolve(res)
            }).catch((err) => {
                Toast('没有评论')
                reject(err)
            })
        })
    }
}

export const createSong = (musicData) => {
    return new Song({
        id: musicData.id,
        mid: musicData.mid,
        singer: musicData.singer,
        name: musicData.name,
        album: musicData.album,
        duration: musicData.duration,
        image: musicData.image,
        url: genSongPlayUrl(musicData.id)
    })
}

const genSongPlayUrl = (id) => {
    return `https://music.163.com/song/media/outer/url?id=${id}.mp3`
}