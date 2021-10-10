const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const player = $('.player')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const progress = $('#progress')
const PLAYER_STORAGE_KEY = 'Dang_Music'

const cd = $('.cd');
const playBtn = $('.btn-toggle-play')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')

const app = {
    currentIndex: 0,
    isPlaying: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    isRandom: false,
    isRepeat: false,
    songs: [
        {
            name: 'Bài Này Chill Phết',
            singer: 'Đen',
            path: './assets/songs/bainaychillphet.mp3',
            image: './assets/pics/86122814_2786230231466069_7201198290258362368_n.jpg'
        },
        {
            name: 'Cơn Mưa Băng Giá',
            singer: 'Bằng Kiều',
            path: './assets/songs/conmuabanggia.mp3',
            image: './assets/pics/86086834_2844589745580366_6524407063265673216_n.jpg'
        },
        {
            name: 'Bầu Ơi Em Đừng Khóc',
            singer: 'Cố Ca Sĩ Phi Nhung',
            path: './assets/songs/bauoiemdungkhoc.mp3',
            image: './assets/pics/86122814_2786230231466069_7201198290258362368_n.jpg'
        },
        {
            name: 'Hà Nội mùa vắng những cơn mưa',
            singer: 'Bằng Kiều',
            path: './assets/songs/HaNoimuavangnhungconmua.mp3',
            image: './assets/pics/86303521_2728648323848764_877743740226109440_n.jpg'
        },
        {
            name: 'Home',
            singer: 'Micheal Bubble',
            path: './assets/songs/Home.mp3',
            image: './assets/pics/86308380_3153412261349309_4231681146166968320_n.jpg'
        },
        {
            name: 'Nỗi Nhớ Nơi Con Tim Mồ Côi',
            singer: 'Ưng Hoàng Phúc',
            path: './assets/songs/noinhonicontimmocoi.mp3',
            image: './assets/pics/86379226_2816684481753230_24701580984975360_n.jpg'
        },
        {
            name: 'One Love',
            singer: 'Blue',
            path: './assets/songs/onelove.mp3',
            image: './assets/pics/86379226_2816684481753230_24701580984975360_n.jpg'
        },
        {
            name: 'Phượng Hồng',
            singer: 'Bằng Kiều',
            path: './assets/songs/phuonghong.mp3',
            image: './assets/pics/86379226_2816684481753230_24701580984975360_n.jpg'
        },
        {
            name: 'Sau Tất Cả',
            singer: 'Erik',
            path: './assets/songs/sautatca.mp3',
            image: './assets/pics/86379226_2816684481753230_24701580984975360_n.jpg'
        },
        {
            name: 'Tình Yêu Hoa Gió',
            singer: 'Trương Thế Vinh',
            path: './assets/songs/tinhyeuhoagio.mp3',
            image: './assets/pics/87777317_3013596788660431_550676457307766784_n.jpg'
        }
    ],
    setConfig: function (key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                    <div class="thumb"
                        style="background-image: url('${song.image}');"></div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        })
        playlist.innerHTML = htmls.join('');

    },
    defineProperties: function () {
        Object.defineProperty(this, "currentSong", {
            get: function () {
                return this.songs[this.currentIndex];
            }
        });
    },
    handleEvents: function () {
        const cdWidth = cd.offsetWidth;
        const _this = this;
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 10000,
            iterations: Infinity
        })
        cdThumbAnimate.pause()

        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCDWidth = cdWidth - scrollTop;

            cd.style.width = newCDWidth > 0 ? newCDWidth + 'px' : 0
            cd.style.opacity = newCDWidth / cdWidth;
        }
        //Xử lý nút play
        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause()
            } else {
                audio.play()
            }
        }
        //Xử lý khi song được play
        audio.onplay = function () {
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
        }
        //Xử lý khi song bị pause
        audio.onpause = function () {
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }
        //Cho range chạy theo tiến trình bài hát
        audio.ontimeupdate = function () {
            const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
            progress.value = progressPercent
        }
        // Xử lý seek bài hát
        progress.onchange = function (e) {
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime
        }
        //Xử lý event Btn Next
        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()

        }
        //Xử lý event Btn Previous
        prevBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.prevSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }
        //Xử lý bật/tắt random
        randomBtn.onclick = function () {
            _this.isRandom = !_this.isRandom
            _this.setConfig('isRandom', _this.isRandom)
            randomBtn.classList.toggle('active', _this.isRandom)
        }
        //Xử lý On Ended of Songs
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play()
            } else {
                nextBtn.click()
            }
        }
        //Xử lý trường hợp Repeat
        repeatBtn.onclick = function () {
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat', _this.isRepeat)
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }
        // Lắng nghe sự kiện click vào playlist
        playlist.onclick = function (e) {
            const songNode = e.target.closest('.song:not(.active)')

            if (songNode || e.target.closest('.option')) {
                //Xử lý khi click vào Song
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }

                //Xử lý khi click vào Song Option
                if (e.target.closest('.option')) {

                }
            }
        }
    },
    scrollToActiveSong: function () {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            }, 300)
        })
    },
    loadCurrentSong: function () {

        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },
    loadConfig: function () {
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },
    nextSong: function () {
        this.currentIndex++
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong: function () {
        this.currentIndex--
        if (this.currentIndex <= 0) {
            this.currentIndex = 9
        }
        this.loadCurrentSong()
    },
    playRandomSong: function () {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)

        this.currentIndex = newIndex
        this.loadCurrentSong()
    },

    start: function () {
        //Gán cấu hình vào ứng dụng
        this.loadConfig();
        //Định nghĩa các thuộc tính cho Object
        this.defineProperties();
        //Lắng nghe và xử lí các sự kiện (DOM Events)
        this.handleEvents()

        //Tải thông tin bài hát đầu tiên vào UI
        this.loadCurrentSong()

        //Render playlist
        this.render()

        //Hiển thị trạng thái ban đầu của Btn Repeat & Random
        randomBtn.classList.toggle('active', this.isRandom)
        repeatBtn.classList.toggle('active', this.isRepeat)


    }
}
app.start()



